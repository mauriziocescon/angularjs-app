import * as ng from "angular";

import {
    IAppConstantsService,
    IAppLanguageService,
    ILocalizedStringService,
    IUtilitiesService,
} from "../../core/services/services.module";
import { INavigationBarService } from "./navigation-bar.service";

export class NavigationBarController {
    public static $inject = ["$location", "AppConstantsService", "AppLanguageService", "LocalizedStringService", "UtilitiesService", "NavigationBarService"];
    public name: string;
    public selectedLanguageId: string;

    protected location: ng.ILocationService;
    protected appConstantsService: IAppConstantsService;
    protected appLanguageService: IAppLanguageService;
    protected localizedStringService: ILocalizedStringService;
    protected utilitiesService: IUtilitiesService;
    protected navigationBarService: INavigationBarService;

    protected languages: string[];

    constructor($location: ng.ILocationService,
                AppConstantsService: IAppConstantsService,
                AppLanguageService: IAppLanguageService,
                LocalizedStringService: ILocalizedStringService,
                UtilitiesService: IUtilitiesService,
                NavigationBarService: INavigationBarService) {
        this.location = $location;
        this.appConstantsService = AppConstantsService;
        this.appLanguageService = AppLanguageService;
        this.localizedStringService = LocalizedStringService;
        this.utilitiesService = UtilitiesService;
        this.navigationBarService = NavigationBarService;

        this.name = "NavigationBarComponent";
    }

    get canShowAnalysis(): boolean {
        return this.appConstantsService.Application.SHOW_ANALYSIS === true;
    }

    get canChangeLanguage(): boolean {
        return true;
    }

    get analysis(): string {
        return "<pre>" + this.utilitiesService.analyzeWebApp() + "</pre>";
    }

    get pageDesc(): string {
        return this.navigationBarService.getTitle();
    }

    public $onInit(): void {
        this.selectedLanguageId = this.appLanguageService.getLanguageId();
        this.languages = this.appConstantsService.Languages.SUPPORTED_LANG;
    }

    public $onDestroy(): void {
        // do nothing
    }

    public goToAlbums(): void {
        this.location.path("/albums");
    }

    public goToUsers(): void {
        this.location.path("/users");
    }

    public selectLanguage(language: string): void {
        if (this.appLanguageService.getLanguageId() !== language) {
            this.selectedLanguageId = language;
            this.appLanguageService.setLanguageId(this.selectedLanguageId);
        }
    }
}

export const NavigationBarComponent: ng.IComponentOptions = {
    bindings: {},
    controller: NavigationBarController,
    templateUrl: () => {
        return "navigation-bar.component.html";
    },
};
