const APP_PREFIX = 'Budget-Tracker-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/service-worker.js',
    '/css/styles.css',
    '/icons/icon-72x72.png',
    '/icons/icon-96x96.png',
    '/icons/icon-128x128.png',
    '/icons/icon-144x144.png',
    '/icons/icon-152x152.png',
    '/icons/icon-192x192.png',
    '/icons/icon-384x384.png',
    '/icons/icon-512x512.png',
    '/js/idb.js',
    '/js/index.js',
    "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
    "https://cdn.jsdelivr.net/npm/chart.js@2.8.0",
    "/api/transaction"
];

//e stands for event and can also be written as event.
//use self instead of window because service workers has to run before the window object has ever been created. self refers to the service worker object
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('installing cache : ' + CACHE_NAME)
            return cache.addAll(FILES_TO_CACHE)
        })
    )
});

// we clear out any old data from the cache and,
// in the same step, tell the service worker how to manage caches.
self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (keyList) {
            let cacheKeeplist = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX);
            });
            cacheKeeplist.push(CACHE_NAME);

            return Promise.all(keyList.map(function (key, i) {
                if (cacheKeeplist.indexOf(key) === -1) {
                    console.log('deleting cache : ' + keyList[i]);
                    return caches.delete(keyList[i]);
                }
            })
            );
        })
    )
});

self.addEventListener('fetch', function (e) {
    console.log('fetch request : ' + e.request.url)
    //if the request is stored in the cache, e.respondWith will deliver 
    // the resource directly from the cache
    e.respondWith(
        caches.match(e.request).then(function (request) {
            return request || fetch(e.request)
          })

    )
  });
