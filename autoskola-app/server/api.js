const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { q, db, getSetting, setSetting } = require('./db');
const auth = require('./auth');
const payments = require('./payments');
const { HttpError, sendJson, readJson } = require('./http-utils');
const { DATA_DIR, MAX_UPLOAD_BYTES } = require('./config');

const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');
const UPLOAD_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.mp4', '.webm']);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const publicUser = (u) => ({ id: u.id, email: u.email, firstName: u.first_name, lastName: u.last_name, role: u.role, status: u.status });
const str = (v, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/* ---------- CMS zdroje (generický CRUD pre administráciu) ---------- */
const RESOURCES = {
  lessons: { table: 'lessons', cols: ['num', 'code', 'title', 'subs'], order: 'num', int: ['num'], json: ['subs'] },
  'sign-categories': { table: 'sign_categories', cols: ['pos', 'name'], order: 'pos, id', int: ['pos'] },
  signs: { table: 'signs', cols: ['category_id', 'pos', 'section', 'code', 'name', 'description', 'image'], order: 'category_id, pos, id', int: ['category_id', 'pos'] },
  'isec-categories': { table: 'isec_categories', cols: ['pos', 'name'], order: 'pos, id', int: ['pos'] },
  isec: { table: 'isec', cols: ['category_id', 'pos', 'num', 'text', 'image', 'video'], order: 'category_id, pos, id', int: ['category_id', 'pos', 'num'] },
  videos: { table: 'videos', cols: ['pos', 'title', 'file'], order: 'pos, id', int: ['pos'] },
  legislation: { table: 'legislation', cols: ['pos', 'title', 'url'], order: 'pos, id', int: ['pos'] },
};

function cleanRow(res, body) {
  const out = {};
  for (const c of res.cols) {
    let v = body[c];
    if (v === undefined) continue;
    if (res.int?.includes(c)) {
      v = Number(v);
      if (!Number.isInteger(v)) throw new HttpError(400, `Pole „${c}“ musí byť celé číslo.`);
    } else if (res.json?.includes(c)) {
      if (typeof v !== 'string') v = JSON.stringify(v);
      try { if (!Array.isArray(JSON.parse(v))) throw 0; } catch { throw new HttpError(400, `Pole „${c}“ má neplatný formát.`); }
    } else {
      v = String(v).slice(0, 200000);
    }
    out[c] = v;
  }
  return out;
}

function crud(req, res, user, resName, id, body) {
  const r = RESOURCES[resName];
  if (!r) throw new HttpError(404, 'Neznámy zdroj.');
  if (req.method === 'GET' && !id) return sendJson(res, 200, q.all(`SELECT * FROM ${r.table} ORDER BY ${r.order}`));
  if (req.method === 'GET') {
    const row = q.get(`SELECT * FROM ${r.table} WHERE id = ?`, id);
    if (!row) throw new HttpError(404, 'Nenájdené.');
    return sendJson(res, 200, row);
  }
  try {
    if (req.method === 'POST' && !id) {
      const row = cleanRow(r, body);
      const keys = Object.keys(row);
      const info = q.run(`INSERT INTO ${r.table}(${keys.join(',')}) VALUES(${keys.map(() => '?').join(',')})`, ...keys.map((k) => row[k]));
      return sendJson(res, 201, q.get(`SELECT * FROM ${r.table} WHERE id = ?`, Number(info.lastInsertRowid)));
    }
    if (req.method === 'PUT' && id) {
      const row = cleanRow(r, body);
      const keys = Object.keys(row);
      if (keys.length) q.run(`UPDATE ${r.table} SET ${keys.map((k) => `${k}=?`).join(',')} WHERE id = ?`, ...keys.map((k) => row[k]), id);
      return sendJson(res, 200, q.get(`SELECT * FROM ${r.table} WHERE id = ?`, id));
    }
    if (req.method === 'DELETE' && id) {
      q.run(`DELETE FROM ${r.table} WHERE id = ?`, id);
      return sendJson(res, 200, { ok: true });
    }
  } catch (e) {
    if (e instanceof HttpError) throw e;
    if (/UNIQUE/.test(e.message)) throw new HttpError(409, 'Takáto hodnota už existuje (napr. číslo lekcie).');
    if (/FOREIGN KEY|NOT NULL/.test(e.message)) throw new HttpError(400, 'Neplatné alebo chýbajúce údaje.');
    throw e;
  }
  throw new HttpError(405, 'Metóda nie je podporovaná.');
}

/* ---------- vyhľadávanie ---------- */
const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const plain = (html) => String(html || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

function snippet(text, needle) {
  const t = plain(text);
  const i = norm(t).indexOf(needle);
  if (i < 0) return t.slice(0, 90);
  const s = Math.max(0, i - 35);
  return (s > 0 ? '…' : '') + t.slice(s, s + 110) + (s + 110 < t.length ? '…' : '');
}

function search(rawQuery) {
  const needle = norm(rawQuery).trim();
  if (needle.length < 2) return [];
  const out = [];
  for (const l of q.all('SELECT * FROM lessons ORDER BY num')) {
    const head = `${l.num}. lekcia ${l.code} ${l.title}`;
    if (norm(head).includes(needle)) out.push({ type: 'Lekcie', title: `${l.num}. LEKCIA – ${l.code}`, text: l.title, href: `#/lekcie/${l.num}` });
    JSON.parse(l.subs).forEach((s, i) => {
      const hay = `${s.title} ${plain(s.html)}`;
      if (norm(hay).includes(needle)) out.push({ type: 'Lekcie', title: `${l.num}. ${l.code} – ${s.title}`, text: snippet(hay, needle), href: `#/lekcie/${l.num}/${i}` });
    });
  }
  for (const s of q.all('SELECT * FROM signs ORDER BY category_id, pos')) {
    if (norm(`${s.code} ${s.name} ${s.description}`).includes(needle)) out.push({ type: 'Značky', title: `${s.code} ${s.name}`.trim(), text: snippet(s.description, needle), href: `#/znacky/${s.category_id}/${s.id}` });
  }
  for (const s of q.all('SELECT * FROM isec ORDER BY category_id, pos')) {
    if (norm(`križovatka ${s.num} ${s.text}`).includes(needle)) out.push({ type: 'Križovatky', title: `Situácia č. ${s.num}`, text: snippet(s.text, needle), href: `#/krizovatky/${s.category_id}/${s.id}` });
  }
  for (const v of q.all('SELECT * FROM videos ORDER BY pos')) {
    if (norm(v.title).includes(needle)) out.push({ type: 'Videá', title: v.title, text: '', href: `#/videa/${v.id}` });
  }
  for (const l of q.all('SELECT * FROM legislation ORDER BY pos')) {
    if (norm(l.title).includes(needle)) out.push({ type: 'Legislatíva', title: l.title, text: '', href: '#/legislativa' });
  }
  return out.slice(0, 40);
}

/* ---------- upload ---------- */
function handleUpload(req, res, url) {
  const ext = path.extname(url.searchParams.get('name') || '').toLowerCase();
  if (!UPLOAD_EXT.has(ext)) throw new HttpError(400, `Nepodporovaný typ súboru. Povolené: ${[...UPLOAD_EXT].join(', ')}`);
  const declared = Number(req.headers['content-length'] || 0);
  if (declared > MAX_UPLOAD_BYTES) throw new HttpError(413, 'Súbor je príliš veľký.');
  const name = `${Date.now().toString(36)}-${crypto.randomBytes(5).toString('hex')}${ext}`;
  const file = path.join(UPLOAD_DIR, name);
  const out = fs.createWriteStream(file);
  let size = 0;
  let failed = false;
  req.on('data', (c) => {
    size += c.length;
    if (size > MAX_UPLOAD_BYTES && !failed) {
      failed = true;
      out.destroy();
      fs.rm(file, () => {});
      sendJson(res, 413, { error: 'Súbor je príliš veľký.' });
      req.destroy();
    }
  });
  req.pipe(out);
  out.on('finish', () => { if (!failed) sendJson(res, 201, { url: `/media/${name}`, size }); });
  out.on('error', () => { if (!failed) sendJson(res, 500, { error: 'Súbor sa nepodarilo uložiť.' }); });
}

/* ---------- hlavný router ---------- */
async function handleApi(req, res, url) {
  const p = url.pathname.replace(/^\/api\//, '').replace(/\/+$/, '');
  const parts = p.split('/');
  const method = req.method;

  if (method !== 'GET' && method !== 'HEAD' && req.headers['x-requested-with'] !== '2bit') throw new HttpError(403, 'Neplatná požiadavka.');

  const user = auth.userFromRequest(req);
  const ip = req.socket.remoteAddress || '';
  const needUser = () => { if (!user) throw new HttpError(401, 'Prihláste sa.'); return user; };
  const needPaid = () => {
    needUser();
    if (user.role !== 'admin' && user.status !== 'active') throw new HttpError(402, 'Prístup sa aktivuje po úhrade.');
    return user;
  };
  const needAdmin = () => { if (needUser().role !== 'admin') throw new HttpError(403, 'Iba pre administrátora.'); return user; };

  /* --- verejné --- */
  if (p === 'config' && method === 'GET') {
    const pr = payments.price();
    return sendJson(res, 200, { priceCents: pr.amount_cents, currency: pr.currency, provider: pr.provider });
  }

  if (p === 'register' && method === 'POST') {
    if (auth.loginThrottled(`reg:${ip}`)) throw new HttpError(429, 'Príliš veľa pokusov. Skúste neskôr.');
    const b = await readJson(req);
    const email = str(b.email, 254).toLowerCase();
    const firstName = str(b.firstName, 80);
    const lastName = str(b.lastName, 80);
    if (!firstName || !lastName) throw new HttpError(400, 'Zadajte meno a priezvisko.');
    if (!EMAIL_RE.test(email)) throw new HttpError(400, 'Zadajte platný e-mail.');
    const pwErr = auth.validatePassword(b.password);
    if (pwErr) throw new HttpError(400, pwErr);
    if (b.consent !== true) throw new HttpError(400, 'Je potrebný súhlas so spracovaním osobných údajov a obchodnými podmienkami.');
    auth.loginFailed(`reg:${ip}`);
    if (q.get('SELECT id FROM users WHERE email = ?', email)) throw new HttpError(409, 'Tento e-mail je už zaregistrovaný. Prihláste sa.');
    const info = q.run(
      "INSERT INTO users(email,first_name,last_name,pass_hash,consent_at) VALUES(?,?,?,?,datetime('now'))",
      email, firstName, lastName, auth.hashPassword(b.password)
    );
    const u = q.get('SELECT * FROM users WHERE id = ?', Number(info.lastInsertRowid));
    const s = auth.createSession(u.id);
    const checkout = payments.startPayment(u);
    res.setHeader('Set-Cookie', auth.cookieHeader(s.token, 30 * 86400));
    return sendJson(res, 201, { user: publicUser(u), redirect: checkout.redirect });
  }

  if (p === 'login' && method === 'POST') {
    const b = await readJson(req);
    const email = str(b.email, 254).toLowerCase();
    const key = `${ip}|${email}`;
    if (auth.loginThrottled(key)) throw new HttpError(429, 'Príliš veľa pokusov. Skúste to o 15 minút.');
    const u = q.get('SELECT * FROM users WHERE email = ?', email);
    if (!u || !auth.verifyPassword(String(b.password || ''), u.pass_hash)) {
      auth.loginFailed(key);
      throw new HttpError(401, 'Nesprávny e-mail alebo heslo.');
    }
    auth.loginOk(key);
    const s = auth.createSession(u.id);
    res.setHeader('Set-Cookie', auth.cookieHeader(s.token, 30 * 86400));
    let pendingPayment = null;
    if (u.status !== 'active' && u.role !== 'admin') {
      pendingPayment = payments.startPayment(u).redirect;
    }
    return sendJson(res, 200, { user: publicUser(u), redirect: pendingPayment });
  }

  if (p === 'logout' && method === 'POST') {
    auth.destroySession(req);
    res.setHeader('Set-Cookie', auth.cookieHeader('', 0));
    return sendJson(res, 200, { ok: true });
  }

  if (p === 'forgot' && method === 'POST') {
    const b = await readJson(req);
    const email = str(b.email, 254).toLowerCase();
    if (auth.loginThrottled(`forgot:${ip}`)) throw new HttpError(429, 'Príliš veľa pokusov.');
    auth.loginFailed(`forgot:${ip}`);
    const u = q.get('SELECT * FROM users WHERE email = ?', email);
    if (u) {
      const token = auth.createResetToken(u.id);
      // Lokálna verzia nemá e-mailový server: odkaz sa vypíše do konzoly servera.
      console.log(`\n[obnova hesla] ${u.email}\n  http://${req.headers.host}/#/reset/${token}\n`);
    }
    return sendJson(res, 200, { ok: true }); // rovnaká odpoveď bez ohľadu na existenciu účtu
  }

  if (p === 'reset' && method === 'POST') {
    const b = await readJson(req);
    const pwErr = auth.validatePassword(b.password);
    if (pwErr) throw new HttpError(400, pwErr);
    const uid = auth.consumeResetToken(b.token);
    if (!uid) throw new HttpError(400, 'Odkaz na obnovu hesla je neplatný alebo vypršal.');
    q.run('UPDATE users SET pass_hash = ? WHERE id = ?', auth.hashPassword(b.password), uid);
    q.run('DELETE FROM sessions WHERE user_id = ?', uid);
    return sendJson(res, 200, { ok: true });
  }

  if (p === 'me' && method === 'GET') {
    const unpaid = user && user.role !== 'admin' && user.status !== 'active';
    return sendJson(res, 200, { user: user ? publicUser(user) : null, redirect: unpaid ? payments.startPayment(user).redirect : null });
  }

  /* --- platba --- */
  if (parts[0] === 'payment' && parts[1]) {
    needUser();
    const pay = q.get('SELECT * FROM payments WHERE id = ? AND user_id = ?', Number(parts[1]), user.id);
    if (!pay) throw new HttpError(404, 'Platba nenájdená.');
    if (method === 'GET' && !parts[2]) {
      return sendJson(res, 200, { id: pay.id, status: pay.status, amountCents: pay.amount_cents, currency: pay.currency, provider: pay.provider });
    }
    if (method === 'POST' && parts[2] === 'confirm') {
      if (pay.provider !== 'mock') throw new HttpError(400, 'Táto platba sa potvrdzuje cez platobnú bránu.');
      const b = await readJson(req);
      const digits = String(b.card || '').replace(/\s+/g, '');
      if (!/^\d{12,19}$/.test(digits)) throw new HttpError(400, 'Zadajte číslo karty (DEMO: ľubovoľných 16 číslic).');
      if (digits.endsWith('0002')) { // simulácia zamietnutej platby
        q.run("UPDATE payments SET status='failed' WHERE id = ?", pay.id);
        throw new HttpError(402, 'Platba bola zamietnutá (DEMO karta končiaca 0002).');
      }
      payments.markPaid(pay.id, `mock-${crypto.randomBytes(4).toString('hex')}`);
      return sendJson(res, 200, { ok: true });
    }
  }

  /* --- GDPR: export a zmazanie vlastného účtu --- */
  if (p === 'me/export' && method === 'GET') {
    needUser();
    const data = {
      user: q.get('SELECT id,email,first_name,last_name,role,status,consent_at,created_at FROM users WHERE id = ?', user.id),
      payments: q.all('SELECT id,provider,amount_cents,currency,status,created_at,paid_at FROM payments WHERE user_id = ?', user.id),
    };
    res.setHeader('Content-Disposition', 'attachment; filename="moje-udaje.json"');
    return sendJson(res, 200, data);
  }
  if (p === 'me' && method === 'DELETE') {
    needUser();
    const b = await readJson(req);
    const u = q.get('SELECT * FROM users WHERE id = ?', user.id);
    if (u.role === 'admin') throw new HttpError(400, 'Účet administrátora nie je možné zmazať.');
    if (!auth.verifyPassword(String(b.password || ''), u.pass_hash)) throw new HttpError(401, 'Nesprávne heslo.');
    q.run('DELETE FROM users WHERE id = ?', user.id);
    res.setHeader('Set-Cookie', auth.cookieHeader('', 0));
    return sendJson(res, 200, { ok: true });
  }

  /* --- obsah (iba po úhrade) --- */
  if (method === 'GET') {
    if (p === 'lessons') {
      needPaid();
      return sendJson(res, 200, q.all('SELECT num, code, title FROM lessons ORDER BY num'));
    }
    if (parts[0] === 'lessons' && parts[1]) {
      needPaid();
      const l = q.get('SELECT * FROM lessons WHERE num = ?', Number(parts[1]));
      if (!l) throw new HttpError(404, 'Lekcia neexistuje.');
      return sendJson(res, 200, { ...l, subs: JSON.parse(l.subs) });
    }
    if (p === 'signs') {
      needPaid();
      return sendJson(res, 200, {
        categories: q.all('SELECT * FROM sign_categories ORDER BY pos, id'),
        signs: q.all('SELECT * FROM signs ORDER BY category_id, pos, id'),
      });
    }
    if (p === 'isec') {
      needPaid();
      return sendJson(res, 200, {
        categories: q.all('SELECT * FROM isec_categories ORDER BY pos, id'),
        items: q.all('SELECT * FROM isec ORDER BY category_id, pos, id'),
      });
    }
    if (p === 'videos') { needPaid(); return sendJson(res, 200, q.all('SELECT * FROM videos ORDER BY pos, id')); }
    if (p === 'legislation') { needPaid(); return sendJson(res, 200, q.all('SELECT * FROM legislation ORDER BY pos, id')); }
    if (p === 'tests') {
      needPaid();
      return sendJson(res, 200, { url: getSetting('tests_url'), text: getSetting('tests_text') });
    }
    if (p === 'search') { needPaid(); return sendJson(res, 200, search(url.searchParams.get('q'))); }
  }

  /* --- administrácia --- */
  if (parts[0] === 'admin') {
    needAdmin();
    if (parts[1] === 'upload' && method === 'POST') return handleUpload(req, res, url);

    if (parts[1] === 'users') {
      if (method === 'GET') {
        return sendJson(res, 200, q.all(`SELECT u.id,u.email,u.first_name,u.last_name,u.role,u.status,u.created_at,
          (SELECT MAX(paid_at) FROM payments WHERE user_id=u.id AND status='paid') AS paid_at FROM users u ORDER BY u.id DESC`));
      }
      const id = Number(parts[2]);
      if (method === 'PATCH' && id) {
        const b = await readJson(req);
        if (!['pending', 'active'].includes(b.status)) throw new HttpError(400, 'Neplatný stav.');
        q.run('UPDATE users SET status = ? WHERE id = ?', b.status, id);
        return sendJson(res, 200, { ok: true });
      }
      if (method === 'DELETE' && id) {
        if (id === user.id) throw new HttpError(400, 'Nemôžete zmazať sami seba.');
        q.run('DELETE FROM users WHERE id = ?', id);
        return sendJson(res, 200, { ok: true });
      }
    }
    if (parts[1] === 'payments' && method === 'GET') {
      return sendJson(res, 200, q.all(`SELECT p.*, u.email FROM payments p JOIN users u ON u.id=p.user_id ORDER BY p.id DESC LIMIT 200`));
    }
    if (parts[1] === 'settings') {
      const keys = ['price_eur', 'tests_url', 'tests_text'];
      if (method === 'GET') return sendJson(res, 200, Object.fromEntries(keys.map((k) => [k, getSetting(k)])));
      if (method === 'PUT') {
        const b = await readJson(req);
        if (b.price_eur !== undefined && !(Number(b.price_eur) >= 0)) throw new HttpError(400, 'Neplatná cena.');
        for (const k of keys) if (b[k] !== undefined) setSetting(k, str(String(b[k]), 500));
        return sendJson(res, 200, { ok: true });
      }
    }
    const id = parts[2] ? Number(parts[2]) : null;
    const body = method === 'POST' || method === 'PUT' ? await readJson(req) : {};
    return crud(req, res, user, parts[1], id, body);
  }

  throw new HttpError(404, 'Nenájdené.');
}

module.exports = { handleApi, search, UPLOAD_DIR };
