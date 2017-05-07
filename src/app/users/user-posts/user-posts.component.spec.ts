import * as angular from "angular";
import {Post} from "./user-posts.model";
import {UserPostsController} from "./user-posts.component";
import {IAppConstantsService, IUtilitiesService} from "../../app.module";

// Addition of angular-mocks and jasmine references is done on the gulpfile
describe("UserPostsController", () => {
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

        // returns a list of posts
        httpBackend.whenGET((url: string) => {
            return url.startsWith(AppConstantsService.Application.WS_URL + "/posts");
        }).respond((method: string, url: string, data: string, headers: Object, params?: any) => {

            let response = [];

            for (let i = 0; i < 20; i++) {
                let post = new Post();

                post.userId = parseInt(params.userId);
                post.id = i;
                post.title = "title";
                post.body = "body of the post";

                response.push(post);
            }

            return [200, response, {}, "ok"];
        });
    }));

    afterEach(() => {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it("controller.name is defined after $onInit", () => {
        let controller = <UserPostsController>componentController("userPosts", null, null);
        controller.$onInit();
        httpBackend.flush();
        expect(controller.name).toBe("UserPostsComponent", "controller.name is not equal to UserPostsComponent");
    });

    it("expect controller fetches data after $onInit", () => {
        let controller = <UserPostsController>componentController("userPosts", null, null);
        controller.$onInit();
        httpBackend.flush();
    });

    it("controller.posts is not undefined after $onInit", () => {
        let controller = <UserPostsController>componentController("userPosts", null, null);
        controller.$onInit();
        httpBackend.flush();
        expect(controller.posts).not.toBeUndefined("controller.posts is undefined...");
    });

    it("controller.posts is not null after $onInit", () => {
        let controller = <UserPostsController>componentController("userPosts", null, null);
        controller.$onInit();
        httpBackend.flush();
        expect(controller.posts).not.toBeNull("controller.posts is null...");
    });

    it("controller.isLoadingData is false after $onInit", () => {
        let controller = <UserPostsController>componentController("userPosts", null, null);
        controller.$onInit();
        httpBackend.flush();
        expect(controller.isLoadingData).toBeFalsy("isLoadingData is true after the loading...");
    });
});
