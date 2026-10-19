const http = require('node:http');
const path = require('node:path');
const crypto = require('node:crypto');
const { PORT, HOST, PUBLIC_DIR, ADMIN_EMAIL, ADMIN_PASSWORD } = require('./config');
const { q } = require('./db');
const auth = require('./auth');
const { seed } = require('./seed');
const { handleApi, UPLOAD_DIR } = require('./api');
const { HttpError, sendJson, sendFile } = require('./http-utils');

const CSP = "default-src 'self'; img-src 'self' data:; media-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'";

function bootstrap() {
  if (seed()) console.log('Vložený úvodný obsah (32 lekcií, značky, križovatky, videá, legislatíva).');
  if (!q.get("SELECT id FROM users WHERE role = 'admin'")) {
    const password = ADMIN_PASSWORD || crypto.randomBytes(9).toString('base64url');
    q.run("INSERT INTO users(email,first_name,last_name,pass_hash,role,status) VALUES(?,?,?,?,'admin','active')",
      ADMIN_EMAIL, 'Admin', '2BIT', auth.hashPassword(password));
    console.log('\n=== Vytvorený administrátorský účet ===');
    console.log(`  e-mail: ${ADMIN_EMAIL}`);
    console.log(`  heslo : ${password}${ADMIN_PASSWORD ? '' : '   (zobrazené iba raz – zapíšte si ho)'}\n`);
  }
}

function createServer() {
  return http.createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'same-origin');
    try {
      const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

      if (url.pathname.startsWith('/api/')) {
        await handleApi(req, res, url);
        return;
      }

      if (url.pathname.startsWith('/media/')) {
        const user = auth.userFromRequest(req);
        if (!user || !(user.role === 'admin' || (user.status === 'active' && (!user.access_until || user.access_until > Date.now())))) throw new HttpError(401, 'Prístup len pre prihlásených s aktívnym účtom.');
        const name = decodeURIComponent(url.pathname.slice(7));
        if (!/^[\w.-]+$/.test(name)) throw new HttpError(400, 'Neplatná cesta.');
        // SVG z CMS sa zobrazuje iba ako obrázok; sandbox bráni vykonaniu skriptov pri priamom otvorení
        if (sendFile(req, res, path.join(UPLOAD_DIR, name), { 'Cache-Control': 'private, max-age=3600', 'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox" })) return;
        throw new HttpError(404, 'Súbor neexistuje.');
      }

      let rel = decodeURIComponent(url.pathname);
      if (rel === '/') rel = '/index.html';
      const file = path.normalize(path.join(PUBLIC_DIR, rel));
      if (!file.startsWith(PUBLIC_DIR + path.sep)) throw new HttpError(400, 'Neplatná cesta.');
      const headers = { 'Cache-Control': 'no-cache' };
      if (file.endsWith('.html')) headers['Content-Security-Policy'] = CSP;
      if (sendFile(req, res, file, headers)) return;
      throw new HttpError(404, 'Nenájdené.');
    } catch (e) {
      if (res.headersSent) { res.end(); return; }
      if (e instanceof HttpError) return sendJson(res, e.status, { error: e.message });
      console.error(e);
      sendJson(res, 500, { error: 'Chyba servera.' });
    }
  });
}

if (require.main === module) {
  bootstrap();
  createServer().listen(PORT, HOST, () => {
    console.log(`2BIT autoškola beží na http://${HOST}:${PORT}`);
  });
}

module.exports = { createServer, bootstrap };
