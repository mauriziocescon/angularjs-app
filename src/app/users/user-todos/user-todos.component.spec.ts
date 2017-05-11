import * as angular from "angular";

import { IAppConstantsService, IUtilitiesService } from "../../app.module";

import { UserTodosController } from "./user-todos.component";
import { Todo} from "./user-todos.model";

// Addition of angular-mocks and jasmine references is done on the gulpfile
describe("UserTodosController", () => {
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

        // returns the current list of todos per userId
        httpBackend.whenGET((url: string) => {
            return url.startsWith(appConstantsService.Application.WS_URL + "/todos");
        }).respond((method: string, url: string, data: string, headers: Object, params?: any) => {

            const response = [];

            for (let i = 0; i < 10; i++) {
                const todo = new Todo();

                todo.userId = parseInt(params.userId, null);
                todo.id = i;
                todo.title = "title " + i.toString();
                todo.completed = Math.random() > 0.5;

                response.push(todo);
            }

            return [200, response, {}, "ok"];
        });
    }));

    afterEach(() => {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it("controller.name is defined after $onInit", () => {
        const controller = componentController("userTodos", null, null) as UserTodosController;
        controller.$onInit();
        httpBackend.flush();
        expect(controller.name).toBe("UserTodosComponent", "controller.name is not equal to UserTodosComponent");
    });

    it("expect controller fetches data after $onInit", () => {
        const controller = componentController("userTodos", null, null) as UserTodosController;
        controller.$onInit();
        httpBackend.flush();
    });

    it("controller.todos is not undefined after $onInit", () => {
        const controller = componentController("userTodos", null, null) as UserTodosController;
        controller.$onInit();
        httpBackend.flush();
        expect(controller.dataSource).not.toBeUndefined("controller.todos is undefined...");
    });

    it("controller.todos is not null after $onInit", () => {
        const controller = componentController("userTodos", null, null) as UserTodosController;
        controller.$onInit();
        httpBackend.flush();
        expect(controller.dataSource).not.toBeNull("controller.todos is null...");
    });

    it("controller.isLoadingData is false after $onInit", () => {
        const controller = componentController("userTodos", null, null) as UserTodosController;
        controller.$onInit();
        httpBackend.flush();
        expect(controller.isLoadingData).toBeFalsy("isLoadingData is true after the loading...");
    });
});
