// global constants
const APP_PREFIX = 'BudgetTracker-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

// list of files we will be caching
const FILES_TO_CACHE = [
    "/",
    "./index.html",
    "./js/index.js",
    "./js/idb.js",
    "./css/styles.css",
    "./manifest.webmanifest",
    "./icons/icon-192x192.png"

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
    e.waitUntil(
        // .keys() returns an array of cached names we are calling keyList
        caches.keys().then(function (keyList) {
            // capture the caches with the appropriate prefix and save them to the cacheKeeplist array
            let cacheKeeplist = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX);
            });
            // return the cacheKeeplist to the activate event listener
            cacheKeeplist.push(CACHE_NAME);
            // return a promise that resolves once all old versions of the cache have been deleted
            return Promise.all(
                keyList.map(function(key, i) {
                    if (cacheKeeplist.indexOf(key) === -1) {
                        console.log('deleting cache: ' + keyList[i]);
                        return caches.delete(keyList[i]);
                    }
                })
            )
        })
    )
})

// get the information from the cache
self.addEventListener('fetch', function (e) {
    // listen for the fetch event and log the url of the requested resource
    console.log('fetch request : ' + e.request.url)
    // if the request is stored in the cache e.respondWith will deliver the resource directly from the cache, otherwise it will be retrieved normally
    e.respondWith(
        // use .match() to see if the resource already exists in the caches
        caches.match(e.request).then(function (request) {
            // if it matches, log the url to the console with a message and return the cached resource
            if (request) {
                console.log('responding with cache: ' + e.request.url)
                return request;
            } else {
                // if the resource is not in caches, get the resource from the online network
                console.log('file is not cached, fetching: ' + e.request.url)
                return fetch(e.request)
            }
        })
    )
})