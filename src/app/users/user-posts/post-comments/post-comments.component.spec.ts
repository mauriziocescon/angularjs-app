import * as angular from "angular";
import { IAppConstantsService, IUtilitiesService } from "../../../app.module";
import { PostCommentsController } from "./post-comments.component";
import { Comment } from "./post-comments.model";

// Addition of angular-mocks and jasmine references is done on the gulpfile
describe("PostCommentsController", () => {
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

        // returns a list of comments for a particular post
        httpBackend.whenGET((url: string) => {
            return url.startsWith(AppConstantsService.Application.WS_URL + "/comments");
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
                const comment = new Comment();

                comment.postId = parseInt(params.postId, null);
                comment.id = i;
                comment.name = fakeText.substring(0, (Math.random() * 10000) % 20);
                comment.email = fakeText.substring(0, (Math.random() * 10000) % 20);
                comment.body = fakeText.substring(0, (Math.random() * 10000) % fakeText.length);

                response.push(comment);
            }

            return [200, response, {}, "ok"];
        });
    }));

    afterEach(() => {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it("controller.name is defined after $onInit", () => {
        const controller = componentController("postComments", null, {postId: 1}) as PostCommentsController;
        controller.$onInit();
        httpBackend.flush();
        expect(controller.name).toBe("PostCommentsComponent", "controller.name is not equal to PostCommentsComponent");
    });

    it("expect controller fetches data after $onInit", () => {
        const controller = componentController("postComments", null, {postId: 1}) as PostCommentsController;
        controller.$onInit();
        httpBackend.flush();
    });

    it("controller.posts is not undefined after $onInit", () => {
        const controller = componentController("postComments", null, {postId: 1}) as PostCommentsController;
        controller.$onInit();
        httpBackend.flush();
        expect(controller.dataSource).not.toBeUndefined("controller.posts is undefined...");
    });

    it("controller.posts is not null after $onInit", () => {
        const controller = componentController("postComments", null, {postId: 1}) as PostCommentsController;
        controller.$onInit();
        httpBackend.flush();
        expect(controller.dataSource).not.toBeNull("controller.posts is null...");
    });

    it("controller.isLoadingData is false after $onInit", () => {
        const controller = componentController("postComments", null, {postId: 1}) as PostCommentsController;
        controller.$onInit();
        httpBackend.flush();
        expect(controller.isLoadingData).toBeFalsy("isLoadingData is true after the loading...");
    });
});
