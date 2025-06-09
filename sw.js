
const CACHE_NAME = 'hizkibira-cache-v2'; // Cache version incremented
const urlsToPreCache = [
  '/',
  '/index.html',
  '/index.tsx', // Added main application script to precache
  '/manifest.json',
  '/synonyms.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache for precaching');
        return cache.addAll(urlsToPreCache);
      })
      .catch(err => {
        console.error('Failed to pre-cache resources during install:', err);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse; // Serve from cache
        }

        // Not in cache, fetch from network
        return fetch(event.request).then(
          (networkResponse) => {
            // Check if we received a valid response to cache
            if (networkResponse &&
                ( (networkResponse.status === 200 && (networkResponse.type === 'basic' || networkResponse.type === 'cors')) ||
                  networkResponse.type === 'opaque') // For no-cors requests like CDNs
            ) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }
            return networkResponse;
          }
        ).catch(() => {
          console.warn('Network request failed, and not in cache:', event.request.url);
          // Optionally, return a custom offline page for navigation requests:
          // if (event.request.mode === 'navigate') {
          //   return caches.match('/offline.html');
          // }
        });
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // Delete old caches
          }
        })
      );
    })
  );
});