const CACHE_NAME = 'sdc-dojo-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './assets/chef-inhale.png',
  './assets/skybox/dojo-front.png',
  './assets/skybox/dojo-back.png',
  './assets/skybox/dojo-left.png',
  './assets/skybox/dojo-right.png',
  './assets/skybox/dojo-top.png',
  './assets/skybox/dojo-bottom.png',
  './apps/nutrition-widget/index.html',
  './apps/nutrition-widget/ingredients.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
