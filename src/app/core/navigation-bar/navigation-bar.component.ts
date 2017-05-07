import * as ng from "angular";
import { INavigationBarService } from "./navigation-bar.service";
import {
    IAppConstantsService,
    IAppLanguageService,
    ILocalizedStringService,
    IUtilitiesService
} from "../services/services.module";

export class NavigationBarController {
    static $inject = ["$location", "AppConstantsService", "AppLanguageService", "LocalizedStringService", "UtilitiesService", "NavigationBarService"];
    public name: string;

    private location: ng.ILocationService;
    private appConstantsService: IAppConstantsService;
    private appLanguageService: IAppLanguageService;
    private localizedStringService: ILocalizedStringService;
    private utilitiesService: IUtilitiesService;
    private navigationBarService: INavigationBarService;

    private languages: string[];
    public selectedLanguageId: string;

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

    public $onDestroy(): void {

    }
}

export const NavigationBarComponent: ng.IComponentOptions = {
    bindings: {},
    controller: NavigationBarController,
    templateUrl: () => {
        return "navigation-bar.component.html";
    },
};
