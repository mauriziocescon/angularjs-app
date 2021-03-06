import * as ng from 'angular';
import { IUtilitiesService } from '../../app.module';

export class RequestWs<T> {
  public promise!: ng.IHttpPromise<T>;
  public canceler!: ng.IDeferred<any>;
  public timeout!: ng.IPromise<any>;

  constructor() {
    // do nothing
  }

  public setupTimeout(scope: any, utilitiesService: IUtilitiesService): void {
    this.timeout = utilitiesService.defer(() => {
      this.cancel();
    }, 60000, scope);
  }

  public reset(utilitiesService: IUtilitiesService): void {

    // reset request timeout
    if (this.timeout) {
      utilitiesService.clearDefer(this.timeout);
    }

    // cancel ongoing request or do nothing
    this.cancel();
  }

  protected cancel(): void {

    // abort http request if it's defined
    if (this.canceler) {
      this.canceler.resolve('Resolve $http request');
    }
  }
}
