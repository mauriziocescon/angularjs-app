import * as $ from "jquery";
window["$"] = window["jQuery"] = $; // jQuery is global for other objs
import * as angular from "angular";
import "angular-animate";
import "angular-mocks";
import "angular-sanitize";
import "angular-touch";

import "bootstrap-sass";

import "angular-dynamic-locale";
import "angular-loading-bar";
import "angular-stats";
import "angular-ui-bootstrap";
import "angular-ui-router";
import "angular-ui-scroll";
import "babel-polyfill";
import "format4js";
import "ng-infinite-scroll";
import "stacktrace-js";

import { app } from "./app/app.module";
import { appDev } from "./app/app-dev.module";

class Main {

    public static appReady(): void {
        Main.loadAngular();
    }

    protected static loadAngular(): void {
        const config: ng.IAngularBootstrapConfig = {strictDi: /* @echo STRICT_DI */};

        // start angular

        // @if MOCK_BACKEND = "false"
        angular.bootstrap(document.querySelector(app), [app], config);
        // @endif

        // @if MOCK_BACKEND = "true"
        angular.bootstrap(document.querySelector(app), [appDev], config);
        // @endif

        // register service worker
        // Main.registerServiceWorker();
    }

    protected static registerServiceWorker(): void {
        if (!navigator.serviceWorker) {
            return;
        }

        navigator.serviceWorker.register("/serviceworker.js").then((reg) => {

            // Registration was successful
            console.log("ServiceWorker registration successful with scope: ", reg.scope);

            if (!navigator.serviceWorker.controller) {
                return;
            }

            if (reg.waiting) {
                Main.updateReady(reg.waiting);
                return;
            }

            if (reg.installing) {
                Main.trackInstalling(reg.installing);
                return;
            }

            reg.addEventListener("updatefound", () => {
                Main.trackInstalling(reg.installing);
            });

        }).catch((error: string) => {
            // registration failed :(
            console.log("ServiceWorker registration failed: ", error);
        });

        // Ensure refresh is only called once.
        // This works around a bug in "force update on reload".
        let refreshing;
        navigator.serviceWorker.oncontrollerchange = () => {
            if (refreshing) {
                return;
            }
            window.location.reload();
            refreshing = true;
        };
    }

    protected static trackInstalling(worker): void {
        worker.addEventListener("statechange", () => {
            if (worker.state === "installed") {
                Main.updateReady(worker);
            }
        });
    }

    protected static updateReady(worker): void {
        worker.postMessage({action: "skipWaiting"});
    }
}

document.addEventListener("DOMContentLoaded", Main.appReady.bind(Main));
