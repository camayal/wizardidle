// Wizard Idle v2 - offline mode.
//
// Stores the game on the device so it plays without a connection and can be installed
// like an app. Replaces v1's worker, which served every file from its cache forever and
// would have kept players on old versions.
//
// - Game code (HTML, JS, JSON): network first, so online players always get the latest
//   version; the stored copy is only used offline.
// - Art and sound: stored copy first (they never change), fetched once otherwise.
// - Each deploy gets its own cache; the old one is deleted once the new version takes over.
// - The legacy copy under /legacy/ is left alone (it has its own worker).
//
// The deploy workflow (.github/scripts/precache.py) writes precache.json with every file
// of the site and replaces VERSION below with the commit, so nothing here is kept by hand.
// Without precache.json (e.g. running locally) nothing is stored upfront, and each file is
// still stored the first time the game uses it.

const VERSION = 'dev';
const CACHE = `wizardidle2-${VERSION}`;

self.addEventListener('install', (event) => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE);
        try {
            const response = await fetch('precache.json', { cache: 'no-store' });
            if (response.ok) {
                const { files } = await response.json();
                // one missing file must not break the whole install
                await Promise.allSettled(files.map((url) => cache.add(url)));
            }
        } catch (e) {
            // no list: files are stored as they are used
        }
        await self.skipWaiting();
    })());
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(keys.filter((key) => key.startsWith('wizardidle2-') && key !== CACHE).map((key) => caches.delete(key)));
        await self.clients.claim();
    })());
});

const isCode = (url, request) => request.mode === 'navigate' || /\.(html|js|json)$/.test(url.pathname) || url.pathname.endsWith('/');

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    if (request.method !== 'GET' || url.origin !== location.origin || url.pathname.includes('/legacy/')) return;

    if (isCode(url, request)) {
        event.respondWith((async () => {
            const cache = await caches.open(CACHE);
            try {
                const response = await fetch(request);
                if (response.ok) cache.put(request, response.clone());
                return response;
            } catch (e) {
                return (await cache.match(request, { ignoreSearch: true })) || Response.error();
            }
        })());
    } else {
        event.respondWith((async () => {
            const cache = await caches.open(CACHE);
            const stored = await cache.match(request);
            if (stored) return stored;
            const response = await fetch(request);
            if (response.ok) cache.put(request, response.clone());
            return response;
        })());
    }
});
