/**
 * Establish if the device is
 * online or not.
 *
 * When the status changes, an
 * apply to the rootScope gets
 * trigger
 */
export interface IConnectionService {
  /**
   * Setup the service: call this method
   * as soon as the service gets created
   */
  start(): void;

  /**
   * Tell you if you're online or not
   */
  isOnline(): boolean;
}

export class ConnectionService implements IConnectionService {
  public static $inject = ['$rootScope', '$window'];

  protected onLine!: boolean;

  constructor(protected rootScope: ng.IRootScopeService,
              protected window: ng.IWindowService) {
  }

  public start(): void {
    this.onLine = navigator.onLine;

    this.window.onoffline = () => {
      this.onLine = false;
      this.rootScope.$apply();
    };

    this.window.ononline = () => {
      this.onLine = true;
      this.rootScope.$apply();
    };
  }

  public isOnline(): boolean {
    return this.onLine;
  }
}
