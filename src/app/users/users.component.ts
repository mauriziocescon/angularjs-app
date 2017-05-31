import {
    IDelayExecutionService,
    ILocalizedStringService,
    IUIUtilitiesService,
    IUtilitiesService,
} from "../app.module";
import {
    Enum,
    INavigationBarService,
    ISharedFilterService,
    Logger,
    ResponseWs,
} from "../shared/shared.module";

import { IUsersService } from "./users.data-service";
import { User } from "./users.model";

export class UsersController {
    public static $inject = ["$filter", "$location", "DelayExecutionService", "LocalizedStringService", "UIUtilitiesService", "UtilitiesService", "NavigationBarService", "UsersService"];
    public name: string;
    public textFilter: string;

    protected filter: ISharedFilterService;
    protected location: ng.ILocationService;
    protected delayExecutionService: IDelayExecutionService;
    protected localizedStringService: ILocalizedStringService;
    protected uiUtilitiesService: IUIUtilitiesService;
    protected utilitiesService: IUtilitiesService;
    protected navigationBarService: INavigationBarService;
    protected usersService: IUsersService;

    protected users: User[];
    protected busy: boolean;
    protected loadUsersKey: Enum;

    constructor($filter: ISharedFilterService,
                $location: ng.ILocationService,
                DelayExecutionService: IDelayExecutionService,
                LocalizedStringService: ILocalizedStringService,
                UIUtilitiesService: IUIUtilitiesService,
                UtilitiesService: IUtilitiesService,
                NavigationBarService: INavigationBarService,
                UsersService: IUsersService) {
        this.filter = $filter;
        this.location = $location;
        this.delayExecutionService = DelayExecutionService;
        this.localizedStringService = LocalizedStringService;
        this.uiUtilitiesService = UIUtilitiesService;
        this.utilitiesService = UtilitiesService;
        this.navigationBarService = NavigationBarService;
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

    public get textFilterPlaceholder(): string {
        return this.localizedStringService.getLocalizedString("INPUT_TEXT_PLACEHOLDER");
    }

    public get dataSource(): User[] {
        return this.users;
    }

    public $onInit(): void {
        this.navigationBarService.setTitle(this.localizedStringService.getLocalizedString("USERS"));
        this.loadUsersKey = new Enum("USERS");
        this.busy = false;
        this.loadDataSource();
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
                this.uiUtilitiesService.modalAlert(this.localizedStringService.getLocalizedString("ERROR_ACCESS_DATA"), response.getMessage(), this.localizedStringService.getLocalizedString("CLOSE"));
            }
        }).catch((reason: any) => {
            this.uiUtilitiesService.modalAlert(this.localizedStringService.getLocalizedString("ERROR_ACCESS_DATA_COMPONENT"), reason.toString(), this.localizedStringService.getLocalizedString("CLOSE"));
            Logger.log(reason);
        }).finally(() => {
            this.busy = false;
        });
    }

    public goToUserPosts(user: User): void {
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
