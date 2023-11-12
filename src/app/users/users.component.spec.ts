import * as angular from 'angular';

import * as i18nEn from '../../assets/i18n/en.json';

import { IAppConstantsService, IUtilitiesService } from '../app.module';

import { UsersController } from './users.component';
import { Address, Company, Coordinates, User } from './users.model';

describe('UsersController', () => {
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

    // returns the current list of users
    httpBackend.whenGET((url: string) => {
      return url.startsWith(appConstantsService.Api.users);
    }).respond((method: string, url: string, data: string, headers: unknown, params?: any) => {

      const response = [];

      for (let i = 0; i < 4; i++) {

        const coordinates = new Coordinates('0', '0');
        const address = new Address('street', 'suite', 'city', '32332', coordinates);
        const company = new Company('name', 'catchPhrase', 'bs');
        const user = new User(i, 'name ' + i.toString(), 'username ' + i.toString(), 'name ' + i.toString() + '@email.com', address, '+39 20151025', 'www.' + 'name ' + i.toString() + '.com', company);

        response.push(user);
      }

      return [200, response, {}, 'ok'];
    });
  }));

  afterEach(() => {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('controller.name is defined after $onInit', () => {
    const controller = componentController('users', {}, null) as UsersController;
    controller.$onInit();
    httpBackend.flush();
    expect(controller.name).toBe('UsersComponent', 'controller.name is not equal to UsersComponent');
  });

  it('expect controller fetches data after $onInit', () => {
    const controller = componentController('users', {}, null) as UsersController;
    controller.$onInit();
    httpBackend.flush();
  });

  it('controller.users is not undefined after $onInit', () => {
    const controller = componentController('users', {}, null) as UsersController;
    controller.$onInit();
    httpBackend.flush();
    expect(controller.dataSource).not.toBeUndefined('controller.users is undefined...');
  });

  it('controller.users is not null after $onInit', () => {
    const controller = componentController('users', {}, null) as UsersController;
    controller.$onInit();
    httpBackend.flush();
    expect(controller.dataSource).not.toBeNull('controller.users is null...');
  });

  it('controller.isLoadingData is false after $onInit', () => {
    const controller = componentController('users', {}, null) as UsersController;
    controller.$onInit();
    httpBackend.flush();
    expect(controller.isLoadingData).toBeFalsy('isLoadingData is true after the loading...');
  });
});
