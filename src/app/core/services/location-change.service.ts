import { Enum } from '../../shared/shared.module';
import { IUtilitiesService } from './utilities.service';

/**
 * Manage $location changes
 * allowing preventing the
 * event
 */
export interface ILocationChangeService {
  /**
   * Setup the service: this method has
   * to be called as soon as the service
   * gets created
   */
  start(): void;

  /**
   * Prevent changes from
   *
   * @param semaphore
   * @param url
   */
  lockLocationChange(semaphore: Enum, url?: string): void;

  unlockLocationChange(semaphore: Enum): boolean;
}

export class LocationChangeService implements ILocationChangeService {
  public static $inject = ['$rootScope', '$location', 'UtilitiesService'];

  protected semaphoreQueue: string[];
  protected lastUrlBlock: string | undefined;

  constructor(protected rootScope: ng.IRootScopeService,
              protected location: ng.ILocationService,
              protected utilitiesService: IUtilitiesService) {
    this.semaphoreQueue = [];
  }

  public start(): void {
    this.rootScope.$on('$locationChangeStart', (event: ng.IAngularEvent, nextLocation, currentLocation) => {
      this.locationChangeStart(event, nextLocation, currentLocation);
    });
  }

  public lockLocationChange(semaphore: Enum, url?: string): void {
    if (this.semaphoreQueue.indexOf(semaphore.toString()) === -1) {
      this.semaphoreQueue.push(semaphore.toString());
    }
    if (this.utilitiesService.isDefinedAndNotEmpty(url) === true) {
      this.lastUrlBlock = this.utilitiesService.getPath(url);
    }
  }

  public unlockLocationChange(semaphore: Enum): boolean {
    const index = this.semaphoreQueue.indexOf(semaphore.toString());

    if (index !== -1) {
      this.semaphoreQueue.splice(index);

      if (this.semaphoreQueue.length === 0 && this.utilitiesService.isDefinedAndNotEmpty(this.lastUrlBlock) === true && this.lastUrlBlock) {
        this.location.path(this.lastUrlBlock);
        this.lastUrlBlock = undefined;
        this.rootScope.$apply();
        return true;
      }
    }

    return false;
  }

  protected locationChangeStart(event: ng.IAngularEvent, nextLocation: string, currentLocation: string): void {
    if (this.semaphoreQueue.length > 0) {
      event.preventDefault();
      this.lastUrlBlock = this.utilitiesService.getPath(nextLocation);
    }
  }
}
