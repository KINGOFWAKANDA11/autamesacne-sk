// Spustenie: npm test   (používa dočasnú databázu, nič nemení v data/)
const test = require('node:test');
const assert = require('node:assert/strict');
const os = require('node:os');
const fs = require('node:fs');
const path = require('node:path');

process.env.DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), '2bit-test-'));
process.env.ADMIN_PASSWORD = 'admin-test-pass';

const { createServer, bootstrap } = require('./index');

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

const student = { email: 'student@test.sk', firstName: 'Ján', lastName: 'Test', password: 'heslo-12345', consent: true };

test('registrácia vyžaduje súhlas, platný e-mail a silné heslo', async () => {
  assert.equal((await call('POST', '/api/register', { body: { ...student, consent: false } })).status, 400);
  assert.equal((await call('POST', '/api/register', { body: { ...student, email: 'zle' } })).status, 400);
  assert.equal((await call('POST', '/api/register', { body: { ...student, password: 'krátke' } })).status, 400);
});

test('obsah je zamknutý do úhrady; platba ho odomkne', async () => {
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
