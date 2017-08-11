import {
    IDelayExecutionService,
    INavigationBarService,
    IUIUtilitiesService,
    IUtilitiesService,
} from "../app.module";
import {
    Enum,
    ISharedFilterService,
    Logger,
    ResponseWs,
} from "../shared/shared.module";

import { IUsersService } from "./users.data-service";
import { User } from "./users.model";

export class UsersController {
    public static $inject = ["$filter", "$location", "$translate", "DelayExecutionService", "NavigationBarService", "UIUtilitiesService", "UtilitiesService", "UsersService"];
    public name: string;
    public textFilter: string;

    protected filter: ISharedFilterService;
    protected location: ng.ILocationService;
    protected translate: ng.translate.ITranslateService;
    protected delayExecutionService: IDelayExecutionService;
    protected navigationBarService: INavigationBarService;
    protected uiUtilitiesService: IUIUtilitiesService;
    protected utilitiesService: IUtilitiesService;
    protected usersService: IUsersService;

    protected users: User[];
    protected busy: boolean;
    protected loadUsersKey: Enum;

    constructor($filter: ISharedFilterService,
                $location: ng.ILocationService,
                $translate: ng.translate.ITranslateService,
                DelayExecutionService: IDelayExecutionService,
                NavigationBarService: INavigationBarService,
                UIUtilitiesService: IUIUtilitiesService,
                UtilitiesService: IUtilitiesService,
                UsersService: IUsersService) {
        this.filter = $filter;
        this.location = $location;
        this.translate = $translate;
        this.delayExecutionService = DelayExecutionService;
        this.navigationBarService = NavigationBarService;
        this.uiUtilitiesService = UIUtilitiesService;
        this.utilitiesService = UtilitiesService;
        this.usersService = UsersService;

        this.name = "UsersComponent";
    }

    public get isLoadingData(): boolean {
        return this.busy === true;
    }

    public get hasNoData(): boolean {
        return this.users !== undefined && this.users.length === 0 && this.isLoadingData === false;
    }

    public get shouldRetry(): boolean {
        return this.users === undefined && this.isLoadingData === false;
    }

    public get showData(): boolean {
        return this.isLoadingData === false && this.hasNoData === false && this.shouldRetry === false;
    }

    public get dataSource(): User[] {
        return this.users;
    }

    public $onInit(): void {
        this.translate(["USERS"]).then((translations: any) => {
            this.navigationBarService.setTitle(translations.USERS);
            this.loadUsersKey = new Enum("USERS");
            this.busy = false;
            this.loadDataSource();
        });
    }

    public $onDestroy(): void {
        this.usersService.cancelOngoingRequests();
    }

    public getUserNameDesc(user: User): string {
        return user.name + " (" + user.username + ")";
    }

    public getUserAddressDesc(user: User): string {
        return user.address.street + " " + user.address.suite + ", " + user.address.city + " (" + user.address.zipcode + ")";
    }

    public getUserCompanyDesc(user: User): string {
        return user.company.name + " " + user.company.catchPhrase + user.company.bs;
    }

    public resetTextFilter(): void {
        if (this.textFilter === undefined) {
            return;
        }

        this.textFilter = undefined;
        this.loadDataSource();
    }

    public textFilterDidChange(): void {
        this.delayExecutionService.execute(() => {
            this.loadDataSource();
        }, this.loadUsersKey, 1500);
    }

    public loadDataSource(): void {
        this.busy = true;
        this.users = undefined;

        this.usersService.getUsers(this.textFilter).then((response: ResponseWs<User[]>) => {

            if (response.isSuccess()) {
                this.users = response.getData();
            }
            else if (response.hasBeenCanceled() === false) {
                // we do not notify the user in case of cancel request
                this.translate(["ERROR_ACCESS_DATA", "CLOSE"]).then((translations: any) => {
                    this.uiUtilitiesService.modalAlert(translations.ERROR_ACCESS_DATA, response.getMessage(), translations.CLOSE);
                });
            }
        }).catch((reason: any) => {
            this.translate(["ERROR_ACCESS_DATA_COMPONENT", "CLOSE"]).then((translations: any) => {
                this.uiUtilitiesService.modalAlert(translations.ERROR_ACCESS_DATA_COMPONENT, reason.toString(), translations.CLOSE);
            });
            Logger.log(reason);
        }).finally(() => {
            this.busy = false;
        });
    }

    public goToUserPosts(user: User, event: ng.IAngularEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.location.path("/user-posts/" + user.id);
    }

    public goToUserTodos(user: User, event: ng.IAngularEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.location.path("/user-todos/" + user.id);
    }
}

export const UsersComponent: ng.IComponentOptions = {
    bindings: {},
    controller: UsersController,
    templateUrl: () => {
        return "users.component.html";
    },
};
