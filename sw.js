// Service Worker: macht ¡Vamos! offline-fähig
const CACHE = 'vamos-v1';
const FILES = [
  './',
  'assets/icons/apple-touch-icon.png',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png',
  'assets/icons/maskable-512.png',
  'assets/logo.png',
  'assets/spain-map.png',
  'css/app.css',
  'index.html',
  'js/app.js',
  'js/art.js',
  'js/data.js',
  'js/games/common.js',
  'js/games/memoria.js',
  'js/games/saque.js',
  'js/games/serpiente.js',
  'js/games/tres.js',
  'js/map.js',
  'js/screens/profil.js',
  'js/screens/rezept.js',
  'js/screens/scannen.js',
  'js/screens/spiele.js',
  'js/screens/start.js',
  'js/screens/tour.js',
  'js/screens/training.js',
  'js/screens/trophaeen.js',
  'js/store.js',
  'js/ui.js',
  'manifest.webmanifest',
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (url.origin === location.origin) {
    // Eigene Dateien: erst Netz (damit Updates ankommen), sonst Cache
    e.respondWith(fetch(e.request).then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match('./'))));
  } else if (url.hostname.includes('fonts.g')) {
    e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request).then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return res; })));
  }
});
