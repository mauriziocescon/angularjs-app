import { User } from "./users.model";
import { IUsersService } from "./users.data-service";
import {
    Enum,
    ISharedFilterService,
    Logger,
    ResponseWs,
} from "../shared/shared.module";
import {
    IDelayExecutionService,
    ILocalizedStringService,
    INavigationBarService,
    IUIUtilitiesService,
    IUtilitiesService,
} from "../app.module";

export class UsersController {
    public static $inject = ["$filter", "$location", "DelayExecutionService", "LocalizedStringService", "UIUtilitiesService", "UtilitiesService", "NavigationBarService", "UsersService"];
    public name: string;

    private filter: ISharedFilterService;
    private location: ng.ILocationService;
    private delayExecutionService: IDelayExecutionService;
    private localizedStringService: ILocalizedStringService;
    private uiUtilitiesService: IUIUtilitiesService;
    private utilitiesService: IUtilitiesService;
    private navigationBarService: INavigationBarService;
    private usersService: IUsersService;

    public users: User[];
    private busy: boolean;
    public textFilter: string;
    private loadUsersKey: Enum;

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

    public $onInit(): void {
        this.navigationBarService.setTitle(this.localizedStringService.getLocalizedString("USERS"));
        this.loadUsersKey = new Enum("USERS");
        this.busy = false;
        this.loadUsers();
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
        this.loadUsers();
    }

    public textFilterDidChange(): void {
        this.delayExecutionService.execute(() => {
            this.loadUsers();
        }, this.loadUsersKey, 1500);
    }

    protected loadUsers(): void {
        this.busy = true;
        this.users = undefined;

        this.usersService.getUsers(this.textFilter).then((response: ResponseWs<Array<User>>) => {

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

    public $onDestroy(): void {
        this.usersService.cancelOngoingRequests();
    }
}

export const UsersComponent: ng.IComponentOptions = {
    bindings: {},
    controller: UsersController,
    templateUrl: () => {
        return "users.component.html";
    },
};
