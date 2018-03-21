import * as ng from 'angular';

import {
  IAppConstantsService,
  IUtilitiesService,
} from '../app.module';
import {
  RequestWs,
  ResponseWs,
} from '../shared/shared.module';

import { Album } from './albums.model';

import { environment } from '../../environments/environment';

export interface IAlbumsService {
  getAlbums(textFilter: string | undefined, page: number): ng.IPromise<ResponseWs<Album[] | undefined>>;

  cancelOngoingRequests(): void;
}

export class AlbumsService implements IAlbumsService {
  public static $inject = ['$http', '$q', 'AppConstantsService', 'UtilitiesService'];

  // requests
  protected getAlbumsRequest: RequestWs<Album[]>;

  constructor(protected http: ng.IHttpService,
              protected q: ng.IQService,
              protected appConstantsService: IAppConstantsService,
              protected utilitiesService: IUtilitiesService) {
    this.getAlbumsRequest = new RequestWs();
  }

  public getAlbums(textFilter: string | undefined, page: number): ng.IPromise<ResponseWs<Album[] | undefined>> {

    // reset request
    this.getAlbumsRequest.reset(this.utilitiesService);

    // configure new request
    this.getAlbumsRequest.canceler = this.q.defer();
    const config: ng.IRequestShortcutConfig = {
      params: { q: textFilter, _page: page },
      // set a promise that let you cancel the current request
      timeout: this.getAlbumsRequest.canceler.promise,
    };

    // setup a timeout for the request
    this.getAlbumsRequest.setupTimeout(this, this.utilitiesService);

    const url = this.appConstantsService.Api.albums;

    // fetch data
    this.getAlbumsRequest.promise = this.http.get<Album[]>(url, config);

    return this.getAlbumsRequest.promise
      .then((response: ng.IHttpResponse<Album[]>) => {
        const info = this.utilitiesService.parseLinkHeaders(response.headers);

        const lastPage = parseInt(info ? info.last._page : '1', 10);
        return new ResponseWs(response.status === 200, response.statusText, response.data, page === lastPage, response.status === -1);

      }, (response: ng.IHttpResponse<Album[]>) => {
        return new ResponseWs(false, response.statusText, undefined, true, response.status === -1);
      });
  }

  public cancelOngoingRequests(): void {

    // reset requests
    this.getAlbumsRequest.reset(this.utilitiesService);
  }
}
