import * as angular from "angular";

import { IAppConstantsService, IUtilitiesService } from "./app.module";

import { AppController } from "./app.component";

// Addition of angular-mocks and jasmine references is done on the gulpfile
describe("AppController", () => {
    let httpBackend: ng.IHttpBackendService;
    let componentController: ng.IComponentControllerService;
    let appConstantsService: IAppConstantsService;
    let utilitiesService: IUtilitiesService;

    // Set up the module
    beforeEach(angular.mock.module("app"));

    beforeEach(inject(($httpBackend: ng.IHttpBackendService,
                       $componentController: ng.IComponentControllerService,
                       AppConstantsService: IAppConstantsService,
                       UtilitiesService: IUtilitiesService) => {

        // Set up the mock http service responses
        httpBackend = $httpBackend;

        // The $componentController service is used to create instances of controllers
        componentController = $componentController;

        appConstantsService = AppConstantsService;
        utilitiesService = UtilitiesService;
    }));

    it("controller.name is defined after $onInit", () => {
        const controller = componentController("app", {}, null) as AppController;
        expect(controller.name).toBe("AppComponent", "controller.name is not equal to AppComponent");
    });
});
