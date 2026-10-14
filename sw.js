// Service worker di Chef a Casa: usa la rete quando c'è, la cache quando sei offline.
const C = 'chef-v2';
const A = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(A)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(n => { const k = n.clone(); caches.open(C).then(c => c.put(e.request, k)).catch(() => {}); return n; })
      .catch(() => caches.match(e.request))
  );
});
