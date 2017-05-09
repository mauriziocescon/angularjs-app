import * as ng from "angular";

import {
    IAppConstantsService,
    IUtilitiesService,
} from "../../app.module";
import {
    RequestWs,
    ResponseWs,
} from "../../shared/shared.module";

import { Todo } from "./user-todos.model";

export interface IUserTodosService {
    getTodos(userId: string, textFilter: string): ng.IPromise<ResponseWs<Todo[]>>;
    cancelOngoingRequests(): void;
}

export class UserTodosService implements IUserTodosService {
    public static $inject = ["$http", "$q", "AppConstantsService", "UtilitiesService"];

    protected http: ng.IHttpService;
    protected q: ng.IQService;
    protected appConstantsService: IAppConstantsService;
    protected utilitiesService: IUtilitiesService;

    // requests
    private getUserTodosRequest: RequestWs<Todo[]>;

    constructor($http: ng.IHttpService,
                $q: ng.IQService,
                AppConstantsService: IAppConstantsService,
                UtilitiesService: IUtilitiesService) {
        this.http = $http;
        this.q = $q;
        this.appConstantsService = AppConstantsService;
        this.utilitiesService = UtilitiesService;

        this.getUserTodosRequest = new RequestWs();
        this.http.defaults = this.httpDefaults;
    }

    private get httpDefaults(): ng.IHttpProviderDefaults {
        return {};
    }

    public getTodos(userId: string, textFilter: string): ng.IPromise<ResponseWs<Todo[]>> {

        // reset request
        this.getUserTodosRequest.reset(this.utilitiesService);

        // configure new request
        this.getUserTodosRequest.canceler = this.q.defer();
        const config: ng.IRequestShortcutConfig = {
            params: {userId, q: textFilter},
            // set a promise that let you cancel the current request
            timeout: this.getUserTodosRequest.canceler.promise
        };

        // setup a timeout for the request
        this.getUserTodosRequest.setupTimeout(this, this.utilitiesService);

        const url = this.appConstantsService.Application.WS_URL + "/todos";
        this.utilitiesService.logRequest(url);
        const startTime = this.utilitiesService.getTimeFrom1970();

        // fetch data
        this.getUserTodosRequest.promise = this.http.get<Todo[]>(url, config);

        return this.getUserTodosRequest.promise.then((response: ng.IHttpPromiseCallbackArg<Todo[]>) => {
            this.utilitiesService.logResponse(response, startTime);
            return new ResponseWs(response.status === 200, response.statusText, response.data, true, response.status === -1);

        }, (response: ng.IHttpPromiseCallbackArg<Todo[]>) => {
            this.utilitiesService.logResponse(response, startTime);
            return new ResponseWs(false, response.statusText, undefined, true, response.status === -1);
        });
    }

    public cancelOngoingRequests(): void {

        // reset requests
        this.getUserTodosRequest.reset(this.utilitiesService);
    }
}
