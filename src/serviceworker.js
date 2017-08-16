"use strict";

let version = "/* @echo HASH */";
let staticCacheNamePrefix = "demo-static-";
let staticCacheName = staticCacheNamePrefix + version;

self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(staticCacheName).then(function (cache) {
            return cache.addAll([
                "/",
                "app-" + version + ".css",

                "FontAwesome.otf",
                "fontawesome-webfont.eot",
                "fontawesome-webfont.svg",
                "fontawesome-webfont.ttf",
                "fontawesome-webfont.woff",
                "fontawesome-webfont.woff2",

                "android-icon-36x36.png",
                "android-icon-48x48.png",
                "android-icon-72x72.png",
                "android-icon-96x96.png",
                "android-icon-144x144.png",
                "android-icon-192x192.png",
                "apple-icon-57x57.png",
                "apple-icon-60x60.png",
                "apple-icon-72x72.png",
                "apple-icon-76x76.png",
                "apple-icon-114x114.png",
                "apple-icon-120x120.png",
                "apple-icon-144x144.png",
                "apple-icon-152x152.png",
                "apple-icon-180x180.png",
                "apple-icon.png",
                "chevron-circle-up.svg",
                "chevron-down.svg",
                "chevron-left.svg",
                "chevron-right.svg",
                "chevron-up.svg",
                "favicon-16x16.png",
                "favicon-32x32.png",
                "favicon-96x96.png",
                "missing-image.svg",
                "ms-icon-70x70.png",
                "ms-icon-144x144.png",
                "ms-icon-150x150.png",
                "ms-icon-310x310.png",

                "app-" + version + ".js",
                "templates-" + version + ".js",
                "uibtemplates-" + version + ".js",

                "i18n/de.json",
                "i18n/en.json",
                "i18n/it.json",

                "locales/angular-locale_de.js",
                "locales/angular-locale_en.js",
                "locales/angular-locale_en-gb.js",
                "locales/angular-locale_en-us.js",
                "locales/angular-locale_it.js",

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
