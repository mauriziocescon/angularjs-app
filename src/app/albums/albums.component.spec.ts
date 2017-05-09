import * as angular from "angular";

import { IAppConstantsService, IUtilitiesService } from "../app.module";

import { AlbumsController } from "./albums.component";
import { Album } from "./albums.model";

// Addition of angular-mocks and jasmine references is done on the gulpfile
describe("AlbumsController", () => {
    let httpBackend: ng.IHttpBackendService;
    let componentController: ng.IComponentControllerService;
    let AppConstantsService: IAppConstantsService;
    let UtilitiesService: IUtilitiesService;

    // Set up the module
    beforeEach(angular.mock.module("app"));

    beforeEach(inject((_$httpBackend_, _$componentController_, _AppConstantsService_, _UtilitiesService_) => {

        // Set up the mock http service responses
        httpBackend = _$httpBackend_;

        // The $componentController service is used to create instances of controllers
        componentController = _$componentController_;

        AppConstantsService = _AppConstantsService_;
        UtilitiesService = _UtilitiesService_;

        // returns a list of albums
        httpBackend.whenGET((url: string) => {
            return url.startsWith(AppConstantsService.Application.WS_URL + "/albums");
        }).respond((method: string, url: string, data: string, headers: Object, params?: any) => {

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
                const album = new Album();

                album.userId = page * 10;
                album.id = i;
                album.title = fakeText.substring(0, (Math.random() * 10000) % 20);

                response.push(album);
            }

            // pagination
            const prevPage = Math.max(page - 1, 1);
            const nextPage = page + 1;
            headers = {
                link: "<http://jsonplaceholder.typicode.com/albums?_page=1>; rel=\"first\", " +
                "<http://jsonplaceholder.typicode.com/albums?_page=" + prevPage.toString() + ">; rel=\"prev\", " +
                "<http://jsonplaceholder.typicode.com/albums?_page=" + nextPage.toString() + ">; rel=\"next\", " +
                "<http://jsonplaceholder.typicode.com/albums?_page=10>; rel=\"last\""
            };

            return [200, response, headers, "ok"];
        });
    }));

    afterEach(() => {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it("controller.name is defined after $onInit", () => {
        const controller = componentController("albums", null, null) as AlbumsController;
        controller.$onInit();
        httpBackend.flush();
        expect(controller.name).toBe("AlbumsComponent", "controller.name is not equal to AlbumsComponent");
    });

    it("expect controller fetches data after $onInit", () => {
        const controller = componentController("albums", null, null) as AlbumsController;
        controller.$onInit();
        httpBackend.flush();
    });

    it("controller.albums is not undefined after $onInit", () => {
        const controller = componentController("albums", null, null) as AlbumsController;
        controller.$onInit();
        httpBackend.flush();
        expect(controller.dataSource).not.toBeUndefined("controller.albums is undefined...");
    });

    it("controller.albums is not null after $onInit", () => {
        const controller = componentController("albums", null, null) as AlbumsController;
        controller.$onInit();
        httpBackend.flush();
        expect(controller.dataSource).not.toBeNull("controller.albums is null...");
    });

    it("controller.isLoadingData is false after $onInit", () => {
        const controller = componentController("albums", null, null) as AlbumsController;
        controller.$onInit();
        httpBackend.flush();
        expect(controller.isLoadingData).toBeFalsy("isLoadingData is true after $onInit...");
    });
});
