import * as angular from "angular";

import { IAppConstantsService, IUtilitiesService } from "../../app.module";

import { UserPostsController } from "./user-posts.component";
import { Post} from "./user-posts.model";

// Addition of angular-mocks and jasmine references is done on the gulpfile
describe("UserPostsController", () => {
    let httpBackend: ng.IHttpBackendService;
    let componentController: ng.IComponentControllerService;
    let appConstantsService: IAppConstantsService;
    let utilitiesService: IUtilitiesService;

    // Set up the module
    beforeEach(angular.mock.module("app"));

    beforeEach(inject(($httpBackend, $componentController, AppConstantsService, UtilitiesService) => {

        // Set up the mock http service responses
        httpBackend = $httpBackend;

        // The $componentController service is used to create instances of controllers
        componentController = $componentController;

        appConstantsService = AppConstantsService;
        utilitiesService = UtilitiesService;

        // returns a list of posts
        httpBackend.whenGET((url: string) => {
            return url.startsWith(appConstantsService.Application.WS_URL + "/posts");
        }).respond((method: string, url: string, data: string, headers: Object, params?: any) => {

            const response = [];

            for (let i = 0; i < 20; i++) {
                const post = new Post();

                post.userId = parseInt(params.userId, null);
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
        const controller = componentController("userPosts", null, null) as UserPostsController;
        controller.$onInit();
        httpBackend.flush();
        expect(controller.name).toBe("UserPostsComponent", "controller.name is not equal to UserPostsComponent");
    });

    it("expect controller fetches data after $onInit", () => {
        const controller = componentController("userPosts", null, null) as UserPostsController;
        controller.$onInit();
        httpBackend.flush();
    });

    it("controller.posts is not undefined after $onInit", () => {
        const controller = componentController("userPosts", null, null) as UserPostsController;
        controller.$onInit();
        httpBackend.flush();
        expect(controller.dataSource).not.toBeUndefined("controller.posts is undefined...");
    });

    it("controller.posts is not null after $onInit", () => {
        const controller = componentController("userPosts", null, null) as UserPostsController;
        controller.$onInit();
        httpBackend.flush();
        expect(controller.dataSource).not.toBeNull("controller.posts is null...");
    });

    it("controller.isLoadingData is false after $onInit", () => {
        const controller = componentController("userPosts", null, null) as UserPostsController;
        controller.$onInit();
        httpBackend.flush();
        expect(controller.isLoadingData).toBeFalsy("isLoadingData is true after the loading...");
    });
});
