import * as ng from "angular";

import {
    IAppConstantsService,
    IAppLanguageService,
    INavigationBarService,
    IUtilitiesService,
} from "../../core/services/services.module";

export class NavigationBarController {
    public static $inject = ["$location", "$translate", "AppConstantsService", "AppLanguageService", "NavigationBarService", "UtilitiesService"];
    public name: string;
    public selectedLanguageId: string;

    protected location: ng.ILocationService;
    protected translate: ng.translate.ITranslateService;
    protected appConstantsService: IAppConstantsService;
    protected appLanguageService: IAppLanguageService;
    protected navigationBarService: INavigationBarService;
    protected utilitiesService: IUtilitiesService;

    protected languages: string[];

    constructor($location: ng.ILocationService,
                AppConstantsService: IAppConstantsService,
                AppLanguageService: IAppLanguageService,
                NavigationBarService: INavigationBarService,
                UtilitiesService: IUtilitiesService) {
        this.location = $location;
        this.appConstantsService = AppConstantsService;
        this.appLanguageService = AppLanguageService;
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
