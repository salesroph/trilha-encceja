/* The app remains online-first. Nothing is cached, including Supabase data. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  // Network-only keeps lessons, sessions, and progress out of browser caches.
  event.respondWith(fetch(event.request));
});
