import * as ng from "angular";

import {
    IAppConstantsService,
    IUtilitiesService,
} from "../app.module";
import {
    RequestWs,
    ResponseWs,
} from "../shared/shared.module";

import { User } from "./users.model";

export interface IUsersService {
    getUsers(textFilter: string): ng.IPromise<ResponseWs<User[]>>;
    cancelOngoingRequests(): void;
}

export class UsersService implements IUsersService {
    public static $inject = ["$http", "$q", "AppConstantsService", "UtilitiesService"];

    protected http: ng.IHttpService;
    protected q: ng.IQService;
    protected appConstantsService: IAppConstantsService;
    protected utilitiesService: IUtilitiesService;

    // requests
    protected getUsersRequest: RequestWs<User[]>;

    constructor($http: ng.IHttpService,
                $q: ng.IQService,
                AppConstantsService: IAppConstantsService,
                UtilitiesService: IUtilitiesService) {
        this.http = $http;
        this.q = $q;
        this.appConstantsService = AppConstantsService;
        this.utilitiesService = UtilitiesService;

        this.getUsersRequest = new RequestWs();
        this.http.defaults = this.httpDefaults;
    }

    protected get httpDefaults(): ng.IHttpProviderDefaults {
        return {};
    }

    public getUsers(textFilter: string): ng.IPromise<ResponseWs<User[]>> {

        // reset request
        this.getUsersRequest.reset(this.utilitiesService);

        // configure new request
        this.getUsersRequest.canceler = this.q.defer();
        const config: ng.IRequestShortcutConfig = {
            params: {q: textFilter},
            // set a promise that let you cancel the current request
            timeout: this.getUsersRequest.canceler.promise,
        };

        // setup a timeout for the request
        this.getUsersRequest.setupTimeout(this, this.utilitiesService);

        const url = this.appConstantsService.Api.users;
        this.utilitiesService.logRequest(url);
        const startTime = this.utilitiesService.getTimeFrom1970();

        // fetch data
        this.getUsersRequest.promise = this.http.get<User[]>(url, config);

        return this.getUsersRequest.promise.then((response: ng.IHttpPromiseCallbackArg<User[]>) => {
            this.utilitiesService.logResponse(response, startTime);
            return new ResponseWs(response.status === 200, response.statusText, response.data, true, response.status === -1);

        }, (response: ng.IHttpPromiseCallbackArg<User[]>) => {
            this.utilitiesService.logResponse(response, startTime);
            return new ResponseWs(false, response.statusText, undefined, true, response.status === -1);
        });
    }

    public cancelOngoingRequests(): void {

        // reset requests
        this.getUsersRequest.reset(this.utilitiesService);
    }
}
