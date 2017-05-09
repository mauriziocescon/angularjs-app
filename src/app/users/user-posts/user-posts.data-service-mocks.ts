import { IAppConstantsService, IUtilitiesService } from "../../app.module";

import { Post } from "./user-posts.model";

export let userPostsRunFuncMocks = ($httpBackend: ng.IHttpBackendService,
                                    AppConstantsService: IAppConstantsService,
                                    UtilitiesService: IUtilitiesService) => {

    // returns a list of posts
    $httpBackend.whenGET((url: string) => {
        return AppConstantsService.Application.MOCK_BACKEND === true &&
            url.startsWith(AppConstantsService.Application.WS_URL + "/posts");
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

        for (let i = 0; i < Math.round(Math.random() * 150); i++) {
            const post = new Post();

            post.userId = parseInt(params.userId, null);
            post.id = i;
            post.title = fakeText.substring(0, (Math.random() * 10000) % 20);
            post.body = fakeText.substring(0, (Math.random() * 10000) % fakeText.length);

            response.push(post);
        }

        return AppConstantsService.Application.CAN_MOCK_WS_FAIL ? UtilitiesService.randomHttpStatusCode(response, {}) : [200, response, {}, "ok"];
    });
};

userPostsRunFuncMocks.$inject = ["$httpBackend", "AppConstantsService", "UtilitiesService"];
