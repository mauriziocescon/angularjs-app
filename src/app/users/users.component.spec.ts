import * as angular from "angular";

import * as i18nEn from "../../assets/i18n/en.json";

import { IAppConstantsService, IUtilitiesService } from "../app.module";

import { UsersController } from "./users.component";
import { Address, Company, Coordinates, User } from "./users.model";

// Addition of angular-mocks and jasmine references is done on the gulpfile
describe("UsersController", () => {
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
            const response = i18nEn;
            return [200, response, headers, "ok"];
        });

        // returns the current list of users
        httpBackend.whenGET((url: string) => {
            return url.startsWith(appConstantsService.Api.users);
        }).respond((method: string, url: string, data: string, headers: Object, params?: any) => { // tslint:disable-line:ban-types

            const response = [];

            for (let i = 0; i < 4; i++) {
                const user = new User();

                user.id = i;
                user.name = "name " + i.toString();
                user.username = "username " + i.toString();
                user.email = user.name + "@email.com";
                user.address = new Address();
                user.address.street = "street";
                user.address.suite = "suite";
                user.address.city = "city";
                user.address.zipcode = "32332";
                user.address.geo = new Coordinates();
                user.address.geo.lat = "0";
                user.address.geo.lng = "0";
                user.phone = "+39 20151025";
                user.website = "www." + user.name + ".com";
                user.company = new Company();
                user.company.name = "name";
                user.company.catchPhrase = "catchPhrase";
                user.company.bs = "bs";

                response.push(user);
            }

            return [200, response, {}, "ok"];
        });
    }));

    afterEach(() => {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it("controller.name is defined after $onInit", () => {
        const controller = componentController("users", {}, null) as UsersController;
        controller.$onInit();
        httpBackend.flush();
        expect(controller.name).toBe("UsersComponent", "controller.name is not equal to UsersComponent");
    });

    it("expect controller fetches data after $onInit", () => {
        const controller = componentController("users", {}, null) as UsersController;
        controller.$onInit();
        httpBackend.flush();
    });

    it("controller.users is not undefined after $onInit", () => {
        const controller = componentController("users", {}, null) as UsersController;
        controller.$onInit();
        httpBackend.flush();
        expect(controller.dataSource).not.toBeUndefined("controller.users is undefined...");
    });

    it("controller.users is not null after $onInit", () => {
        const controller = componentController("users", {}, null) as UsersController;
        controller.$onInit();
        httpBackend.flush();
        expect(controller.dataSource).not.toBeNull("controller.users is null...");
    });

    it("controller.isLoadingData is false after $onInit", () => {
        const controller = componentController("users", {}, null) as UsersController;
        controller.$onInit();
        httpBackend.flush();
        expect(controller.isLoadingData).toBeFalsy("isLoadingData is true after the loading...");
    });
});
