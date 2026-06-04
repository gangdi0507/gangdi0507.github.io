const CACHE_NAME = 'game-guide-v2';
const urlsToCache = [
    '/',
    '/index.html',
    '/sunwukong.html',
    '/jing.html',
    '/lan.html',
    '/machao.html',
    '/lianpo.html',
    '/bind-map.html',
    '/val-rifle.html',
    '/val-smg.html',
    '/val-sniper.html',
    '/val-pistol.html',
    '/val-shotgun.html',
    '/anti-cheat.html',
    '/manifest.json'
];

// 安装 Service Worker 并缓存所有文件
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            console.log('缓存中...');
            return cache.addAll(urlsToCache);
        })
    );
});

// 拦截请求，优先从缓存加载
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                return response;
            }
            return fetch(event.request).then(function(response) {
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }
                var responseToCache = response.clone();
                caches.open(CACHE_NAME).then(function(cache) {
                    cache.put(event.request, responseToCache);
                });
                return response;
            });
        })
    );
});

// 更新缓存
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
