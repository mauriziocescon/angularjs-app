import * as ng from "angular";
import {Post} from "./user-posts.model";
import {
	RequestWs,
	ResponseWs
} from "../../shared/shared.module";
import {
	IAppConstantsService,
	IUtilitiesService,
} from "../../app.module";

export interface IUserPostsService {
	getPosts(userId: string, textFilter: string): ng.IPromise<ResponseWs<Array<Post>>>;
	cancelOngoingRequests(): void;
}

export class UserPostsService implements IUserPostsService {
	protected http: ng.IHttpService;
	protected q: ng.IQService;
	protected appConstantsService: IAppConstantsService;
	protected utilitiesService: IUtilitiesService;

	// requests
	private getUserPostsRequest: RequestWs<Array<Post>>;

	static $inject = ["$http", "$q", "AppConstantsService", "UtilitiesService"];

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

	public getPosts(userId: string, textFilter: string): ng.IPromise<ResponseWs<Array<Post>>> {

		// reset request
		this.getUserPostsRequest.reset(this.utilitiesService);

		// configure new request
		this.getUserPostsRequest.canceler = this.q.defer();
		let config: ng.IRequestShortcutConfig = {
			params: {userId: userId, q: textFilter},
			// set a promise that let you cancel the current request
			timeout: this.getUserPostsRequest.canceler.promise
		};

		// setup a timeout for the request
		this.getUserPostsRequest.setupTimeout(this, this.utilitiesService);

		let url = this.appConstantsService.Application.WS_URL + "/posts";
		this.utilitiesService.logRequest(url);
		let startTime = this.utilitiesService.getTimeFrom1970();

		// fetch data
		this.getUserPostsRequest.promise = this.http.get<Array<Post>>(url, config);

		return this.getUserPostsRequest.promise.then((response: ng.IHttpPromiseCallbackArg<Array<Post>>) => {
			this.utilitiesService.logResponse(response, startTime);
			return new ResponseWs(response.status == 200, response.statusText, response.data, true, response.status == -1);

		}, (response: ng.IHttpPromiseCallbackArg<Array<Post>>) => {
			this.utilitiesService.logResponse(response, startTime);
			return new ResponseWs(false, response.statusText, undefined, true, response.status == -1);
		});
	}

	public cancelOngoingRequests(): void {

		// reset requests
		this.getUserPostsRequest.reset(this.utilitiesService);
	}
}