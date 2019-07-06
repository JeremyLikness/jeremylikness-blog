const CACHE_VERSION = 2.3;

const BASE_CACHE_FILES = [
    '/',
    '/js/jquery-3.3.1.min.js',
    '/404.html',
    '/offline',
    '/css/medium.css',
    '/css/bootstrap.min.css',
    '/css/additional.css',
    '/css/custom.css',
    '/manifest.json',
    '/images/logo.png',
    '/images/jumbotron.jpg',
    '/js/mediumish.js',
    '/blog',
    '/blog/2017-08-17_upcoming-talks/',
    '/static/about',
    '/privacy'
];

const OFFLINE_CACHE_FILES = [
    '/offline/'
];

const NOT_FOUND_CACHE_FILES = [
    '/404.html'
];

const OFFLINE_PAGE = '/offline/';
const NOT_FOUND_PAGE = '/404.html';

const CACHE_VERSIONS = {
    assets: 'assets-v' + CACHE_VERSION,
    content: 'content-v' + CACHE_VERSION,
    offline: 'offline-v' + CACHE_VERSION,
    notFound: '404-v' + CACHE_VERSION,
};

// Define MAX_TTL's in SECONDS for specific file extensions
const MAX_TTL = {
    '/': 3600,
    html: 86400,
    json: 86400,
    js: 86400,
    css: 86400,
};

const CACHE_BLACKLIST = [
    (str) => !str.startsWith('http://localhost') &&
        !str.startsWith('https://blog.jeremylikness.com')
];

const SUPPORTED_METHODS = [
    'GET',
];

/**
 * isBlackListed
 * @param {string} url
 * @returns {boolean}
 */
function isBlacklisted(url) {
    return (CACHE_BLACKLIST.length > 0) ? !CACHE_BLACKLIST.filter((rule) => {
        if (typeof rule === 'function') {
            return !rule(url);
        } else {
            return false;
        }
    }).length : false
}

/**
 * getFileExtension
 * @param {string} url
 * @returns {string}
 */
function getFileExtension(url) {
    let extension = url.split('.').reverse()[0].split('?')[0];
    return (extension.endsWith('/')) ? '/' : extension;
}

/**
 * getTTL
 * @param {string} url
 */
function getTTL(url) {
    if (typeof url === 'string') {
        let extension = getFileExtension(url);
        if (typeof MAX_TTL[extension] === 'number') {
            return MAX_TTL[extension];
        } else {
            return null;
        }
    } else {
        return null;
    }
}

/**
 * installServiceWorker
 * @returns {Promise}
 */
function installServiceWorker() {
    return Promise.all(
        [caches.open(CACHE_VERSIONS.assets).then((cache) => {
            return cache.addAll(BASE_CACHE_FILES);
        }
            , err => console.error(`Error with ${CACHE_VERSIONS.assets}`, err)),
        caches.open(CACHE_VERSIONS.offline).then((cache) => {
            return cache.addAll(OFFLINE_CACHE_FILES);
        }
            , err => console.error(`Error with ${CACHE_VERSIONS.offline}`, err)),
        caches.open(CACHE_VERSIONS.notFound).then((cache) => {
            return cache.addAll(NOT_FOUND_CACHE_FILES);
        }
            , err => console.error(`Error with ${CACHE_VERSIONS.notFound}`, err))]
    )
        .then(() => {
            return self.skipWaiting();
        }, err => console.error("Error with installation: ", err));
}

/**
 * cleanupLegacyCache
 * @returns {Promise}
 */
function cleanupLegacyCache() {

    let currentCaches = Object.keys(CACHE_VERSIONS).map((key) => {
        return CACHE_VERSIONS[key];
    });

    return new Promise(
        (resolve, reject) => {

            caches.keys().then((keys) => {
                return legacyKeys = keys.filter((key) => {
                    return !~currentCaches.indexOf(key);
                });
            }).then((legacy) => {
                if (legacy.length) {
                    Promise.all(legacy.map((legacyKey) => {
                        return caches.delete(legacyKey)
                    })
                    ).then(() => {
                        resolve()
                    }).catch((err) => {
                        console.error("Error in legacy cleanup: ", err);
                        reject(err);
                    });
                } else {
                    resolve();
                }
            }).catch((err) => {
                console.error("Error in legacy cleanup: ", err);
                reject(err);
            });

        });
}

function precacheUrl(url) {
    if (!isBlacklisted(url)) {
        caches.open(CACHE_VERSIONS.content).then((cache) => {
            cache.match(url).then((response) => {
                if (!response) {
                    return fetch(url);
                } else {
                    // already in cache, nothing to do.
                    return null;
                }
            }).then((response) => {
                if (response) {
                    return cache.put(url, response.clone());
                } else {
                    return null;
                }
            });
        });
    }
}

self.addEventListener('install', event => {
    event.waitUntil(
        Promise.all([
            installServiceWorker(),
            self.skipWaiting(),
        ]));
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
    event.waitUntil(Promise.all(
        [cleanupLegacyCache(),
        self.clients.claim(),
        self.skipWaiting()]).catch((err) => {
            console.error("Activation error: ", err);
            event.skipWaiting();
        }));
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.open(CACHE_VERSIONS.content).then((cache) => {
            return cache.match(event.request).then((response) => {
                if (response) {
                    let headers = response.headers.entries();
                    let date = null;

                    for (let pair of headers) {
                        if (pair[0] === 'date') {
                            date = new Date(pair[1]);
                        }
                    }

                    if (date) {
                        let age = parseInt((new Date().getTime() - date.getTime()) / 1000);
                        let ttl = getTTL(event.request.url);

                        if (ttl && age > ttl) {
                            return new Promise((resolve) => {
                                return fetch(event.request.clone()).then(
                                    (updatedResponse) => {
                                        if (updatedResponse) {
                                            cache.put(event.request, updatedResponse.clone());
                                            resolve(updatedResponse);
                                        } else {
                                            resolve(response);
                                        }
                                    }).catch(() => {
                                        resolve(response);
                                    });
                            }).catch(() => {
                                return response;
                            });
                        } else {
                            return response;
                        }
                    } else {
                        return response;
                    }
                } else {
                    return null;
                }
            }).then((response) => {
                if (response) {
                    return response;
                } else {
                    return fetch(event.request.clone()).then(
                        (response) => {
                            if (response.status < 400) {
                                if (~SUPPORTED_METHODS.indexOf(event.request.method) && !isBlacklisted(event.request.url)) {
                                    cache.put(event.request, response.clone());
                                }
                                return response;
                            } else {
                                return caches.open(CACHE_VERSIONS.notFound).then((cache) => {
                                    return cache.match(NOT_FOUND_PAGE);
                                });
                            }
                        }).then((response) => {
                            if (response) {
                                return response;
                            }
                        }).catch(() => {
                            return caches.open(CACHE_VERSIONS.offline).then(
                                (offlineCache) => {
                                    return offlineCache.match(OFFLINE_PAGE)
                                });
                        });
                }
            }).catch((error) => {
                console.error('Error in fetch handler:', error);
                throw error;
            });
        })
    );
});

self.addEventListener('message', (event) => {
    if (typeof event.data === 'object' &&
        typeof event.data.action === 'string') {
        switch (event.data.action) {
            case 'cache':
                precacheUrl(event.data.url);
                break;
            default:
                console.log('Unknown action: ' + event.data.action);
                break;
        }
    }
});