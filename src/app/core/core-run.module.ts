import {
	IAppLanguageService,
	ICacheHelperService,
	IConnectionService,
	ILocalizedStringService,
	ILocationChangeService,
	IUtilitiesService,
} from "./services/services.module";
import {Logger} from "../shared/utilities/utilities.module";

export const servicesSetupFunc = (AppLanguageService: IAppLanguageService, CacheHelperService: ICacheHelperService, ConnectionService: IConnectionService, LocalizedStringService: ILocalizedStringService, LocationChangeService: ILocationChangeService, UtilitiesService: IUtilitiesService) => {
	// setup services
	// Logger.log("ANGULAR CORE OK  " + UtilitiesService.getNow().toISOString());
	AppLanguageService.start();
	CacheHelperService.start();
	ConnectionService.start();
	LocalizedStringService.start();
	LocationChangeService.start();
};

servicesSetupFunc.$inject = ["AppLanguageService", "CacheHelperService", "ConnectionService", "LocalizedStringService", "LocationChangeService", "UtilitiesService"];