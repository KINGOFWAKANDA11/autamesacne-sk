// Vlastný testovací modul: skúšobný test (časový limit, vyhodnotenie na konci) a cvičenie po otázkach
// s okamžitou spätnou väzbou. Správne odpovede server posiela až po odpovedi / odovzdaní.
const { q, db, getSetting } = require('./db');
const { HttpError } = require('./http-utils');

const num = (key, def) => {
  const n = Number(getSetting(key, String(def)));
  return Number.isFinite(n) && n > 0 ? n : def;
};

function examConfig() {
  return { questions: num('exam_questions', 25), minutes: num('exam_minutes', 30), passPercent: num('exam_pass_percent', 90) };
}

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const parseAnswers = (row) => JSON.parse(row.answers);
const sameSet = (a, b) => a.length === b.length && a.every((x) => b.includes(x));

function publicQuestion(row) {
  const answers = parseAnswers(row);
  return {
    id: row.id, text: row.text, image: row.image, category: row.category,
    multi: answers.filter((a) => a.correct).length > 1,
    answers: shuffle(answers.map((a, i) => ({ i, text: a.text }))),
  };
}

function meta() {
  const cats = q.all("SELECT category AS name, COUNT(*) AS count FROM test_questions GROUP BY category ORDER BY category");
  return { total: cats.reduce((n, c) => n + c.count, 0), categories: cats, exam: examConfig() };
}

function start(user, body) {
  const mode = body.mode === 'exam' ? 'exam' : 'practice';
  const category = typeof body.category === 'string' ? body.category : '';
  const pool = category ? q.all('SELECT id FROM test_questions WHERE category = ?', category) : q.all('SELECT id FROM test_questions');
  if (!pool.length) throw new HttpError(400, 'Pre tento výber zatiaľ nie sú žiadne otázky.');
  const cfg = examConfig();
  const ids = shuffle(pool.map((r) => r.id)).slice(0, mode === 'exam' ? cfg.questions : 100);
  const info = q.run('INSERT INTO test_attempts(user_id,mode,category,qids,started_at,total) VALUES(?,?,?,?,?,?)', user.id, mode, category, JSON.stringify(ids), Date.now(), ids.length);
  const questions = ids.map((id) => publicQuestion(q.get('SELECT * FROM test_questions WHERE id = ?', id)));
  return { attemptId: Number(info.lastInsertRowid), mode, minutes: mode === 'exam' ? cfg.minutes : null, passPercent: cfg.passPercent, questions };
}

function check(body) {
  const row = q.get('SELECT * FROM test_questions WHERE id = ?', Number(body.questionId));
  if (!row) throw new HttpError(404, 'Otázka neexistuje.');
  const answers = parseAnswers(row);
  const right = answers.map((a, i) => (a.correct ? i : -1)).filter((i) => i >= 0);
  const selected = Array.isArray(body.selected) ? body.selected.map(Number) : [];
  return { correct: sameSet(selected, right), right, explanation: row.explanation };
}

function submit(user, attemptId, body) {
  const att = q.get('SELECT * FROM test_attempts WHERE id = ? AND user_id = ?', attemptId, user.id);
  if (!att) throw new HttpError(404, 'Test neexistuje.');
  if (att.finished_at) throw new HttpError(409, 'Test je už odovzdaný.');
  const given = body.answers && typeof body.answers === 'object' ? body.answers : {};
  const cfg = examConfig();
  const results = JSON.parse(att.qids).map((id) => {
    const row = q.get('SELECT * FROM test_questions WHERE id = ?', id);
    if (!row) return null;
    const answers = parseAnswers(row);
    const right = answers.map((a, i) => (a.correct ? i : -1)).filter((i) => i >= 0);
    const selected = Array.isArray(given[id]) ? given[id].map(Number) : [];
    return {
      id, text: row.text, image: row.image, explanation: row.explanation, ok: sameSet(selected, right),
      answers: answers.map((a, i) => ({ text: a.text, correct: !!a.correct, selected: selected.includes(i) })),
    };
  }).filter(Boolean);
  const correct = results.filter((r) => r.ok).length;
  const percent = results.length ? Math.round((correct / results.length) * 100) : 0;
  const late = att.mode === 'exam' && Date.now() - att.started_at > (cfg.minutes * 60 + 60) * 1000; // 60 s rezerva na odoslanie
  const passed = att.mode === 'exam' && !late && percent >= cfg.passPercent;
  q.run('UPDATE test_attempts SET finished_at=?, total=?, correct=?, passed=? WHERE id=?', Date.now(), results.length, correct, passed ? 1 : 0, att.id);
  return { mode: att.mode, total: results.length, correct, percent, passed, late, passPercent: cfg.passPercent, results };
}

function history(user) {
  return q.all(
    `SELECT id, mode, category, started_at, finished_at, total, correct, passed FROM test_attempts
      WHERE user_id = ? AND finished_at IS NOT NULL ORDER BY id DESC LIMIT 30`, user.id);
}

/* ---------- správa otázok (CMS) ---------- */
function validateQuestion(b) {
  const text = String(b.text ?? '').trim();
  if (!text) throw new HttpError(400, 'Zadajte text otázky.');
  let answers = b.answers;
  if (typeof answers === 'string') { try { answers = JSON.parse(answers); } catch { answers = null; } }
  if (!Array.isArray(answers) || answers.length < 2) throw new HttpError(400, 'Otázka musí mať aspoň 2 odpovede.');
  answers = answers.map((a) => ({ text: String(a.text ?? '').trim(), correct: !!a.correct }));
  if (answers.some((a) => !a.text)) throw new HttpError(400, 'Odpovede nesmú byť prázdne.');
  if (!answers.some((a) => a.correct)) throw new HttpError(400, 'Označte aspoň jednu správnu odpoveď.');
  return { category: String(b.category ?? '').trim().slice(0, 100), text: text.slice(0, 2000), image: String(b.image ?? '').slice(0, 300), explanation: String(b.explanation ?? '').slice(0, 5000), answers: JSON.stringify(answers) };
}

function importQuestions(list) {
  if (!Array.isArray(list) || !list.length) throw new HttpError(400, 'Očakáva sa neprázdne pole otázok.');
  if (list.length > 5000) throw new HttpError(400, 'Naraz je možné importovať najviac 5000 otázok.');
  const rows = list.map((b, i) => {
    try { return validateQuestion(b); } catch (e) { throw new HttpError(400, `Otázka č. ${i + 1}: ${e.message}`); }
  });
  db.exec('BEGIN');
  try {
    for (const r of rows) q.run('INSERT INTO test_questions(category,text,image,explanation,answers) VALUES(?,?,?,?,?)', r.category, r.text, r.image, r.explanation, r.answers);
    db.exec('COMMIT');
  } catch (e) { db.exec('ROLLBACK'); throw e; }
  return rows.length;
}

module.exports = { meta, start, check, submit, history, validateQuestion, importQuestions, examConfig };
