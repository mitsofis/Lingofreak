const CACHE_NAME = 'lingofreak-cache-v3';
const urlsToCache = [
  '/Lingofreak/Entdecke.html',
  '/Lingofreak/G-Unit1.html',
  '/Lingofreak/manifest.json',
  '/Lingofreak/icon-192.png',
  '/Lingofreak/icon-512.png'
];

// Install service worker and cache essential files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Serve cached files when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

// Cleanup old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (!cacheWhitelist.includes(key)) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});
