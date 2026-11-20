// Service Worker: macht ¡Vamos! offline-fähig
const CACHE = 'vamos-v9';
const IMG = 'vamos-img-v1';
const FILES = [
  './',
  'assets/fonts/roboto-latin-400-normal.woff2',
  'assets/fonts/roboto-latin-500-normal.woff2',
  'assets/fonts/roboto-latin-700-normal.woff2',
  'assets/fonts/roboto-latin-900-normal.woff2',
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
  'js/config.js',
  'js/push.js',
  'js/photos.js',
  'js/wiki.js',
  'js/screens/bildnachweise.js',
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
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== IMG).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (url.origin === location.origin) {
    // Eigene Dateien: erst Netz (damit Updates ankommen), sonst Cache
    e.respondWith(fetch(e.request).then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match('./'))));
  } else if (url.hostname === 'upload.wikimedia.org') {
    // Wikipedia-Fotos: einmal geladen, dann auch offline verfügbar
    e.respondWith(caches.open(IMG).then((c) => c.match(e.request).then((r) => r || fetch(e.request).then((res) => { if (res.ok || res.type === 'opaque') c.put(e.request, res.clone()); return res; }))));
  } else if (url.hostname.includes('fonts.g')) {
    e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request).then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return res; })));
  }
});

// ---------- Push-Erinnerungen ----------
self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = { title: '¡Vamos!', body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || '¡Vamos!', {
    body: d.body || 'Zeit für dein Spanisch-Training!',
    icon: 'assets/icons/icon-192.png',
    badge: 'assets/icons/icon-192.png',
    tag: d.tag || 'vamos-training',
    renotify: true,
    requireInteraction: true,
    vibrate: [200, 100, 200, 100, 400],
    data: { url: d.url || './#/training', ack: d.ack || '' },
  }));
});
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const { url, ack } = e.notification.data || {};
  e.waitUntil((async () => {
    if (ack) { try { await fetch(ack, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' }); } catch (err) { /* offline */ } }
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of all) { if ('focus' in c) { await c.focus(); if ('navigate' in c && url) { try { await c.navigate(url); } catch (err) { /* */ } } return; } }
    if (self.clients.openWindow) await self.clients.openWindow(url || './');
  })());
});
