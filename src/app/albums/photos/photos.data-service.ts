import * as ng from "angular";

import {
    IAppConstantsService,
    IUtilitiesService,
} from "../../app.module";
import {
    RequestWs,
    ResponseWs,
} from "../../shared/shared.module";

import { Photo } from "./photos.model";

import { environment } from "../../../environments/environment";

export interface IPhotosService {
    getPhoto(id: number): ng.IPromise<ResponseWs<Photo[] | undefined>>;

    getPhotos(ids: number[]): ng.IPromise<ResponseWs<Photo[] | undefined>>;

    getPhotosForAlbum(albumId: number, page: number): ng.IPromise<ResponseWs<Photo[] | undefined>>;

    cancelOngoingRequests(): void;
}

export class PhotosService implements IPhotosService {
    public static $inject = ["$http", "$q", "AppConstantsService", "UtilitiesService"];

    protected http: ng.IHttpService;
    protected q: ng.IQService;
    protected appConstantsService: IAppConstantsService;
    protected utilitiesService: IUtilitiesService;

    // requests
    protected getPhotoRequest: RequestWs<Photo[]>;
    protected getPhotosRequests: Array<RequestWs<Photo>>;
    protected getPhotosForAlbumRequests: RequestWs<Photo[]>;

    constructor($http: ng.IHttpService,
                $q: ng.IQService,
                AppConstantsService: IAppConstantsService,
                UtilitiesService: IUtilitiesService) {
        this.http = $http;
        this.q = $q;
        this.appConstantsService = AppConstantsService;
        this.utilitiesService = UtilitiesService;

        this.getPhotoRequest = new RequestWs();
        this.getPhotosRequests = [];
        this.getPhotosForAlbumRequests = new RequestWs();
        this.http.defaults = this.httpDefaults;
    }

    protected get httpDefaults(): ng.IHttpProviderDefaults {
        return {};
    }

    public getPhoto(id: number): ng.IPromise<ResponseWs<Photo[] | undefined>> {

        // fetch data using the generic currentGetPhotoRequest
        this.setupGetPhotoRequest(id, this.getPhotoRequest);

        return this.getPhotoRequest.promise
            .then((response: ng.IHttpResponse<Photo[]>) => {
                return new ResponseWs(response.status === 200, response.statusText, response.data, true, response.status === -1);

            })
            .catch((response: ng.IHttpResponse<Photo>) => {
                return new ResponseWs(false, response.statusText, undefined, true, response.status === -1);
            });
    }

    public getPhotos(ids: number[]): ng.IPromise<ResponseWs<Photo[] | undefined>> {

        // reset requests timeout
        this.getPhotosRequests.forEach((request: RequestWs<Photo>) => {
            request.reset(this.utilitiesService);
        });

        // setup new requests
        this.getPhotosRequests = [];

        const promises = ids.map((id: number) => {
            const request = new RequestWs<any>();
            this.getPhotosRequests.push(request);
            this.setupGetPhotoRequest(id, request);
            return request.promise;
        });

        return this.q.all(promises)
            .then((responses: Array<ng.IHttpResponse<Photo[]>>) => {

                let photos: Photo[] = [];
                responses.forEach((response: ng.IHttpResponse<Photo[]>) => {
                    photos = photos.concat(response.data);
                });

                return new ResponseWs(true, "OK", photos, true, responses.findIndex((response) => {
                    return response.status === -1;
                }) !== -1);

            }, (response: ng.IHttpResponse<Photo>) => {
                return new ResponseWs(false, response.statusText, undefined, true, response.status === -1);
            });
    }

    public getPhotosForAlbum(albumId: number, page: number): ng.IPromise<ResponseWs<Photo[] | undefined>> {

        // reset request
        this.getPhotosForAlbumRequests.reset(this.utilitiesService);

        // configure new request
        this.getPhotosForAlbumRequests.canceler = this.q.defer();
        const config: ng.IRequestShortcutConfig = {
            params: {albumId, _page: page},
            // set a promise that let you cancel the current request
            timeout: this.getPhotosForAlbumRequests.canceler.promise,
        };

        // setup a timeout for the request
        this.getPhotosForAlbumRequests.setupTimeout(this, this.utilitiesService);

        const url = this.appConstantsService.Api.photos;

        // fetch data
        this.getPhotosForAlbumRequests.promise = this.http.get<Photo[]>(url, config);

        return this.getPhotosForAlbumRequests.promise
            .then((response: ng.IHttpResponse<Photo[]>) => {
                let info = this.utilitiesService.parseLinkHeaders(response.headers);

                if (!info.last) {
                    // default value: when there are no
                    // pages, info is empty
                    info = {
                        first: environment.apiUrl + "albums?_page=1",
                        last: environment.apiUrl + "albums?_page=1",
                        next: environment.apiUrl + "albums?_page=1",
                    };
                }

                const lastPage = parseInt(this.utilitiesService.parseQueryString(info.last)._page, 10);
                return new ResponseWs(response.status === 200, response.statusText, response.data, page === lastPage, response.status === -1);

            }, (response: ng.IHttpResponse<Photo[]>) => {
                return new ResponseWs(false, response.statusText, undefined, true, response.status === -1);
            });
    }

    public cancelOngoingRequests(): void {

        // reset requests
        this.getPhotoRequest.reset(this.utilitiesService);
        this.getPhotosRequests.forEach((request: RequestWs<Photo>) => {
            request.reset(this.utilitiesService);
        });
        this.getPhotosForAlbumRequests.reset(this.utilitiesService);
    }

    protected setupGetPhotoRequest(id: number, request: RequestWs<Photo[]>): void {

        // reset request
        request.reset(this.utilitiesService);

        // configure new request
        request.canceler = this.q.defer();
        const config: ng.IRequestShortcutConfig = {
            params: {id},
            // setup a promise that let you cancel the current request
            timeout: request.canceler.promise,
        };

        // setup a timeout for the request
        request.setupTimeout(this, this.utilitiesService);

        const url = this.appConstantsService.Api.photos;

        // fetch data
        request.promise = this.http.get(url, config);
    }
}
