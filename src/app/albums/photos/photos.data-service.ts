import * as ng from "angular";
import {Photo} from "./photos.model";
import {
    RequestWs,
    ResponseWs
} from "../../shared/shared.module";
import {
    IAppConstantsService,
    IUtilitiesService
} from "../../app.module";

export interface IPhotosService {
    getPhoto(id: number): ng.IPromise<ResponseWs<Array<Photo>>>;
    getPhotos(ids: Array<number>): ng.IPromise<ResponseWs<Array<Photo>>>;
    getPhotosForAlbum(albumId: number, page: number): ng.IPromise<ResponseWs<Array<Photo>>>;
    cancelOngoingRequests(): void;
}

export class PhotosService implements IPhotosService {
    protected http: ng.IHttpService;
    protected q: ng.IQService;
    protected appConstantsService: IAppConstantsService;
    protected utilitiesService: IUtilitiesService;

    // requests
    private getPhotoRequest: RequestWs<Array<Photo>>;
    private getPhotosRequests: Array<RequestWs<Photo>>;
    private getPhotosForAlbumRequests: RequestWs<Array<Photo>>;

    static $inject = ["$http", "$q", "AppConstantsService", "UtilitiesService"];

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

    private get httpDefaults(): ng.IHttpProviderDefaults {
        return {};
    }

    private setupGetPhotoRequest(id: number, request: RequestWs<Array<Photo>>): void {

        // reset request
        request.reset(this.utilitiesService);

        // configure new request
        request.canceler = this.q.defer();
        let config: ng.IRequestShortcutConfig = {
            params: {id: id},
            // setup a promise that let you cancel the current request
            timeout: request.canceler.promise
        };

        // setup a timeout for the request
        request.setupTimeout(this, this.utilitiesService);

        let url = this.appConstantsService.Application.WS_URL + "/photos";
        this.utilitiesService.logRequest(url, config);

        // fetch data
        request.promise = this.http.get(url, config);
    }

    public getPhoto(id: number): ng.IPromise<ResponseWs<Array<Photo>>> {

        // fetch data using the generic currentGetPhotoRequest
        this.setupGetPhotoRequest(id, this.getPhotoRequest);

        let startTime = this.utilitiesService.getTimeFrom1970();

        return this.getPhotoRequest.promise.then((response: ng.IHttpPromiseCallbackArg<Array<Photo>>) => {
            this.utilitiesService.logResponse(response, startTime);
            return new ResponseWs(response.status == 200, response.statusText, response.data, true, response.status == -1);

        }).catch((response: ng.IHttpPromiseCallbackArg<Photo>) => {
            this.utilitiesService.logResponse(response, startTime);
            return new ResponseWs(false, response.statusText, undefined, true, response.status == -1);
        });
    }

    public getPhotos(ids: Array<number>): ng.IPromise<ResponseWs<Array<Photo>>> {

        // reset requests timeout
        this.getPhotosRequests.forEach((request: RequestWs<Photo>) => {
            request.reset(this.utilitiesService);
        });

        // setup new requests
        this.getPhotosRequests = [];

        let promises = ids.map((id: number) => {
            let request = new RequestWs();
            this.getPhotosRequests.push(request);
            this.setupGetPhotoRequest(id, request);
            return request.promise;
        });

        let startTime = this.utilitiesService.getTimeFrom1970();

        return this.q.all(promises).then((responses: Array<ng.IHttpPromiseCallbackArg<Array<Photo>>>) => {
            this.utilitiesService.logResponse(responses, startTime);

            let photos = [];
            responses.forEach((response: ng.IHttpPromiseCallbackArg<Array<Photo>>) => {
                photos = photos.concat(response.data);
            });

            return new ResponseWs(true, "OK", photos, true, responses.findIndex((response) => {
                    return response.status == -1
                }) != -1);

        }, (response: ng.IHttpPromiseCallbackArg<Photo>) => {
            this.utilitiesService.logResponse(response, startTime);
            return new ResponseWs(false, response.statusText, undefined, true, response.status == -1);
        });
    }

    public getPhotosForAlbum(albumId: number, page: number): ng.IPromise<ResponseWs<Array<Photo>>> {

        // reset request
        this.getPhotosForAlbumRequests.reset(this.utilitiesService);

        // configure new request
        this.getPhotosForAlbumRequests.canceler = this.q.defer();
        let config: ng.IRequestShortcutConfig = {
            params: {albumId: albumId, _page: page},
            // set a promise that let you cancel the current request
            timeout: this.getPhotosForAlbumRequests.canceler.promise
        };

        // setup a timeout for the request
        this.getPhotosForAlbumRequests.setupTimeout(this, this.utilitiesService);

        let url = this.appConstantsService.Application.WS_URL + "/photos";
        this.utilitiesService.logRequest(url);
        let startTime = this.utilitiesService.getTimeFrom1970();

        // fetch data
        this.getPhotosForAlbumRequests.promise = this.http.get<Array<Photo>>(url, config);

        return this.getPhotosForAlbumRequests.promise.then((response: ng.IHttpPromiseCallbackArg<Array<Photo>>) => {
            this.utilitiesService.logResponse(response, startTime);
            let info = this.utilitiesService.parseLinkHeaders(response.headers);

            if (!info.last) {
                // default value: when there are no
                // pages, info is empty
                info = {
                    first: "http://jsonplaceholder.typicode.com/default?_page=1",
                    last: "http://jsonplaceholder.typicode.com/default?_page=1",
                    next: "http://jsonplaceholder.typicode.com/default?_page=1"
                };
            }

            let lastPage = parseInt(this.utilitiesService.parseQueryString(info.last)._page);
            return new ResponseWs(response.status == 200, response.statusText, response.data, page == lastPage, response.status == -1);

        }, (response: ng.IHttpPromiseCallbackArg<Array<Photo>>) => {
            this.utilitiesService.logResponse(response, startTime);
            return new ResponseWs(false, response.statusText, undefined, true, response.status == -1);
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
}
