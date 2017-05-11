import { IAppConstantsService, IUtilitiesService } from "../app.module";

import { Album } from "./albums.model";

export let albumsRunFuncMocks = ($httpBackend: ng.IHttpBackendService,
                                 AppConstantsService: IAppConstantsService,
                                 UtilitiesService: IUtilitiesService) => {

    // returns a list of albums
    $httpBackend.whenGET((url: string) => {
        return AppConstantsService.Application.MOCK_BACKEND === true &&
            url.startsWith(AppConstantsService.Application.WS_URL + "/albums");
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
        const textFilter = params.q || "";
        const page = parseInt(params._page, null);

        for (let i = (page * 10) - 10; i < page * 10; i++) {
            const album = new Album();

            album.userId = page * 10;
            album.id = i;
            album.title = fakeText.substring(0, (Math.random() * 10000) % 20) + " " + textFilter;

            response.push(album);
        }

        // pagination
        const prevPage = Math.max(page - 1, 1);
        const nextPage = page + 1;
        headers = {
            link: "<http://jsonplaceholder.typicode.com/albums?_page=1>; rel=\"first\", " +
            "<http://jsonplaceholder.typicode.com/albums?_page=" + prevPage.toString() + ">; rel=\"prev\", " +
            "<http://jsonplaceholder.typicode.com/albums?_page=" + nextPage.toString() + ">; rel=\"next\", " +
            "<http://jsonplaceholder.typicode.com/albums?_page=50>; rel=\"last\"",
        };

        return AppConstantsService.Application.CAN_MOCK_WS_FAIL ? UtilitiesService.randomHttpStatusCode(response, headers) : [200, response, headers, "ok"];
    });
};

albumsRunFuncMocks.$inject = ["$httpBackend", "AppConstantsService", "UtilitiesService"];
