import * as angular from "angular";
import {mcDirectives} from "./directives/directives.module";
import {mcFilters} from "./filters/filters.module";
import {mcModals} from "./modals/modals.module";

export * from "./filters/filters.module";
export * from "./utilities/utilities.module";
export * from "./ws/ws.module";

const sharedModule = angular.module("app.shared", [
	mcModals,
	mcDirectives,
	mcFilters
]);

export const shared = sharedModule.name;