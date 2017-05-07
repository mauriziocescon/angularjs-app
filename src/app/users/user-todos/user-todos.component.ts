import {Todo} from "./user-todos.model";
import {IUserTodosService} from "./user-todos.data-service";
import {
    ISharedFilterService,
    ResponseWs,
    Logger,
    Enum
} from "../../shared/shared.module";
import {
    IDelayExecutionService,
    ILocalizedStringService,
    IUIUtilitiesService,
    IUtilitiesService,
    INavigationBarService
} from "../../app.module";

export class UserTodosController {
    public static $inject = ["$filter", "$location", "$stateParams", "DelayExecutionService", "LocalizedStringService", "UIUtilitiesService", "UtilitiesService", "NavigationBarService", "UserTodosService"];

    private filter: ISharedFilterService;
    private location: ng.ILocationService;
    private stateParams: ng.ui.IStateParamsService;
    private delayExecutionService: IDelayExecutionService;
    private localizedStringService: ILocalizedStringService;
    private uiUtilitiesService: IUIUtilitiesService;
    private utilitiesService: IUtilitiesService;
    private navigationBarService: INavigationBarService;
    private todosService: IUserTodosService;

    public name: string;
    public todos: Array<Todo>;
    private busy: boolean;
    public textFilter: string;
    private loadTodosKey: Enum;

    constructor($filter: ISharedFilterService,
                $location: ng.ILocationService,
                $stateParams: ng.ui.IStateParamsService,
                DelayExecutionService: IDelayExecutionService,
                LocalizedStringService: ILocalizedStringService,
                UIUtilitiesService: IUIUtilitiesService,
                UtilitiesService: IUtilitiesService,
                NavigationBarService: INavigationBarService,
                UserTodosService: IUserTodosService) {
        this.filter = $filter;
        this.location = $location;
        this.stateParams = $stateParams;
        this.delayExecutionService = DelayExecutionService;
        this.localizedStringService = LocalizedStringService;
        this.uiUtilitiesService = UIUtilitiesService;
        this.utilitiesService = UtilitiesService;
        this.navigationBarService = NavigationBarService;
        this.todosService = UserTodosService;

        this.name = "UserTodosComponent";
    }

    public get isLoadingData(): boolean {
        return this.busy == true;
    }

    public get hasNoData(): boolean {
        return this.todos != undefined && this.todos.length == 0 && this.isLoadingData == false;
    }

    public get shouldRetry(): boolean {
        return this.todos == undefined && this.isLoadingData == false;
    }

    public get showData(): boolean {
        return this.isLoadingData == false && this.hasNoData == false && this.shouldRetry == false;
    }

    public get textFilterPlaceholder(): string {
        return this.localizedStringService.getLocalizedString("INPUT_TEXT_PLACEHOLDER");
    }

    public $onInit(): void {
        this.navigationBarService.setTitle(this.localizedStringService.getLocalizedString("TODOS"));
        this.loadTodosKey = new Enum("TODOS");
        this.busy = false;
        this.loadTodos();
    }

    public getTodoDesc(todo: Todo): string {
        return todo.title;
    }

    public isCompleted(todo: Todo): boolean {
        return todo.completed;
    }

    public resetTextFilter(): void {
        if (this.textFilter == undefined)
            return;

        this.textFilter = undefined;
        this.loadTodos();
    }

    public textFilterDidChange(): void {
        this.delayExecutionService.execute(() => {
            this.loadTodos();
        }, this.loadTodosKey, 1500);
    }

    protected loadTodos(): void {
        this.busy = true;
        this.todos = undefined;

        this.todosService.getTodos(this.stateParams["userId"], this.textFilter).then((response: ResponseWs<Array<Todo>>) => {

            if (response.isSuccess()) {
                this.todos = response.getData();
            }
            else if (response.hasBeenCanceled() == false) {
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

    public changeTodo(todo: Todo): void {
        todo.completed = !todo.completed;
    }

    public $onDestroy(): void {
        this.todosService.cancelOngoingRequests();
    }
}

export const UserTodosComponent: ng.IComponentOptions = {
    bindings: {},
    controller: UserTodosController,
    templateUrl: () => {
        return "user-todos.component.html";
    }
};
