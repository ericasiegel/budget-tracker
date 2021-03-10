// global constants
const APP_PREFIX = 'BudgetTracker-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

// list of files we will be caching
const FILES_TO_CACHE = [
    "./index.html",
    "./js/index.js",
    "./js/idb.js",
    "./css/styles.css",
]

// install the service worker
self.addEventListener('install', function(e) {
    // tell the browser to wait until the work is complete before terminating the service worker
    e.waitUntil(
        // find a specific cache by name then add every file in the FILES_TO_CACHE array to the cache
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('installing cache: ' + CACHE_NAME)
            return cache.addAll(FILES_TO_CACHE)
        })
    )
})

// activate the service worker
self.addEventListener('activate', function(e) {
    e.waitUntil
})