import template from './users.component.html';

import {
  IDelayExecutionService,
  INavigationBarService,
  IUIUtilitiesService,
  IUtilitiesService,
} from '../app.module';
import {
  Enum,
  ISharedFilterService,
  Logger,
  ResponseWs,
} from '../shared/shared.module';

import { IUsersService } from './users.data-service';
import { User } from './users.model';

export class UsersController {
  public static $inject = ['$filter', '$location', '$translate', 'DelayExecutionService', 'NavigationBarService', 'UIUtilitiesService', 'UtilitiesService', 'UsersService'];
  public name: string;
  public textFilter: string | undefined;

  protected users: User[] | undefined;
  protected busy!: boolean;
  protected loadUsersKey!: Enum;

  constructor(protected filter: ISharedFilterService,
              protected location: ng.ILocationService,
              protected translate: ng.translate.ITranslateService,
              protected delayExecutionService: IDelayExecutionService,
              protected navigationBarService: INavigationBarService,
              protected uiUtilitiesService: IUIUtilitiesService,
              protected utilitiesService: IUtilitiesService,
              protected usersService: IUsersService) {
    this.name = 'UsersComponent';
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

  public get dataSource(): User[] | undefined {
    return this.users;
  }

  public $onInit(): void {
    this.translate(['USERS.USERS'])
      .then((translations: any) => {
        this.navigationBarService.setTitle(translations['USERS.USERS']);
        this.loadUsersKey = new Enum('USERS');
        this.busy = false;
        this.loadDataSource();
      });
  }

  public $onDestroy(): void {
    this.usersService.cancelOngoingRequests();
  }

  public getUserNameDesc(user: User): string {
    return user.name + ' (' + user.username + ')';
  }

  public getUserAddressDesc(user: User): string {
    return user.address.street + ' ' + user.address.suite + ', ' + user.address.city + ' (' + user.address.zipcode + ')';
  }

  public getUserCompanyDesc(user: User): string {
    return user.company.name + ' ' + user.company.catchPhrase + user.company.bs;
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

    this.usersService.getUsers(this.textFilter)
      .then((response: ResponseWs<User[] | undefined>) => {

        if (response.isSuccess()) {
          this.users = response.getData();
        }
        else if (response.hasBeenCanceled() === false) {
          // we do not notify the user in case of cancel request
          this.translate(['USERS.ERROR_ACCESS_DATA', 'USERS.CLOSE'])
            .then((translations: any) => {
              this.uiUtilitiesService.modalAlert(translations['USERS.ERROR_ACCESS_DATA'], response.getMessage(), translations['USERS.CLOSE']);
            });
        }
      })
      .catch((reason: any) => {
        this.translate(['USERS.ERROR_ACCESS_DATA', 'USERS.CLOSE'])
          .then((translations: any) => {
            this.uiUtilitiesService.modalAlert(translations['USERS.ERROR_ACCESS_DATA'], reason.toString(), translations['USERS.CLOSE']);
          });
        Logger.log(reason);
      })
      .finally(() => {
        this.busy = false;
      });
  }

  public goToUserPosts(user: User, event: ng.IAngularEvent): void {
    event.preventDefault();
    if (event.stopPropagation) {
      event.stopPropagation();
    }
    this.location.path('/user-posts/' + user.id);
  }

  public goToUserTodos(user: User, event: ng.IAngularEvent): void {
    event.preventDefault();
    if (event.stopPropagation) {
      event.stopPropagation();
    }
    this.location.path('/user-todos/' + user.id);
  }
}

export const UsersComponent: ng.IComponentOptions = {
  bindings: {},
  controller: UsersController,
  template: () => {
    return template;
  },
};
