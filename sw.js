const CACHE_NAME = 'mis-finanzas-v4-' + Date.now();
const VERSION = 'v=4-' + Date.now();

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return fetch('./')
                .then((response) => response.text())
                .then((html) => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const base = self.location.href.split('?')[0];
                    const assets = [
                        `${base}?${VERSION}`,
                        `${base.replace('index.html', '')}?${VERSION}`,
                        './index.html?nocache',
                        './manifest.json?nocache',
                        './16.png',
                        './512.png'
                    ];
                    doc.querySelectorAll('script[src], link[rel="stylesheet"]').forEach((el) => {
                        const url = el.src || el.href;
                        assets.push(url.includes('?') ? url : `${url}?${VERSION}`);
                    });
                    return cache.addAll([...new Set(assets)]);
                });
        })
    );
    self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    if (url.origin !== location.origin) return;

    url.searchParams.set('nocache', Date.now().toString());
    const noCacheRequest = new Request(url.toString());

    event.respondWith(
        caches.match(event.request).then((cached) => {
            return fetch(noCacheRequest)
                .then((response) => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                    return response;
                })
                .catch(() => cached || new Response('Offline', { status: 503 }));
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'FORCE_UPDATE') {
        caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key))));
        self.registration.unregister().then(() => self.clients.claim());
    }
});