import * as angular from 'angular';

import { IAngularStats } from 'angular-stats';
import * as parseLinkHeader from 'parse-link-header';

import { TypeDetect } from '../../shared/shared.module';

import { IAppConstantsService } from './app-constants.service';

/**
 * Generic utilities
 */
export interface IUtilitiesService {
  /**
   * Defer the calling of func
   *
   * @param func
   * @param n
   * @param scope
   * @param args
   */
  defer(func: Function, n: number, scope: any, ...args: any[]): ng.IPromise<any>; // tslint:disable-line:ban-types
  /**
   * Cancel the defer func
   *
   * @param promise
   */
  clearDefer(promise: ng.IPromise<any>): void;

  /**
   * Call func on a particular scope
   *
   * @param func
   * @param scope
   * @param args
   */
  call(func: Function, scope: any, ...args: any[]): void; // tslint:disable-line:ban-types
  /**
   * Deeply copy the object
   *
   * @param original
   */
  clone<T>(original: T): T;

  /**
   * Compare the objects
   * using angular equal
   *
   * @param value1
   * @param value2
   */
  equals<T>(value1: T, value2: T): boolean;

  /**
   * Create a unique id
   */
  createUUID(): string;

  /**
   * Determine is a string is
   * not undefined and not empty
   *
   * @param text
   */
  isDefinedAndNotEmpty(text: string | undefined): boolean;

  /**
   * Get today
   */
  getToday(): Date;

  /**
   * Get now
   */
  getNow(): Date;

  /**
   * Get absolute time
   */
  getTimeFrom1970(): number;

  /**
   * Add a script to the DOM
   * and load it
   *
   * @param src
   */
  addScript(src: string): void;

  /**
   *
   * @param url
   */
  getPath(url: string | undefined): string;

  /**
   *
   */
  getCurrentPath(): string;

  /**
   * Return params of a url
   *
   * @param url
   */
  parseQueryString(url: string): any;

  /**
   * Count the number of scopes / watchers
   * for every component. Analyze the DOM
   */
  analyzeWebApp(): string;

  /**
   * Create a random response
   * with common http code
   *
   * @param data
   * @param headers
   */
  randomHttpStatusCode(data?: any, headers?: any): any;

  /**
   * Parse link property
   * inside headers
   *
   * @param headers
   */
  parseLinkHeaders(headers: any): any;
}

export class UtilitiesService implements IUtilitiesService {
  public static $inject = ['$rootScope', '$document', '$window', '$timeout', 'AngularStats', 'AppConstantsService'];

  protected static WARNING_TIME_SCOPE = 1000;

  constructor(protected rootScope: ng.IRootScopeService,
              protected document: ng.IDocumentService,
              protected window: ng.IWindowService,
              protected timeout: ng.ITimeoutService,
              protected angularStats: IAngularStats,
              protected appConstantsService: IAppConstantsService) {
  }

  // tslint:disable-next-line:ban-types
  public defer(func: Function, n: number, scope: any, ...args: any[]): ng.IPromise<any> {
    return this.timeout(() => {
      func.apply(scope, args);
    }, n);
  }

  public clearDefer(promise: ng.IPromise<any>): void {
    if (promise) {
      this.timeout.cancel(promise);
    }
  }

  // tslint:disable-next-line:ban-types
  public call(func: Function, scope: any, ...args: any[]): void {
    func.apply(scope, args);
  }

  public clone<T>(original: T): T {
    if (original !== undefined) {
      return angular.copy(original);
    } else {
      return original;
    }
  }

  public equals<T>(value1: T, value2: T): boolean {
    return angular.equals(value1, value2);
  }

  public createUUID(): string {
    // tslint:disable:no-bitwise
    let d = new Date().getTime();
    if (this.window.performance && typeof this.window.performance.now === 'function') {
      d += performance.now(); // use high-precision timer if available
    }
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    // tslint:enable:no-bitwise
    return uuid;
  }

  public isDefinedAndNotEmpty(text: string | undefined): boolean {
    if (!TypeDetect.isString(text) || text === '') {
      return false;
    }

    return (text as string).replace(/^\s*/, '').replace(/\s*$/, '').length > 0;
  }

  public getToday(): Date {
    const now = this.getNow();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  public getNow(): Date {
    return new Date();
  }

  public getTimeFrom1970(): number {
    return this.getNow().getTime();
  }

  public addScript(src: string): void {
    const document = this.document[0] as Document;
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      const script: HTMLScriptElement = document.createElement('script');
      script.setAttribute('src', src);
      script.setAttribute('type', 'text/javascript');
      script.setAttribute('charset', 'utf-8');
      const head = document.getElementById('head');
      if (head) {
        head.appendChild(script);
      }
    }
    else {
      const line = '<script type=\'text/javascript\' charset=\'utf-8\' src=\'' + src + '\'></script>';
      document.writeln(line);
    }
  }

  public getPath(url: string | undefined): string {
    if (TypeDetect.isString(url) === false || this.isDefinedAndNotEmpty(url) === false || !url) {
      return '/';
    }

    return url.indexOf('!') === -1 ? (url.startsWith('/') === true ? url : '/') : url.slice(url.indexOf('!') + 1);
  }

  public getCurrentPath(): string {
    const path = this.getPath(this.window.location.href.toString());

    if (this.isDefinedAndNotEmpty(path) === true) {
      return path;
    } else {
      return '/';
    }
  }

  public parseQueryString(url: string): any {
    const urlParams: { [key: string]: string } = {};

    url.replace(new RegExp('([^?=&]+)(=([^&]*))?', 'g'), (substring: string, ...args: any[]) => {
      return urlParams[args[0]] = args[2];
    });

    return urlParams;
  }

  public analyzeWebApp(): string {
    return this.angularStats.analyzeWebApp();
  }

  public randomHttpStatusCode(data?: any, headers?: any): any {
    const choice = Math.random();

    if (choice < 0.005) {
      return [300, data, headers, 'Multiple Choices'];
    }
    else if (choice < 0.01) {
      return [301, data, headers, 'Moved Permanently'];
    }
    else if (choice < 0.015) {
      return [302, data, headers, 'Found'];
    }
    else if (choice < 0.02) {
      return [304, data, headers, 'Not Modified'];
    }
    else if (choice < 0.025) {
      return [307, data, headers, 'Temporary Redirect'];
    }
    else if (choice < 0.03) {
      return [400, data, headers, 'Bad Request'];
    }
    else if (choice < 0.035) {
      return [401, data, headers, 'Unauthorized'];
    }
    else if (choice < 0.04) {
      return [403, data, headers, 'Forbidden'];
    }
    else if (choice < 0.045) {
      return [404, data, headers, 'Not Found'];
    }
    else if (choice < 0.05) {
      return [410, data, headers, 'Gone'];
    }
    else if (choice < 0.055) {
      return [500, data, headers, 'Internal Server Error'];
    }
    else if (choice < 0.06) {
      return [501, data, headers, 'Not Implemented'];
    }
    else if (choice < 0.065) {
      return [503, data, headers, 'Service Unavailable'];
    }
    else if (choice < 0.07) {
      return [550, data, headers, 'Permission denied'];
    }

    return [200, data, headers, 'OK'];
  }

  public parseLinkHeaders(headers: ng.IHttpHeadersGetter): any {
    if (headers && headers('link') && headers('link').length === 0) {
      throw new Error('parseLinkHeaders: link must be defined');
    }

    return parseLinkHeader(headers('link'));
  }
}
