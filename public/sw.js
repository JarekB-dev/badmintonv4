/* eslint-disable no-restricted-globals */
const CACHE_VERSION = 'v1.0.1';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;
const OFFLINE_URL = 'offline.html';

const PRECACHE_URLS = [
  './',
  './index.html',
  OFFLINE_URL,
  'icons/icon-192.png',
  'icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => {
      if (![STATIC_CACHE, RUNTIME_CACHE].includes(k)) return caches.delete(k);
    })))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle GET
  if (req.method !== 'GET') return;

  // HTML - network first with offline fallback
  if (req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirst(req));
    return;
  }

  // Static assets - stale while revalidate
  if (url.origin === location.origin && /\.(?:js|css|woff2?|ttf)$/.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(req, STATIC_CACHE));
    return;
  }

  // Images - cache first
  if (url.origin === location.origin && /\.(?:png|jpg|jpeg|webp|svg|gif|ico)$/.test(url.pathname)) {
    event.respondWith(cacheFirst(req, RUNTIME_CACHE, 80));
    return;
  }

  // Default - SWR
  event.respondWith(staleWhileRevalidate(req, RUNTIME_CACHE));
});

async function networkFirst(req) {
  try {
    const fresh = await fetch(req);
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(req, fresh.clone());
    return fresh;
  } catch {
    const cached = await caches.match(req);
    return cached || caches.match(OFFLINE_URL);
  }
}

async function staleWhileRevalidate(req, cacheName = RUNTIME_CACHE) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  const network = fetch(req).then(res => {
    cache.put(req, res.clone());
    return res;
  }).catch(() => null);
  return cached || network || caches.match(OFFLINE_URL);
}

async function cacheFirst(req, cacheName, maxEntries = 50) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    cache.put(req, res.clone());
    trim(cache, maxEntries);
    return res;
  } catch {
    return caches.match(OFFLINE_URL);
  }
}

async function trim(cache, maxEntries) {
  const keys = await cache.keys();
  if (keys.length > maxEntries) await cache.delete(keys[0]);
}
