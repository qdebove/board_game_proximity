self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('tableronde-static-v1').then((cache) => cache.addAll(['/','/manifest.json']))
    );
    self.skipWaiting();
  });
  
  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((keys) =>
        Promise.all(keys.filter((key) => key !== 'tableronde-static-v1').map((key) => caches.delete(key)))
      )
    );
    self.clients.claim();
  });
  
  self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          return cached;
        }
        return fetch(request)
          .then((response) => {
            const clone = response.clone();
            if (response.ok && request.url.startsWith(self.location.origin)) {
              caches.open('tableronde-static-v1').then((cache) => cache.put(request, clone));
            }
            return response;
          })
          .catch(() => caches.match('/')); // fallback to home
      })
    );
});