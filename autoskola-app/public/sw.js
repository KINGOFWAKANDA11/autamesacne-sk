// Service worker: aplikačná kostra funguje offline, dáta (/api, /media) sa vždy berú zo servera,
// takže obsah za platobnou bránou sa nikdy nekešuje.
const CACHE = 'shell-v1';
const SHELL = ['/', '/index.html', '/css/app.css', '/js/app.js', '/js/util.js', '/js/admin.js', '/logo.svg', '/manifest.webmanifest'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/media/')) return;
  // network-first: po úprave súborov sa vždy zobrazí aktuálna verzia, offline sa použije kópia
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res.ok) caches.open(CACHE).then((c) => c.put(e.request, res.clone()));
        return res;
      })
      .catch(() => caches.match(e.request).then((r) => r || caches.match('/index.html')))
  );
});
