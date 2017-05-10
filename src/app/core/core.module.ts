import * as angular from "angular";

import { navigationBar } from "./navigation-bar/navigation-bar.module";
import { mcServices } from "./services/services.module";

import { servicesSetupFunc } from "./core-run.module";

export * from "./services/services.module";
export * from "./navigation-bar/navigation-bar.module";

const coreModule = angular.module("app.core", [
    "tmh.dynamicLocale",
    mcServices,
    navigationBar,
]);

// run function
coreModule.run(servicesSetupFunc);

export const core = coreModule.name;
