import * as angular from "angular";

import {
    IAppConstantsService,
    IAppLanguageService,
    INavigationBarService,
    IUtilitiesService,
} from "../../core/services/services.module";
import { NavigationBarController } from "./navigation-bar.component";

// Addition of angular-mocks and jasmine references is done on the gulpfile
describe("NavigationBarController", () => {
    let httpBackend: ng.IHttpBackendService;
    let componentController: ng.IComponentControllerService;
    let appConstantsService: IAppConstantsService;
    let appLanguageService: IAppLanguageService;
    let navigationBarService: INavigationBarService;
    let utilitiesService: IUtilitiesService;

    // Set up the module
    beforeEach(angular.mock.module("app"));

    beforeEach(inject(($httpBackend, $componentController, AppConstantsService, AppLanguageService, NavigationBarService, UtilitiesService) => {

        // Set up the mock http service responses
        httpBackend = $httpBackend;

        // The $componentController service is used to create instances of controllers
        componentController = $componentController;

        appConstantsService = AppConstantsService;
        appLanguageService = AppLanguageService;
        navigationBarService = NavigationBarService;
        utilitiesService = UtilitiesService;
    }));

    it("controller.name is defined after $onInit", () => {
        const controller = componentController("navigationBar", null, null) as NavigationBarController;
        controller.$onInit();
        expect(controller.name).toBe("NavigationBarComponent", "controller.name is not equal to NavigationBarComponent");
    });
});
