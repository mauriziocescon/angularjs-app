import * as ng from "angular";

import {
    IAppConstantsService,
    IAppLanguageService,
    ILocalizedStringService,
    INavigationBarService,
    IUtilitiesService,
} from "../../core/services/services.module";

export class NavigationBarController {
    public static $inject = ["$location", "AppConstantsService", "AppLanguageService", "LocalizedStringService", "NavigationBarService", "UtilitiesService"];
    public name: string;
    public selectedLanguageId: string;

    protected location: ng.ILocationService;
    protected appConstantsService: IAppConstantsService;
    protected appLanguageService: IAppLanguageService;
    protected localizedStringService: ILocalizedStringService;
    protected navigationBarService: INavigationBarService;
    protected utilitiesService: IUtilitiesService;

    protected languages: string[];

    constructor($location: ng.ILocationService,
                AppConstantsService: IAppConstantsService,
                AppLanguageService: IAppLanguageService,
                LocalizedStringService: ILocalizedStringService,
                NavigationBarService: INavigationBarService,
                UtilitiesService: IUtilitiesService) {
        this.location = $location;
        this.appConstantsService = AppConstantsService;
        this.appLanguageService = AppLanguageService;
        this.localizedStringService = LocalizedStringService;
        this.navigationBarService = NavigationBarService;
        this.utilitiesService = UtilitiesService;

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
        this.languages = this.appLanguageService.getSupportedLanguagesList();
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
