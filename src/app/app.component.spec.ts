import * as angular from "angular";

import * as i18nEn from "../assets/i18n/en.json";

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

        // returns a list of i18n strings
        httpBackend.whenGET((url: string) => {
            return url.startsWith("assets/i18n/");
        }).respond((method: string, url: string, data: string, headers: Object, params?: any) => { // tslint:disable-line:ban-types
            const response = i18nEn{};
            return [200, response, headers, "ok"];
        });
    }));

    it("controller.name is defined after $onInit", () => {
        const controller = componentController("app", {}, null) as AppController;
        expect(controller.name).toBe("AppComponent", "controller.name is not equal to AppComponent");
    });
});
