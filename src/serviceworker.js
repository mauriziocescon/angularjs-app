"use strict";

let version = "/* @echo VERSION */";
let staticCacheNamePrefix = "demo-static-";
let staticCacheName = staticCacheNamePrefix + version;

self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(staticCacheName).then(function (cache) {
            return cache.addAll([
                "/",
                "css/app-" + version + ".css",

                "fonts/bootstrap/glyphicons-halflings-regular.eot",
                "fonts/bootstrap/glyphicons-halflings-regular.svg",
                "fonts/bootstrap/glyphicons-halflings-regular.ttf",
                "fonts/bootstrap/glyphicons-halflings-regular.woff",
                "fonts/bootstrap/glyphicons-halflings-regular.woff2",
                "fonts/FontAwesome.otf",
                "fonts/fontawesome-webfont.eot",
                "fonts/fontawesome-webfont.svg",
                "fonts/fontawesome-webfont.ttf",
                "fonts/fontawesome-webfont.woff",
                "fonts/fontawesome-webfont.woff2",

                "imgs/android-icon-36x36.png",
                "imgs/android-icon-48x48.png",
                "imgs/android-icon-72x72.png",
                "imgs/android-icon-96x96.png",
                "imgs/android-icon-144x144.png",
                "imgs/android-icon-192x192.png",
                "imgs/apple-icon-57x57.png",
                "imgs/apple-icon-60x60.png",
                "imgs/apple-icon-72x72.png",
                "imgs/apple-icon-76x76.png",
                "imgs/apple-icon-114x114.png",
                "imgs/apple-icon-120x120.png",
                "imgs/apple-icon-144x144.png",
                "imgs/apple-icon-152x152.png",
                "imgs/apple-icon-180x180.png",
                "imgs/apple-icon.png",
                "imgs/chevron-circle-up.svg",
                "imgs/chevron-down.svg",
                "imgs/chevron-left.svg",
                "imgs/chevron-right.svg",
                "imgs/chevron-up.svg",
                "imgs/favicon-16x16.png",
                "imgs/favicon-32x32.png",
                "imgs/favicon-96x96.png",
                "imgs/missing-image.svg",
                "imgs/ms-icon-70x70.png",
                "imgs/ms-icon-144x144.png",
                "imgs/ms-icon-150x150.png",
                "imgs/ms-icon-310x310.png",

                "js/app-" + version + ".js",
                "js/templates-" + version + ".js",
                "js/uibtemplates-" + version + ".js",

                "lib/angular-locale_de.js",
                "lib/angular-locale_en.js",
                "lib/angular-locale_en-gb.js",
                "lib/angular-locale_en-us.js",
                "lib/angular-locale_it.js",

                "index.html"
            ]);
        }).catch(function (e) {
            console.log("Cache open: " + e);
        })
    );
});

self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return cacheName.startsWith(staticCacheNamePrefix) && cacheName != staticCacheName;
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener("fetch", function (event) {
    let requestUrl = new URL(event.request.url);
    if (requestUrl.origin === location.origin) {
        if (requestUrl.pathname === "/") {
            event.respondWith(caches.match("/"));
            return;
        }
    }

    event.respondWith(
        caches.match(event.request).then(function (response) {
            if (response) console.log(response);
            return response || fetch(event.request);
        })
    );
});

self.addEventListener("message", function (event) {
    if (event.data.action === "skipWaiting") {
        self.skipWaiting();
    }
});