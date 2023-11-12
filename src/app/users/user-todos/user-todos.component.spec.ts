import * as angular from 'angular';

import * as i18nEn from '../../../assets/i18n/en.json';

import { IAppConstantsService, IUtilitiesService } from '../../app.module';

import { UserTodosController } from './user-todos.component';
import { Todo } from './user-todos.model';

describe('UserTodosController', () => {
  let httpBackend: ng.IHttpBackendService;
  let componentController: ng.IComponentControllerService;
  let appConstantsService: IAppConstantsService;
  let utilitiesService: IUtilitiesService;

  // Set up the module
  beforeEach(angular.mock.module('app'));

  beforeEach(inject(($httpBackend: ng.IHttpBackendService,
                     $componentController: ng.IComponentControllerService,
                     AppConstantsService: IAppConstantsService,
                     UtilitiesService: IUtilitiesService) => {

    // Set up the mock http service responses
    httpBackend = $httpBackend;

    // The $componentController service is used to create instances of controllers
    componentController = $componentController;

    appConstantsService = AppConstantsService;
    utilitiesService = UtilitiesService;

    // returns a list of i18n strings
    httpBackend.whenGET((url: string) => {
      return url.startsWith('assets/i18n/');
    }).respond((method: string, url: string, data: string, headers: unknown, params?: any) => {
      const response = i18nEn;
      return [200, response, headers, 'ok'];
    });

    // returns the current list of todos per userId
    httpBackend.whenGET((url: string) => {
      return url.startsWith(appConstantsService.Api.todos);
    }).respond((method: string, url: string, data: string, headers: unknown, params?: any) => {

      const response = [];

      for (let i = 0; i < 10; i++) {
        const todo = new Todo(parseInt(params.userId, 10), i, 'title ' + i.toString(), Math.random() > 0.5);

        response.push(todo);
      }

      return [200, response, {}, 'ok'];
    });
  }));

  afterEach(() => {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('controller.name is defined after $onInit', () => {
    const controller = componentController('userTodos', {}, null) as UserTodosController;
    controller.$onInit();
    httpBackend.flush();
    expect(controller.name).toBe('UserTodosComponent', 'controller.name is not equal to UserTodosComponent');
  });

  it('expect controller fetches data after $onInit', () => {
    const controller = componentController('userTodos', {}, null) as UserTodosController;
    controller.$onInit();
    httpBackend.flush();
  });

  it('controller.todos is not undefined after $onInit', () => {
    const controller = componentController('userTodos', {}, null) as UserTodosController;
    controller.$onInit();
    httpBackend.flush();
    expect(controller.dataSource).not.toBeUndefined('controller.todos is undefined...');
  });

  it('controller.todos is not null after $onInit', () => {
    const controller = componentController('userTodos', {}, null) as UserTodosController;
    controller.$onInit();
    httpBackend.flush();
    expect(controller.dataSource).not.toBeNull('controller.todos is null...');
  });

  it('controller.isLoadingData is false after $onInit', () => {
    const controller = componentController('userTodos', {}, null) as UserTodosController;
    controller.$onInit();
    httpBackend.flush();
    expect(controller.isLoadingData).toBeFalsy('isLoadingData is true after the loading...');
  });
});
