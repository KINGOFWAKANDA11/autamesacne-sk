const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');
const { DATA_DIR } = require('./config');

fs.mkdirSync(path.join(DATA_DIR, 'uploads'), { recursive: true });

const db = new DatabaseSync(path.join(DATA_DIR, 'app.db'));
db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  pass_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student',
  status TEXT NOT NULL DEFAULT 'pending',   -- pending | active
  consent_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS reset_tokens (
  token_hash TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'created',   -- created | paid | failed
  ref TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  paid_at TEXT
);
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);

CREATE TABLE IF NOT EXISTS lessons (
  id INTEGER PRIMARY KEY,
  num INTEGER NOT NULL UNIQUE,
  code TEXT NOT NULL,            -- napr. NVÚ 1
  title TEXT NOT NULL,           -- napr. Náuka o vozidlách a ich údržbe
  subs TEXT NOT NULL DEFAULT '[]' -- JSON: [{group?, title, html}]
);
CREATE TABLE IF NOT EXISTS sign_categories (
  id INTEGER PRIMARY KEY, pos INTEGER NOT NULL DEFAULT 0, name TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS signs (
  id INTEGER PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES sign_categories(id) ON DELETE CASCADE,
  pos INTEGER NOT NULL DEFAULT 0,
  section TEXT NOT NULL DEFAULT '',
  code TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS isec_categories (
  id INTEGER PRIMARY KEY, pos INTEGER NOT NULL DEFAULT 0, name TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS isec (
  id INTEGER PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES isec_categories(id) ON DELETE CASCADE,
  pos INTEGER NOT NULL DEFAULT 0,
  num INTEGER NOT NULL DEFAULT 0,
  text TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  video TEXT NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS videos (
  id INTEGER PRIMARY KEY, pos INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL, file TEXT NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS test_questions (
  id INTEGER PRIMARY KEY,
  category TEXT NOT NULL DEFAULT '',
  text TEXT NOT NULL,
  image TEXT NOT NULL DEFAULT '',
  explanation TEXT NOT NULL DEFAULT '',
  answers TEXT NOT NULL DEFAULT '[]'   -- JSON: [{text, correct}]
);
CREATE TABLE IF NOT EXISTS test_attempts (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mode TEXT NOT NULL,                  -- exam | practice
  category TEXT NOT NULL DEFAULT '',
  qids TEXT NOT NULL,
  started_at INTEGER NOT NULL,
  finished_at INTEGER,
  total INTEGER NOT NULL DEFAULT 0,
  correct INTEGER NOT NULL DEFAULT 0,
  passed INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS legislation (
  id INTEGER PRIMARY KEY, pos INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL, url TEXT NOT NULL DEFAULT ''
);
`);

// migrácia staršej databázy: platnosť prístupu
if (!db.prepare('PRAGMA table_info(users)').all().some((c) => c.name === 'access_until')) {
  db.exec('ALTER TABLE users ADD COLUMN access_until INTEGER');
}

const q = {
  all: (sql, ...p) => db.prepare(sql).all(...p),
  get: (sql, ...p) => db.prepare(sql).get(...p),
  run: (sql, ...p) => db.prepare(sql).run(...p),
};

function getSetting(key, fallback = '') {
  const r = q.get('SELECT value FROM settings WHERE key = ?', key);
  return r ? r.value : fallback;
}
function setSetting(key, value) {
  q.run('INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value', key, String(value));
}

module.exports = { db, q, getSetting, setSetting };
