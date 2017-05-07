import * as ng from "angular";
import {
    IAppConstantsService,
    IUtilitiesService,
} from "../../app.module";
import {
    RequestWs,
    ResponseWs,
} from "../../shared/shared.module";
import {Post} from "./user-posts.model";

export interface IUserPostsService {
    getPosts(userId: string, textFilter: string): ng.IPromise<ResponseWs<Post[]>>;
    cancelOngoingRequests(): void;
}

export class UserPostsService implements IUserPostsService {
    protected http: ng.IHttpService;
    protected q: ng.IQService;
    protected appConstantsService: IAppConstantsService;
    protected utilitiesService: IUtilitiesService;

    // requests
    private getUserPostsRequest: RequestWs<Post[]>;

    public static $inject = ["$http", "$q", "AppConstantsService", "UtilitiesService"];

    constructor($http: ng.IHttpService,
                $q: ng.IQService,
                AppConstantsService: IAppConstantsService,
                UtilitiesService: IUtilitiesService) {
        this.http = $http;
        this.q = $q;
        this.appConstantsService = AppConstantsService;
        this.utilitiesService = UtilitiesService;

        this.getUserPostsRequest = new RequestWs();
        this.http.defaults = this.httpDefaults;
    }

    private get httpDefaults(): ng.IHttpProviderDefaults {
        return {};
    }

    public getPosts(userId: string, textFilter: string): ng.IPromise<ResponseWs<Post[]>> {

        // reset request
        this.getUserPostsRequest.reset(this.utilitiesService);

        // configure new request
        this.getUserPostsRequest.canceler = this.q.defer();
        const config: ng.IRequestShortcutConfig = {
            params: {userId, q: textFilter},
            // set a promise that let you cancel the current request
            timeout: this.getUserPostsRequest.canceler.promise,
        };

        // setup a timeout for the request
        this.getUserPostsRequest.setupTimeout(this, this.utilitiesService);

        const url = this.appConstantsService.Application.WS_URL + "/posts";
        this.utilitiesService.logRequest(url);
        const startTime = this.utilitiesService.getTimeFrom1970();

        // fetch data
        this.getUserPostsRequest.promise = this.http.get<Post[]>(url, config);

        return this.getUserPostsRequest.promise.then((response: ng.IHttpPromiseCallbackArg<Post[]>) => {
            this.utilitiesService.logResponse(response, startTime);
            return new ResponseWs(response.status === 200, response.statusText, response.data, true, response.status === -1);

        }, (response: ng.IHttpPromiseCallbackArg<Post[]>) => {
            this.utilitiesService.logResponse(response, startTime);
            return new ResponseWs(false, response.statusText, undefined, true, response.status === -1);
        });
    }

    public cancelOngoingRequests(): void {

        // reset requests
        this.getUserPostsRequest.reset(this.utilitiesService);
    }
}
