import * as angular from "angular";

import { photos } from "./photos.module";

import { IAppConstantsService, IUtilitiesService } from "../../app.module";

import { PhotosController } from "./photos.component";
import { Photo } from "./photos.model";

// Addition of angular-mocks and jasmine references is done on the gulpfile
describe("PhotosController", () => {
    let httpBackend: ng.IHttpBackendService;
    let componentController: ng.IComponentControllerService;
    let state: ng.ui.IStateService;
    let appConstantsService: IAppConstantsService;
    let utilitiesService: IUtilitiesService;

    // Set up the module
    beforeEach(angular.mock.module("app"));

    beforeEach(inject(($httpBackend: ng.IHttpBackendService,
                       $componentController: ng.IComponentControllerService,
                       $state: ng.ui.IStateService,
                       AppConstantsService: IAppConstantsService,
                       UtilitiesService: IUtilitiesService) => {

        // Set up the mock http service responses
        httpBackend = $httpBackend;

        // The $componentController service is used to create instances of controllers
        componentController = $componentController;

        // ui-router service
        state = $state;

        appConstantsService = AppConstantsService;
        utilitiesService = UtilitiesService;

        // returns one photo
        httpBackend.whenGET((url: string) => {
            return url.startsWith(appConstantsService.Api.photos) &&
                (/(&|\?)id\=/g).test(url) === true;
        }).respond((method: string, url: string, data: string, headers: Object, params?: any) => { // tslint:disable-line:ban-types

            const response = [];
            const fakeText = "Lorem ipsum dolor sit amet, vidit clita vitae no vix. " +
                "Melius utamur definiebas mei ad. No maluisset prodesset theophrastus eum. " +
                "Nam sadipscing adversarium ut. Est rebum aperiam ex, ex vel regione " +
                "forensibus contentiones, eos in numquam persecuti omittantur. Cu sumo " +
                "illum has, meis assum eligendi ex sit.\n Option sapientem dissentias ad eam, " +
                "cum virtute numquam ex, cum salutatus vituperata ne. Te omnes volumus pro. " +
                "Eu errem albucius invenire qui, unum dolorem ne nec. Torquatos concludaturque ius " +
                "et, cu viderer minimum voluptua duo, ex eligendi abhorreant vis. Sea posse legimus " +
                "vituperata no, per at etiam deserunt inimicus.";

            const photo = new Photo();

            photo.albumId = 124;
            photo.id = params.id;
            photo.title = fakeText.substring(0, (Math.random() * 10000) % 20);
            photo.url = "chevron-circle-up.svg";
            photo.thumbnailUrl = "chevron-circle-up.svg";

            response.push(photo);

            return [200, response, {}, "ok"];
        });

        // returns photos for album
        httpBackend.whenGET((url: string) => {
            return url.startsWith(AppConstantsService.Api.photos) && (/(&|\?)albumId\=/g).test(url) === true;
        }).respond((method: string, url: string, data: string, headers: Object, params?: any) => { // tslint:disable-line:ban-types

            const response = [];
            const fakeText = "Lorem ipsum dolor sit amet, vidit clita vitae no vix. " +
                "Melius utamur definiebas mei ad. No maluisset prodesset theophrastus eum. " +
                "Nam sadipscing adversarium ut. Est rebum aperiam ex, ex vel regione " +
                "forensibus contentiones, eos in numquam persecuti omittantur. Cu sumo " +
                "illum has, meis assum eligendi ex sit.\n Option sapientem dissentias ad eam, " +
                "cum virtute numquam ex, cum salutatus vituperata ne. Te omnes volumus pro. " +
                "Eu errem albucius invenire qui, unum dolorem ne nec. Torquatos concludaturque ius " +
                "et, cu viderer minimum voluptua duo, ex eligendi abhorreant vis. Sea posse legimus " +
                "vituperata no, per at etiam deserunt inimicus.";
            const page = parseInt(params._page, null);

            for (let i = (page * 10) - 10; i < page * 10; i++) {
                const photo = new Photo();

                photo.albumId = parseInt(params.albumId, null);
                photo.id = i;
                photo.title = fakeText.substring(0, (Math.random() * 10000) % 20);
                photo.url = ["chevron-circle-up.svg", "chevron-down.svg", "chevron-up.svg", "chevron-left.svg", "chevron-right.svg"][Math.round(Math.random() * 1000) % 5];
                photo.thumbnailUrl = ["chevron-circle-up.svg", "chevron-down.svg", "chevron-up.svg", "chevron-left.svg", "chevron-right.svg"][Math.round(Math.random() * 1000) % 5];

                response.push(photo);
            }

            // pagination
            const prevPage = Math.max(page - 1, 1);
            const nextPage = page + 1;
            headers = {
                link: "<http://jsonplaceholder.typicode.com/photos?_page=1>; rel=\"first\", " +
                "<http://jsonplaceholder.typicode.com/photos?_page=" + prevPage.toString() + ">; rel=\"prev\", " +
                "<http://jsonplaceholder.typicode.com/photos?_page=" + nextPage.toString() + ">; rel=\"next\", " +
                "<http://jsonplaceholder.typicode.com/photos?_page=10>; rel=\"last\"",
            };

            return AppConstantsService.Application.CAN_MOCK_WS_FAIL ? UtilitiesService.randomHttpStatusCode(response, headers) : [200, response, headers, "ok"];
        });

    }));

    afterEach(() => {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it("controller.name is defined after $onInit", () => {
        const controller = componentController("photos", null, null) as PhotosController;
        const stateParams = "stateParams";
        controller[stateParams] = {albumId: 1};
        controller.$onInit();
        httpBackend.flush();
        expect(controller.name).toBe("PhotosComponent", "controller.name is not equal to PhotosComponent");
    });

    it("expect controller fetches data after $onInit", () => {
        const controller = componentController("photos", null, null) as PhotosController;
        const stateParams = "stateParams";
        controller[stateParams] = {albumId: 1};
        controller.$onInit();
        httpBackend.flush();
    });

    it("controller.photos is not undefined after $onInit", () => {
        const controller = componentController("photos", null, null) as PhotosController;
        const stateParams = "stateParams";
        controller[stateParams] = {albumId: 1};
        controller.$onInit();
        httpBackend.flush();
        expect(controller.dataSource).not.toBeUndefined("controller.photos is undefined...");
    });

    it("controller.photos is not null after $onInit", () => {
        const controller = componentController("photos", null, null) as PhotosController;
        const stateParams = "stateParams";
        controller[stateParams] = {albumId: 1};
        controller.$onInit();
        httpBackend.flush();
        expect(controller.dataSource).not.toBeNull("controller.photos is null...");
    });

    it("controller.isLoadingData is false after $onInit", () => {
        const controller = componentController("photos", null, null) as PhotosController;
        const stateParams = "stateParams";
        controller[stateParams] = {albumId: 1};
        controller.$onInit();
        httpBackend.flush();
        expect(controller.isLoadingData).toBeFalsy("isLoadingData is true after the $onInit...");
    });
});
