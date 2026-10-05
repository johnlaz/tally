/*
  TALLY ARS — Service Worker  (served from /tally/app/sw.js, scope /tally/app/)
  ============================================================
  Deliberately minimal. This app's value is live, real-time Firebase sync, so an
  aggressive offline-first cache would risk serving a stale shell or stale
  session state during a live event — a worse failure than no caching at all.

  What it does:
  - Satisfies the installability requirement (a fetch handler must exist).
  - Caches the static shell so the app still opens through a momentary blip.
  - Network-first, so a host always gets the latest build when online.
  - Never touches cross-origin traffic (Firebase, Groq, fonts, CDNs), so live
    data is never served stale.

  Coexisting with the landing page (/tally/, which has its own worker):
  - Cache names are prefixed 'tally-app-'. Cleanup only ever touches caches
    with that prefix, so it can't wipe the landing page's caches or any other
    app's on this origin.
*/

const CACHE_PREFIX = 'tally-app-';
const CACHE_NAME = CACHE_PREFIX + 'shell-v2';
const SHELL_ASSETS = ['./', './index.html', './manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;      // Firebase, Groq, fonts, CDNs: straight to network

  event.respondWith(
    fetch(req)
      .then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        }
        return response;
      })
      .catch(() =>
        // ignoreSearch lets an attendee's ?join=CODE link still open the cached shell offline
        caches.match(req, { ignoreSearch: true }).then(
          (hit) => hit || (req.mode === 'navigate' ? caches.match('./index.html') : Response.error())
        )
      )
  );
});
