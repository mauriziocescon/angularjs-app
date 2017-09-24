import { IAppConstantsService, IUtilitiesService } from "../../app.module";

import { Photo } from "./photos.model";

export let photosRunFuncMocks = ($httpBackend: ng.IHttpBackendService,
                                 AppConstantsService: IAppConstantsService,
                                 UtilitiesService: IUtilitiesService) => {

    // returns one photo
    $httpBackend.whenGET((url: string) => {
        return AppConstantsService.Application.MOCK_BACKEND === true &&
            url.startsWith(AppConstantsService.Api.photos) &&
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

        photo.albumId = UtilitiesService.parseQueryString(url).albumId;
        photo.id = params.id;
        photo.title = fakeText.substring(0, (Math.random() * 10000) % 20);
        photo.url = ["chevron-circle-up.svg", "chevron-down.svg", "chevron-up.svg", "chevron-left.svg", "chevron-right.svg"][Math.round(Math.random() * 1000) % 5];
        photo.thumbnailUrl = ["chevron-circle-up.svg", "chevron-down.svg", "chevron-up.svg", "chevron-left.svg", "chevron-right.svg"][Math.round(Math.random() * 1000) % 5];

        response.push(photo);

        return AppConstantsService.Application.CAN_MOCK_WS_FAIL ? UtilitiesService.randomHttpStatusCode(response, headers) : [200, response, headers, "ok"];
    });

    // returns photos for album
    $httpBackend.whenGET((url: string) => {
        return AppConstantsService.Application.MOCK_BACKEND === true &&
            url.startsWith(AppConstantsService.Api.photos) &&
            (/(&|\?)albumId\=/g).test(url) === true;
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
        const page = parseInt(params._page, undefined);

        for (let i = (page * 10) - 10; i < page * 10; i++) {
            const photo = new Photo();

            photo.albumId = parseInt(params.albumId, undefined);
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
            link: "<http://jsonplaceholder.typicode.com/albums?_page=1>; rel=\"first\", " +
            "<http://jsonplaceholder.typicode.com/albums?_page=" + prevPage.toString() + ">; rel=\"prev\", " +
            "<http://jsonplaceholder.typicode.com/albums?_page=" + nextPage.toString() + ">; rel=\"next\", " +
            "<http://jsonplaceholder.typicode.com/albums?_page=10>; rel=\"last\"",
        };

        return AppConstantsService.Application.CAN_MOCK_WS_FAIL ? UtilitiesService.randomHttpStatusCode(response, headers) : [200, response, headers, "ok"];
    });
};

photosRunFuncMocks.$inject = ["$httpBackend", "AppConstantsService", "UtilitiesService"];
