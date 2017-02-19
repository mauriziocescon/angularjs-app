/* shared services */
import * as angular from "angular";
import {IAppConstantsService, AppConstantsService} from "./app-constants.service";
import {IAppLanguageService, AppLanguageService} from "./app-language.service";
import {ICacheHelperService, CacheHelperService} from "./cache-helper.service";
import {IConnectionService, ConnectionService} from "./connection.service";
import {IDelayExecutionService, DelayExecutionService} from "./delay-execution.service";
import {ILocalStorageService, LocalStorageService} from "./local-storage.service";
import {ILocalizedStringService, LocalizedStringService} from "./localized-string.service";
import {ILocationChangeService, LocationChangeService} from "./location-change.service";
import {IScrollToService, ScrollToService} from "./scroll-to.service";
import {ISharedDataService, SharedDataService} from "./shared-data.service";
import {uiUtilitiesConstants} from "./ui-utilities.constants";
import {IUIUtilitiesService, UIUtilitiesService} from "./ui-utilities.service";
import {IUtilitiesService, UtilitiesService} from "./utilities.service";

// core services
export {IAppConstantsService} from "./app-constants.service";
export {IAppLanguageService} from "./app-language.service";
export {ICacheHelperService} from "./cache-helper.service";
export {IConnectionService} from "./connection.service";
export {IDelayExecutionService} from "./delay-execution.service";
export {ILocalStorageService} from "./local-storage.service";
export {ILocalizedStringService} from "./localized-string.service";
export {ILocationChangeService} from "./location-change.service";
export {IScrollToService} from "./scroll-to.service";
export {ISharedDataService} from "./shared-data.service";
export {IUIUtilitiesService} from "./ui-utilities.service";
export {IUtilitiesService} from "./utilities.service";

export const mcServices = angular.module("core.mcServices", [])
	.service("AppConstantsService", AppConstantsService)
	.service("AppLanguageService", AppLanguageService)
	.service("CacheHelperService", CacheHelperService)
	.service("ConnectionService", ConnectionService)
	.service("DelayExecutionService", DelayExecutionService)
	.service("LocalStorageService", LocalStorageService)
	.service("LocalizedStringService", LocalizedStringService)
	.service("LocationChangeService", LocationChangeService)
	.service("ScrollToService", ScrollToService)
	.service("SharedDataService", SharedDataService)
	.constant("UIUtilitiesConstants", uiUtilitiesConstants)
	.service("UIUtilitiesService", UIUtilitiesService)
	.service("UtilitiesService", UtilitiesService)
	.name;