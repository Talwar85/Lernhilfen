const CACHE_NAME = 'lernwerkstatt-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './matheteppich.html',
  './logikteppich.html',
  './schreibteppich.html',
  './leseteppich.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Installieren und Cachen
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Anfragen beantworten (Offline First Strategie)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Wenn im Cache, dann nimm Cache, sonst Netzwerk
      return response || fetch(event.request);
    })
  );
});

// Alte Caches löschen bei Update
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
            return caches.delete(key);
        }
      }));
    })
  );
});