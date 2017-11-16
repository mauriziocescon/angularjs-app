import * as angular from "angular";

import { appDev } from "./app/app-dev.module";
import { app } from "./app/app.module";

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
    }
}

document.addEventListener("DOMContentLoaded", Main.appReady.bind(Main));
