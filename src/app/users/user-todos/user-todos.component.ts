import {
    IDelayExecutionService,
    INavigationBarService,
    IUIUtilitiesService,
    IUtilitiesService,
} from "../../app.module";
import {
    Enum,
    ISharedFilterService,
    Logger,
    ResponseWs,
} from "../../shared/shared.module";

import { IUserTodosService } from "./user-todos.data-service";
import { Todo } from "./user-todos.model";

export class UserTodosController {
    public static $inject = ["$filter", "$location", "$stateParams", "$translate", "DelayExecutionService", "NavigationBarService", "UIUtilitiesService", "UtilitiesService", "UserTodosService"];
    public name: string;
    public textFilter: string;

    protected filter: ISharedFilterService;
    protected location: ng.ILocationService;
    protected stateParams: ng.ui.IStateParamsService;
    protected translate: ng.translate.ITranslateService;
    protected delayExecutionService: IDelayExecutionService;
    protected navigationBarService: INavigationBarService;
    protected uiUtilitiesService: IUIUtilitiesService;
    protected utilitiesService: IUtilitiesService;
    protected todosService: IUserTodosService;

    protected todos: Todo[];
    protected busy: boolean;
    protected loadTodosKey: Enum;

    constructor($filter: ISharedFilterService,
                $location: ng.ILocationService,
                $stateParams: ng.ui.IStateParamsService,
                $translate: ng.translate.ITranslateService,
                DelayExecutionService: IDelayExecutionService,
                NavigationBarService: INavigationBarService,
                UIUtilitiesService: IUIUtilitiesService,
                UtilitiesService: IUtilitiesService,
                UserTodosService: IUserTodosService) {
        this.filter = $filter;
        this.location = $location;
        this.stateParams = $stateParams;
        this.translate = $translate;
        this.delayExecutionService = DelayExecutionService;
        this.navigationBarService = NavigationBarService;
        this.uiUtilitiesService = UIUtilitiesService;
        this.utilitiesService = UtilitiesService;
        this.todosService = UserTodosService;

        this.name = "UserTodosComponent";
    }

    public get isLoadingData(): boolean {
        return this.busy === true;
    }

    public get hasNoData(): boolean {
        return this.todos !== undefined && this.todos.length === 0 && this.isLoadingData === false;
    }

    public get shouldRetry(): boolean {
        return this.todos === undefined && this.isLoadingData === false;
    }

    public get showData(): boolean {
        return this.isLoadingData === false && this.hasNoData === false && this.shouldRetry === false;
    }

    public get dataSource(): Todo[] {
        return this.todos;
    }

    public $onInit(): void {
        this.translate(["TODOS"]).then((translations: any) => {
            this.navigationBarService.setTitle(translations.TODOS);
            this.loadTodosKey = new Enum("TODOS");
            this.busy = false;
            this.loadDataSource();
        });
    }

    public $onDestroy(): void {
        this.todosService.cancelOngoingRequests();
    }

    public getTodoDesc(todo: Todo): string {
        return todo.title;
    }

    public isCompleted(todo: Todo): boolean {
        return todo.completed;
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
        }, this.loadTodosKey, 1500);
    }

    public loadDataSource(): void {
        this.busy = true;
        this.todos = undefined;

        const userId = "userId";
        this.todosService.getTodos(this.stateParams[userId], this.textFilter).then((response: ResponseWs<Todo[]>) => {

            if (response.isSuccess()) {
                this.todos = response.getData();
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

    public changeTodo(todo: Todo): void {
        todo.completed = !todo.completed;
    }
}

export const UserTodosComponent: ng.IComponentOptions = {
    bindings: {},
    controller: UserTodosController,
    templateUrl: () => {
        return "user-todos.component.html";
    },
};
