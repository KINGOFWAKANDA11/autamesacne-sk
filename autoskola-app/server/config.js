const path = require('node:path');

const ROOT = path.join(__dirname, '..');

module.exports = {
  ROOT,
  PUBLIC_DIR: path.join(ROOT, 'public'),
  DATA_DIR: process.env.DATA_DIR || path.join(ROOT, 'data'),
  PORT: Number(process.env.PORT) || 3000,
  HOST: process.env.HOST || '127.0.0.1',
  // Za reverzným proxy s HTTPS nastavte COOKIE_SECURE=1
  COOKIE_SECURE: process.env.COOKIE_SECURE === '1',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@2bit.local',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || '',
  SESSION_DAYS: 30,
  MAX_UPLOAD_BYTES: 300 * 1024 * 1024,
};
