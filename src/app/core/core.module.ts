import * as angular from "angular";

import { mcServices } from "./services/services.module";

import { servicesSetupFunc } from "./core-run.module";

export * from "./services/services.module";

const coreModule = angular.module("app.core", [
    "tmh.dynamicLocale",
    mcServices,
]);

// run function
coreModule.run(servicesSetupFunc);

export const core = coreModule.name;
