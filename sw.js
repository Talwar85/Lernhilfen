const CACHE_NAME = 'lernwerkstatt-v1.1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './HTML/leseteppich.html',
  './HTML/schreibteppich.html',
  './HTML/matheteppich.html',
  './HTML/logikteppich.html'
  // Falls du Bilder in den Tools hast, werden diese beim ersten Laden
  // durch die "Fetch"-Strategie unten automatisch mit gecacht.
];

// 1. Installieren: Wichtige Dateien sofort cachen
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching Files');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Aktivieren: Alte Caches löschen, wenn wir eine neue Version haben
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('Service Worker: Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});

// 3. Fetch: Anfragen abfangen (Erst Cache, dann Netzwerk)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Wenn im Cache gefunden, nimm es. Sonst lade es aus dem Netz.
      return response || fetch(event.request).then((networkResponse) => {
          // Optional: Neue Dinge, die wir laden, auch gleich in den Cache packen
          return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
          });
      });
    })
  );
});