// Spustenie: npm test   (používa dočasnú databázu, nič nemení v data/)
const test = require('node:test');
const assert = require('node:assert/strict');
const os = require('node:os');
const fs = require('node:fs');
const path = require('node:path');

process.env.DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), '2bit-test-'));
process.env.ADMIN_PASSWORD = 'admin-test-pass';

const { createServer, bootstrap } = require('./index');
const { q } = require('./db');

let server;
let base;
test.before(async () => {
  bootstrap();
  server = createServer();
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}`;
});
test.after(() => { server.closeAllConnections(); server.close(); fs.rmSync(process.env.DATA_DIR, { recursive: true, force: true }); });

async function call(method, url, { body, cookie, raw } = {}) {
  const headers = { 'X-Requested-With': '2bit' };
  if (cookie) headers.Cookie = cookie;
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const res = await fetch(base + url, { method, headers, body: body !== undefined ? JSON.stringify(body) : raw });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* nie JSON */ }
  return { status: res.status, json, cookie: (res.headers.get('set-cookie') || '').split(';')[0], res };
}

const DAY = 864e5;
const student = { email: 'student@test.sk', firstName: 'Ján', lastName: 'Test', password: 'heslo-12345', consent: true };

test('registrácia vyžaduje súhlas, platný e-mail a silné heslo', async () => {
  assert.equal((await call('POST', '/api/register', { body: { ...student, consent: false } })).status, 400);
  assert.equal((await call('POST', '/api/register', { body: { ...student, email: 'zle' } })).status, 400);
  assert.equal((await call('POST', '/api/register', { body: { ...student, password: 'krátke' } })).status, 400);
});

let adminCookie;
async function admin() {
  if (!adminCookie) adminCookie = (await call('POST', '/api/login', { body: { email: 'admin@2bit.local', password: 'admin-test-pass' } })).cookie;
  return adminCookie;
}

test('testovací režim (predvolený): registrácia aktivuje účet bez platby na 6 mesiacov', async () => {
  const reg = await call('POST', '/api/register', { body: { ...student, email: 'free@test.sk' } });
  assert.equal(reg.status, 201);
  assert.equal(reg.json.redirect, null);
  assert.equal(reg.json.user.access, true);
  const months = (reg.json.user.accessUntil - Date.now()) / DAY;
  assert.ok(months > 170 && months < 190, `student ~6 mesiacov, je ${months}`);
  assert.equal((await call('GET', '/api/lessons', { cookie: reg.cookie })).status, 200);
});

test('vypršaný prístup zablokuje obsah aj médiá; admin ho predĺži', async () => {
  const login = await call('POST', '/api/login', { body: { email: 'free@test.sk', password: student.password } });
  const uid = login.json.user.id;
  q.run('UPDATE users SET access_until = ? WHERE id = ?', Date.now() - 1000, uid);
  assert.equal((await call('GET', '/api/lessons', { cookie: login.cookie })).status, 402);
  assert.equal((await call('GET', '/media/seed-podvozok.svg', { cookie: login.cookie })).status, 401);
  const me = await call('GET', '/api/me', { cookie: login.cookie });
  assert.equal(me.json.user.access, false);
  assert.equal(me.json.expired, true);
  assert.equal((await call('PATCH', `/api/admin/users/${uid}`, { cookie: await admin(), body: { extendMonths: 3 } })).status, 200);
  assert.equal((await call('GET', '/api/lessons', { cookie: login.cookie })).status, 200);
});

test('učiteľ vytvorený adminom má iné trvanie prístupu ako žiak', async () => {
  const r = await call('POST', '/api/admin/users', { cookie: await admin(), body: { email: 'ucitel@test.sk', firstName: 'Uč', lastName: 'Iteľ', role: 'teacher', password: 'heslo-12345' } });
  assert.equal(r.status, 201);
  const l = await call('POST', '/api/login', { body: { email: 'ucitel@test.sk', password: 'heslo-12345' } });
  assert.equal(l.json.user.role, 'teacher');
  const months = (l.json.user.accessUntil - Date.now()) / DAY;
  assert.ok(months > 350 && months < 380, `učiteľ ~12 mesiacov, je ${months}`);
});

test('testy: otázky neprezrádzajú správne odpovede; vyhodnotenie na serveri', async () => {
  const cookie = (await call('POST', '/api/login', { body: { email: 'free@test.sk', password: student.password } })).cookie;
  const start = await call('POST', '/api/tests/start', { cookie, body: { mode: 'exam' } });
  assert.equal(start.status, 200);
  assert.ok(start.json.questions.length > 0);
  assert.ok(!JSON.stringify(start.json).includes('"correct"'), 'správne odpovede nesmú ísť klientovi');
  const answers = {};
  for (const qu of start.json.questions) {
    const row = q.get('SELECT answers FROM test_questions WHERE id = ?', qu.id);
    answers[qu.id] = JSON.parse(row.answers).map((a, i) => (a.correct ? i : -1)).filter((i) => i >= 0);
  }
  const done = await call('POST', `/api/tests/${start.json.attemptId}/submit`, { cookie, body: { answers } });
  assert.equal(done.json.percent, 100);
  assert.equal(done.json.passed, true);
  assert.equal((await call('POST', `/api/tests/${start.json.attemptId}/submit`, { cookie, body: { answers } })).status, 409);
  const bad = await call('POST', '/api/tests/start', { cookie, body: { mode: 'exam' } });
  const fail = await call('POST', `/api/tests/${bad.json.attemptId}/submit`, { cookie, body: { answers: {} } });
  assert.equal(fail.json.passed, false);
  const hist = await call('GET', '/api/tests/history', { cookie });
  assert.equal(hist.json.length, 2);
  const chk = await call('POST', '/api/tests/check', { cookie, body: { questionId: start.json.questions[0].id, selected: [] } });
  assert.equal(chk.json.correct, false);
});

test('admin: validácia a import otázok', async () => {
  const cookie = await admin();
  const bad = await call('POST', '/api/admin/test-questions', { cookie, body: { text: 'Q?', answers: [{ text: 'a', correct: false }, { text: 'b', correct: false }] } });
  assert.equal(bad.status, 400);
  const imp = await call('POST', '/api/admin/test-questions-import', { cookie, body: { questions: [{ category: 'X', text: 'Q1?', answers: [{ text: 'a', correct: true }, { text: 'b' }] }] } });
  assert.equal(imp.json.imported, 1);
  assert.equal((await call('POST', '/api/admin/test-questions-import', { cookie, body: { questions: [{ text: 'bez odpovedí' }] } })).status, 400);
});

test('platobná brána DEMO: obsah je zamknutý do úhrady; platba ho odomkne', async () => {
  assert.equal((await call('PUT', '/api/admin/settings', { cookie: await admin(), body: { payment_mode: 'mock' } })).status, 200);
  assert.equal((await call('GET', '/api/lessons')).status, 401);
  const reg = await call('POST', '/api/register', { body: student });
  assert.equal(reg.status, 201);
  const cookie = reg.cookie;
  assert.equal((await call('GET', '/api/lessons', { cookie })).status, 402);
  assert.equal((await call('GET', '/media/seed-podvozok.svg', { cookie })).status, 401);
  const payId = Number(reg.json.redirect.split('/').pop());
  const bad = await call('POST', `/api/payment/${payId}/confirm`, { cookie, body: { card: '4000000000000002' } });
  assert.equal(bad.status, 402);
  assert.equal((await call('GET', '/api/lessons', { cookie })).status, 402);
  const ok = await call('POST', `/api/payment/${payId}/confirm`, { cookie, body: { card: '4242424242424242' } });
  assert.equal(ok.status, 200);
  const lessons = await call('GET', '/api/lessons', { cookie });
  assert.equal(lessons.status, 200);
  assert.equal(lessons.json.length, 32);
  assert.equal((await call('GET', '/media/seed-podvozok.svg', { cookie })).status, 200);
});

test('študent nemá prístup do administrácie ani cudzích platieb', async () => {
  const login = await call('POST', '/api/login', { body: { email: student.email, password: student.password } });
  assert.equal(login.status, 200);
  assert.equal((await call('GET', '/api/admin/users', { cookie: login.cookie })).status, 403);
  assert.equal((await call('GET', '/api/payment/1', { cookie: login.cookie })).status, 200);
  assert.equal((await call('GET', '/api/payment/9999', { cookie: login.cookie })).status, 404);
});

test('zlé heslo a opakované pokusy sa odmietnu', async () => {
  const r = await call('POST', '/api/login', { body: { email: student.email, password: 'nespravne' } });
  assert.equal(r.status, 401);
  let last;
  for (let i = 0; i < 10; i++) last = await call('POST', '/api/login', { body: { email: 'x@y.sk', password: 'a' } });
  assert.equal(last.status, 429);
});

test('zmeny vyžadujú hlavičku X-Requested-With (ochrana CSRF)', async () => {
  const res = await fetch(`${base}/api/logout`, { method: 'POST' });
  assert.equal(res.status, 403);
});

test('administrátor: CRUD, upload s allowlistom a vyhľadávanie bez diakritiky', async () => {
  const login = await call('POST', '/api/login', { body: { email: 'admin@2bit.local', password: 'admin-test-pass' } });
  const cookie = login.cookie;
  const created = await call('POST', '/api/admin/legislation', { cookie, body: { pos: 9, title: 'Test predpis', url: 'https://example.com' } });
  assert.equal(created.status, 201);
  assert.equal((await call('DELETE', `/api/admin/legislation/${created.json.id}`, { cookie })).status, 200);
  assert.equal((await call('POST', '/api/admin/legislation', { cookie, body: { pos: 'abc', title: 'x' } })).status, 400);
  assert.equal((await call('POST', '/api/admin/upload?name=zly.exe', { cookie, raw: 'x' })).status, 400);
  const up = await call('POST', '/api/admin/upload?name=ok.png', { cookie, raw: Buffer.from([0x89, 0x50]) });
  assert.equal(up.status, 201);
  assert.match(up.json.url, /^\/media\/[\w.-]+\.png$/);
  const found = await call('GET', '/api/search?q=konstrukcie', { cookie });
  assert.ok(found.json.some((r) => r.href.startsWith('#/lekcie/1')));
  const dup = await call('POST', '/api/admin/lessons', { cookie, body: { num: 1, code: 'X', title: '', subs: '[]' } });
  assert.equal(dup.status, 409);
});

test('GDPR: export a zmazanie účtu', async () => {
  const login = await call('POST', '/api/login', { body: { email: student.email, password: student.password } });
  const exp = await call('GET', '/api/me/export', { cookie: login.cookie });
  assert.equal(exp.json.user.email, student.email);
  assert.equal((await call('DELETE', '/api/me', { cookie: login.cookie, body: { password: 'zle' } })).status, 401);
  assert.equal((await call('DELETE', '/api/me', { cookie: login.cookie, body: { password: student.password } })).status, 200);
  assert.equal((await call('POST', '/api/login', { body: { email: student.email, password: student.password } })).status, 401);
});

test('statické súbory: path traversal je zablokovaný', async () => {
  const res = await fetch(`${base}/..%2Fserver%2Fconfig.js`);
  assert.notEqual(res.status, 200);
  assert.equal((await fetch(`${base}/`)).status, 200);
});
