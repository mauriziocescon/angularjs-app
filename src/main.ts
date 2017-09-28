// tslint:disable:no-string-literal
import * as $ from "jquery";

// @ts-ignore: Element implicitly has an 'any' type because type 'Window' has no index signature
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
        // tslint:disable:no-consecutive-blank-lines

        const config: ng.IAngularBootstrapConfig = {strictDi: true};
        const element = document.querySelector(app);

        if (element) {
            // @if MOCK_BACKEND = "false"
            angular.bootstrap(element, [app], config);
            // @endif

            // @if MOCK_BACKEND = "true"
            angular.bootstrap(element, [appDev], config);
            // @endif
        }

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

        navigator.serviceWorker.register("/serviceworker.js").then((reg: ServiceWorkerRegistration) => {

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
        let refreshing = false;
        navigator.serviceWorker.oncontrollerchange = () => {
            if (!refreshing) {
                window.location.reload();
                refreshing = true;
            }
        };
    }

    protected static trackInstalling(worker: ServiceWorker | null): void {
        if (worker) {
            worker.addEventListener("statechange", () => {
                if (worker.state === "installed") {
                    Main.updateReady(worker);
                }
            });
        }
    }

    protected static updateReady(worker: ServiceWorker | null): void {
        if (worker) {
            worker.postMessage({action: "skipWaiting"});
        }
    }
}

document.addEventListener("DOMContentLoaded", Main.appReady.bind(Main));
