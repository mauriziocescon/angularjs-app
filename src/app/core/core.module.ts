import * as angular from "angular";
import {mcServices} from "./services/services.module";
import {navigationBar} from "./navigation-bar/navigation-bar.module";
import {servicesSetupFunc} from "./core-run.module";

export * from "./navigation-bar/navigation-bar.module";
export * from "./services/services.module";

const coreModule = angular.module("app.core", [
	"tmh.dynamicLocale",
	mcServices,
	navigationBar
]);

// run function
coreModule.run(servicesSetupFunc);

export const core = coreModule.name;