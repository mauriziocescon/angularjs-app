/* shared services */
import * as angular from "angular";
import { AppConstantsService, IAppConstantsService } from "./app-constants.service";
import { AppLanguageService, IAppLanguageService } from "./app-language.service";
import { CacheHelperService, ICacheHelperService } from "./cache-helper.service";
import { ConnectionService, IConnectionService } from "./connection.service";
import { DelayExecutionService, IDelayExecutionService } from "./delay-execution.service";
import { ILocalStorageService, LocalStorageService } from "./local-storage.service";
import { ILocalizedStringService, LocalizedStringService } from "./localized-string.service";
import { ILocationChangeService, LocationChangeService } from "./location-change.service";
import { IScrollToService, ScrollToService } from "./scroll-to.service";
import { ISharedDataService, SharedDataService } from "./shared-data.service";
import { uiUtilitiesConstants } from "./ui-utilities.constants";
import { IUIUtilitiesService, UIUtilitiesService } from "./ui-utilities.service";
import { IUtilitiesService, UtilitiesService } from "./utilities.service";

// core services
export { IAppConstantsService } from "./app-constants.service";
export { IAppLanguageService } from "./app-language.service";
export { ICacheHelperService } from "./cache-helper.service";
export { IConnectionService } from "./connection.service";
export { IDelayExecutionService } from "./delay-execution.service";
export { ILocalStorageService } from "./local-storage.service";
export { ILocalizedStringService } from "./localized-string.service";
export { ILocationChangeService } from "./location-change.service";
export { IScrollToService } from "./scroll-to.service";
export { ISharedDataService } from "./shared-data.service";
export { IUIUtilitiesService } from "./ui-utilities.service";
export { IUtilitiesService } from "./utilities.service";

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
