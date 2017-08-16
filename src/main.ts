// tslint:disable:no-string-literal
import * as $ from "jquery";
window["$"] = window["jQuery"] = $; // jQuery is global for other objs
// tslint:enable:no-string-literal

import * as angular from "angular";

import "./vendor";

import { appDev } from "./app/app-dev.module";
import { app } from "./app/app.module";
import { Logger } from "./app/shared/shared.module";

class Main {

    public static appReady(): void {
        Main.loadAngular();
    }

    protected static loadAngular(): void {
        const config: ng.IAngularBootstrapConfig = {strictDi: true};

        // tslint:disable:no-consecutive-blank-lines

        // @if MOCK_BACKEND = "false"
        angular.bootstrap(document.querySelector(app), [app], config);
        // @endif

        // @if MOCK_BACKEND = "true"
        angular.bootstrap(document.querySelector(app), [appDev], config);
        // @endif

        // tslint:enable:no-consecutive-blank-lines

        // @if PROD = "true"
        // register service worker
        Main.registerServiceWorker();
        // @endif
    }

    protected static registerServiceWorker(): void {
        if (!navigator.serviceWorker) {
            return;
        }

        navigator.serviceWorker.register("/serviceworker.js").then((reg) => {

            // Registration was successful
            Logger.log("ServiceWorker registration successful with scope: ", reg.scope);

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
            Logger.log("ServiceWorker registration failed: ", error);
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
