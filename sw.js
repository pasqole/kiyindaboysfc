const CACHE = 'kbfc-verify-v1';

// All member pages + root — pre-cached on install
const PRECACHE = [
  '/verify/',
  '/verify/index.html',
  '/verify/members.js',
  '/verify/KBFC001', '/verify/KBFC002', '/verify/KBFC003',
  '/verify/KBFC004', '/verify/KBFC005', '/verify/KBFC006',
  '/verify/KBFC007', '/verify/KBFC008', '/verify/KBFC009',
  '/verify/KBFC010', '/verify/KBFC011', '/verify/KBFC012',
  '/verify/KBFC013', '/verify/KBFC014', '/verify/KBFC015',
  '/verify/KBFC016', '/verify/KBFC017', '/verify/KBFC018',
  '/verify/KBFC019', '/verify/KBFC020', '/verify/KBFC021',
];

// Install — cache everything
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

// Activate — clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — cache first, network fallback
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match('/verify/'));
    })
  );
});
