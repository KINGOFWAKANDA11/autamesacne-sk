const crypto = require('node:crypto');
const { q } = require('./db');
const { SESSION_DAYS, COOKIE_SECURE } = require('./config');

const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');

function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64);
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

function verifyPassword(password, stored) {
  const [scheme, saltHex, hashHex] = String(stored).split('$');
  if (scheme !== 'scrypt') return false;
  const expected = Buffer.from(hashHex, 'hex');
  const actual = crypto.scryptSync(password, Buffer.from(saltHex, 'hex'), expected.length);
  return crypto.timingSafeEqual(actual, expected);
}

function validatePassword(pw) {
  if (typeof pw !== 'string' || pw.length < 8) return 'Heslo musí mať aspoň 8 znakov.';
  if (pw.length > 200) return 'Heslo je príliš dlhé.';
  return null;
}

function createSession(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = Date.now() + SESSION_DAYS * 864e5;
  q.run('INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)', sha(token), userId, expires);
  return { token, expires };
}

function cookieHeader(token, maxAgeSec) {
  return `sid=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAgeSec}${COOKIE_SECURE ? '; Secure' : ''}`;
}

function parseCookies(req) {
  const out = {};
  for (const part of (req.headers.cookie || '').split(';')) {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = part.slice(i + 1).trim();
  }
  return out;
}

function userFromRequest(req) {
  const token = parseCookies(req).sid;
  if (!token) return null;
  const row = q.get(
    `SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.status, u.access_until, s.expires_at
       FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ?`,
    sha(token)
  );
  if (!row) return null;
  if (row.expires_at < Date.now()) {
    q.run('DELETE FROM sessions WHERE token_hash = ?', sha(token));
    return null;
  }
  return row;
}

function destroySession(req) {
  const token = parseCookies(req).sid;
  if (token) q.run('DELETE FROM sessions WHERE token_hash = ?', sha(token));
}

function createResetToken(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  q.run('DELETE FROM reset_tokens WHERE user_id = ?', userId);
  q.run('INSERT INTO reset_tokens(token_hash,user_id,expires_at) VALUES(?,?,?)', sha(token), userId, Date.now() + 3600e3);
  return token;
}

function consumeResetToken(token) {
  const row = q.get('SELECT user_id, expires_at FROM reset_tokens WHERE token_hash = ?', sha(String(token)));
  if (!row) return null;
  q.run('DELETE FROM reset_tokens WHERE token_hash = ?', sha(String(token)));
  return row.expires_at > Date.now() ? row.user_id : null;
}

// jednoduchý limiter pokusov o prihlásenie (v pamäti, na IP + e-mail)
const attempts = new Map();
function loginThrottled(key) {
  const now = Date.now();
  const rec = (attempts.get(key) || []).filter((t) => now - t < 15 * 60e3);
  attempts.set(key, rec);
  return rec.length >= 8;
}
function loginFailed(key) {
  attempts.get(key)?.push(Date.now()) ?? attempts.set(key, [Date.now()]);
}
function loginOk(key) {
  attempts.delete(key);
}

module.exports = {
  hashPassword, verifyPassword, validatePassword, createSession, cookieHeader, userFromRequest,
  destroySession, createResetToken, consumeResetToken, loginThrottled, loginFailed, loginOk,
};
