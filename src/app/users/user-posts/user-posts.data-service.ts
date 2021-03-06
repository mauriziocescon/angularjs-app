import * as ng from 'angular';

import {
  IAppConstantsService,
  IUtilitiesService,
} from '../../app.module';
import {
  RequestWs,
  ResponseWs,
} from '../../shared/shared.module';

import { Post } from './user-posts.model';

export interface IUserPostsService {
  getPosts(userId: string, textFilter: string | undefined): ng.IPromise<ResponseWs<Post[] | undefined>>;

  cancelOngoingRequests(): void;
}

export class UserPostsService implements IUserPostsService {
  public static $inject = ['$http', '$q', 'AppConstantsService', 'UtilitiesService'];

  // requests
  protected getUserPostsRequest: RequestWs<Post[]>;

  constructor(protected http: ng.IHttpService,
              protected q: ng.IQService,
              protected appConstantsService: IAppConstantsService,
              protected utilitiesService: IUtilitiesService) {
    this.getUserPostsRequest = new RequestWs();
  }

  public getPosts(userId: string, textFilter: string | undefined): ng.IPromise<ResponseWs<Post[] | undefined>> {

    // reset request
    this.getUserPostsRequest.reset(this.utilitiesService);

    // configure new request
    this.getUserPostsRequest.canceler = this.q.defer();
    const config: ng.IRequestShortcutConfig = {
      params: { userId, q: textFilter },
      // set a promise that let you cancel the current request
      timeout: this.getUserPostsRequest.canceler.promise,
    };

    // setup a timeout for the request
    this.getUserPostsRequest.setupTimeout(this, this.utilitiesService);

    const url = this.appConstantsService.Api.posts;

    // fetch data
    this.getUserPostsRequest.promise = this.http.get<Post[]>(url, config);

    return this.getUserPostsRequest.promise
      .then((response: ng.IHttpResponse<Post[]>) => {
        return new ResponseWs(response.status === 200, response.statusText, response.data, true, response.status === -1);

      }, (response: ng.IHttpResponse<Post[]>) => {
        return new ResponseWs(false, response.statusText, undefined, true, response.status === -1);
      });
  }

  public cancelOngoingRequests(): void {

    // reset requests
    this.getUserPostsRequest.reset(this.utilitiesService);
  }
}
