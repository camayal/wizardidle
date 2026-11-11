// Wizard Idle v2 - service worker "kill switch".
//
// v1 installed a cache-first service worker at this same URL, which would keep serving
// the old v1 files forever. Browsers re-check this file on every visit, so replacing it
// with this one makes every v1 install remove itself: delete the old cache, unregister,
// and reload open tabs so they fetch fresh v2 files from the network.
//
// The legacy copy at /legacy/ registers its own worker (legacy/service-worker.js) and
// is not affected beyond losing its offline cache once (it shares the cache name and
// simply re-downloads it on the next visit).
//
// A real offline cache for v2 will replace this file before the 2.0.0 release.

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(keys.filter((key) => key === 'wizardidle-pwa').map((key) => caches.delete(key)));
        await self.registration.unregister();
        const tabs = await self.clients.matchAll({ type: 'window' });
        tabs.forEach((tab) => tab.navigate(tab.url));
    })());
});
