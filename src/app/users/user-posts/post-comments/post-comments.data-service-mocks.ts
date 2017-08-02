import { IAppConstantsService, IUtilitiesService } from "../../../app.module";
import { Comment } from "./post-comments.model";

export let postCommentsRunFuncMocks = ($httpBackend: ng.IHttpBackendService,
                                       AppConstantsService: IAppConstantsService,
                                       UtilitiesService: IUtilitiesService) => {

    // returns a list of comments for a particular post
    $httpBackend.whenGET((url: string) => {
        return AppConstantsService.Application.MOCK_BACKEND === true &&
            url.startsWith(AppConstantsService.Api.comments);
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

        for (let i = 0; i < Math.round(Math.random() * 150); i++) {
            const comment = new Comment();

            comment.postId = parseInt(params.postId, null);
            comment.id = i;
            comment.name = fakeText.substring(0, (Math.random() * 10000) % 20);
            comment.email = fakeText.substring(0, (Math.random() * 10000) % 20);
            comment.body = fakeText.substring(0, (Math.random() * 10000) % fakeText.length);

            response.push(comment);
        }

        return AppConstantsService.Application.CAN_MOCK_WS_FAIL ? UtilitiesService.randomHttpStatusCode(response, {}) : [200, response, {}, "ok"];
    });
};

postCommentsRunFuncMocks.$inject = ["$httpBackend", "AppConstantsService", "UtilitiesService"];
