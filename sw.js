/*
  TALLY ARS — Service Worker
  ============================================================
  Deliberately minimal. This app's entire value is live, real-time
  Firebase sync — an aggressive offline-first cache would risk serving a
  stale app shell or stale session state during a live event, which is a
  worse failure mode than no caching at all.

  What this service worker actually does:
  - Satisfies the browser's installability requirement (a fetch handler
    must exist for "Add to Home Screen" / install prompts to appear).
  - Caches only the static app shell (HTML, manifest, icons) so the app
    still opens if the network blips for a second — not so it can run
    fully offline indefinitely.
  - Always tries the network first for the HTML itself, falling back to
    cache only on failure, so a host always gets the latest version of
    the app when online rather than an old cached build.
  - Never caches anything Firebase-related — that traffic is excluded
    entirely, so live data is never served stale.
*/

const CACHE_NAME = 'tally-ars-shell-v1';
const SHELL_ASSETS = [
  './index.html',
  './manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Never intercept Firebase, Groq, Google Fonts, or any cross-origin
  // request — only the app shell itself is ever cached. Live data must
  // always go straight to the network.
  if (url.origin !== self.location.origin) {
    return;
  }

  // Network-first for the HTML shell: a host should always get the latest
  // build when online. Cache is only a fallback for a momentary network
  // blip, not a substitute for a fresh load.
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
