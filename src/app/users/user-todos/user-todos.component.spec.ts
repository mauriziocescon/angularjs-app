import * as angular from "angular";
import {Todo} from "./user-todos.model";
import {UserTodosController} from "./user-todos.component";
import {IAppConstantsService, IUtilitiesService} from "../../app.module";

// Addition of angular-mocks and jasmine references is done on the gulpfile
describe("UserTodosController", () => {
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

		// returns the current list of todos per userId
		httpBackend.whenGET((url: string) => {
			return url.startsWith(AppConstantsService.Application.WS_URL + "/todos");
		}).respond((method: string, url: string, data: string, headers: Object, params?: any) => {

			let response = [];

			for (let i = 0; i < 10; i++) {
				let todo = new Todo();

				todo.userId = parseInt(params.userId);
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
		let controller = <UserTodosController>componentController("userTodos", null, null);
		controller.$onInit();
		httpBackend.flush();
		expect(controller.name).toBe("UserTodosComponent", "controller.name is not equal to UserTodosComponent");
	});

	it("expect controller fetches data after $onInit", () => {
		let controller = <UserTodosController>componentController("userTodos", null, null);
		controller.$onInit();
		httpBackend.flush();
	});

	it("controller.todos is not undefined after $onInit", () => {
		let controller = <UserTodosController>componentController("userTodos", null, null);
		controller.$onInit();
		httpBackend.flush();
		expect(controller.todos).not.toBeUndefined("controller.todos is undefined...");
	});

	it("controller.todos is not null after $onInit", () => {
		let controller = <UserTodosController>componentController("userTodos", null, null);
		controller.$onInit();
		httpBackend.flush();
		expect(controller.todos).not.toBeNull("controller.todos is null...");
	});

	it("controller.isLoadingData is false after $onInit", () => {
		let controller = <UserTodosController>componentController("userTodos", null, null);
		controller.$onInit();
		httpBackend.flush();
		expect(controller.isLoadingData).toBeFalsy("isLoadingData is true after the loading...");
	});
});