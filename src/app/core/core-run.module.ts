import { Logger } from "../shared/shared.module";

import {
    IAppLanguageService,
    ICacheHelperService,
    IConnectionService,
    ILocalizedStringService,
    ILocationChangeService,
    IUtilitiesService,
} from "./services/services.module";

export const servicesSetupFunc = ($translateService: ng.translate.ITranslateService,
                                  AppLanguageService: IAppLanguageService,
                                  CacheHelperService: ICacheHelperService,
                                  ConnectionService: IConnectionService,
                                  LocalizedStringService: ILocalizedStringService,
                                  LocationChangeService: ILocationChangeService,
                                  UtilitiesService: IUtilitiesService) => {
    // setup services
    // Logger.log("ANGULAR CORE OK  " + UtilitiesService.getNow().toISOString());
    AppLanguageService.start();
    CacheHelperService.start();
    ConnectionService.start();
    LocalizedStringService.start();
    LocationChangeService.start();

    // set language
    $translateService.use(AppLanguageService.getLanguageId());
};

servicesSetupFunc.$inject = ["$translate", "AppLanguageService", "CacheHelperService", "ConnectionService", "LocalizedStringService", "LocationChangeService", "UtilitiesService"];
