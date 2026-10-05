/*
  TALLY ARS — Service Worker  (served from /tally/app/sw.js, scope /tally/app/)
  ============================================================
  Deliberately light. This app's value is live, real-time Firebase sync, so an
  aggressive offline-first cache would risk serving a stale shell or stale
  session state during a live event — a worse failure than no caching at all.

  What it does:
  - Satisfies the installability requirement (a fetch handler must exist).
  - Network-first for same-origin GETs, so a host gets the latest build when
    online. If the network takes longer than NETWORK_TIMEOUT_MS (venue wifi),
    the cached copy is served instead, and the slow request still refreshes the
    cache in the background.
  - Never touches cross-origin traffic (Firebase, Groq, fonts, CDNs), so live
    data is never served stale. Offline, the shell opens, but live sync and the
    CDN scripts need a connection.
  - Updates wait: a new worker installs quietly and only takes over when the
    person taps Reload in the in-app toast (SKIP_WAITING message), so an update
    never swaps the app out mid-session.

  VERSION must match APP_VERSION in index.html. Bump both on every release.
  Cache names are prefixed 'tally-app-'; cleanup only touches that prefix.
*/

const VERSION = '1.1.0';
const CACHE_PREFIX = 'tally-app-';
const CACHE_NAME = CACHE_PREFIX + 'v' + VERSION;
const NETWORK_TIMEOUT_MS = 4000;
const SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './sample-decks.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

function cachedFallback(req) {
  return caches.match(req, { ignoreSearch: true }).then(
    // ignoreSearch lets an attendee's ?join=CODE link still open the cached shell offline
    (hit) => hit || (req.mode === 'navigate' ? caches.match('./index.html') : undefined)
  );
}

async function networkFirst(req, event) {
  const net = fetch(req).then((response) => {
    if (response && response.ok && response.status === 200) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
    }
    return response;
  });
  event.waitUntil(net.catch(() => {}));

  const timeout = new Promise((resolve) => setTimeout(() => resolve(null), NETWORK_TIMEOUT_MS));
  try {
    const first = await Promise.race([net, timeout]);
    if (first) return first;
    const hit = await cachedFallback(req);
    return hit || net;              // nothing cached yet: keep waiting for the network
  } catch (err) {
    return (await cachedFallback(req)) || Response.error();
  }
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // Firebase, Groq, fonts, CDNs: straight to network
  event.respondWith(networkFirst(req, event));
});
