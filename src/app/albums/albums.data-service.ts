import * as ng from "angular";

import {
    IAppConstantsService,
    IUtilitiesService,
} from "../app.module";
import {
    RequestWs,
    ResponseWs,
} from "../shared/shared.module";

import { Album } from "./albums.model";

export interface IAlbumsService {
    getAlbums(textFilter: string | undefined, page: number): ng.IPromise<ResponseWs<Album[]>>;
    cancelOngoingRequests(): void;
}

export class AlbumsService implements IAlbumsService {
    public static $inject = ["$http", "$q", "AppConstantsService", "UtilitiesService"];

    protected http: ng.IHttpService;
    protected q: ng.IQService;
    protected appConstantsService: IAppConstantsService;
    protected utilitiesService: IUtilitiesService;

    // requests
    protected getAlbumsRequest: RequestWs<Album[]>;

    constructor($http: ng.IHttpService,
                $q: ng.IQService,
                AppConstantsService: IAppConstantsService,
                UtilitiesService: IUtilitiesService) {
        this.http = $http;
        this.q = $q;
        this.appConstantsService = AppConstantsService;
        this.utilitiesService = UtilitiesService;

        this.getAlbumsRequest = new RequestWs();
        this.http.defaults = this.httpDefaults;
    }

    protected get httpDefaults(): ng.IHttpProviderDefaults {
        return {};
    }

    public getAlbums(textFilter: string | undefined, page: number): ng.IPromise<ResponseWs<Album[]>> {

        // reset request
        this.getAlbumsRequest.reset(this.utilitiesService);

        // configure new request
        this.getAlbumsRequest.canceler = this.q.defer();
        const config: ng.IRequestShortcutConfig = {
            params: {q: textFilter, _page: page},
            // set a promise that let you cancel the current request
            timeout: this.getAlbumsRequest.canceler.promise,
        };

        // setup a timeout for the request
        this.getAlbumsRequest.setupTimeout(this, this.utilitiesService);

        const url = this.appConstantsService.Api.albums;
        this.utilitiesService.logRequest(url);
        const startTime = this.utilitiesService.getTimeFrom1970();

        // fetch data
        this.getAlbumsRequest.promise = this.http.get<Album[]>(url, config);

        return this.getAlbumsRequest.promise.then((response: ng.IHttpResponse<Album[]>) => {
            this.utilitiesService.logResponse(response, startTime);
            let info = this.utilitiesService.parseLinkHeaders(response.headers);

            if (!info.last) {
                // default value: when there are no
                // pages, info is empty
                info = {
                    first: "http://jsonplaceholder.typicode.com/default?_page=1",
                    last: "http://jsonplaceholder.typicode.com/default?_page=1",
                    next: "http://jsonplaceholder.typicode.com/default?_page=1",
                };
            }

            const lastPage = parseInt(this.utilitiesService.parseQueryString(info.last)._page, undefined);
            return new ResponseWs(response.status === 200, response.statusText, response.data, page === lastPage, response.status === -1);

        }, (response: ng.IHttpResponse<Album[]>) => {
            this.utilitiesService.logResponse(response, startTime);
            return new ResponseWs(false, response.statusText, undefined, true, response.status === -1);
        });
    }

    public cancelOngoingRequests(): void {

        // reset requests
        this.getAlbumsRequest.reset(this.utilitiesService);
    }
}
