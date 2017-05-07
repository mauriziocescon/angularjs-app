import { IUtilitiesService } from "./utilities.service";

/**
 * Helper around ng.ICacheObject
 * with some methods for
 * putting and removing values
 */
export interface ICacheHelper {
    /**
     * Get value for key
     *
     * @param key
     * @param defaultValue returned value if there is no cache with key
     */
    getValueForKey(key: string, defaultValue?: any): any;
    /**
     * Put valueToCache in cache with key
     *
     * @param key
     * @param valueToCache
     */
    setValueForKey(key: string, valueToCache: any): void;
    /**
     * Remove value from cache with key
     *
     * @param key
     */
    removeValueForKey(key: string): void;
    /**
     * Remove all values from cache
     */
    removeAllValues(): void;
}

export class CacheHelper implements ICacheHelper {
    private currentCache: ng.ICacheObject;

    constructor(currentCache: ng.ICacheObject) {
        this.currentCache = currentCache;
    }

    public getValueForKey(key: string, defaultValue?: any): any {
        const returnValue = this.currentCache.get(key);

        if (returnValue !== undefined)
            return returnValue;

        return defaultValue;
    }

    public setValueForKey(key: string, valueToCache: any): void {
        this.currentCache.put(key, valueToCache);
    }

    public removeValueForKey(key: string): void {
        this.currentCache.remove(key);
    }

    public removeAllValues(): void {
        this.currentCache.removeAll();
    }
}


/**
 * Helper to simplify the usage of
 * ng.ICacheObject. In particular,
 * there is a stack of urls (window history)
 * that gets continuously updated while
 * the user moves to different sections.
 *
 * Calling getCache, the service provides
 * a new CacheHelper or that already
 * created for the current url.
 *
 * When a url gets pulled out of the stack,
 * the related cache gets destroyed
 */
export interface ICacheHelperService {
    /**
     * Setup the service: this method has
     * to be called as soon as the service
     * gets created
     */
    start(): void;
    /**
     * Get the cache related to
     * the current url
     */
    getCache(): ICacheHelper;
    /**
     * Destroy the cache related
     * to a particular url
     *
     * @param url
     */
    resetCacheStack(url?: string): void;
    /**
     * Destroy all caches defined
     * through out this service
     */
    destroyAllCache(): void;
}

export class CacheHelperService implements ICacheHelperService {
    public static $inject = ["$rootScope", "$cacheFactory", "UtilitiesService"];

    private rootScope: ng.IRootScopeService;
    private cacheFactory: ng.ICacheFactoryService;
    private utilitiesService: IUtilitiesService;

    private cacheNames: string[];
    private urlStack: string[];
    private clearDefer: ng.IPromise<any>;

    constructor($rootScope: ng.IRootScopeService, $cacheFactory: ng.ICacheFactoryService, UtilitiesService: IUtilitiesService) {
        this.rootScope = $rootScope;
        this.cacheFactory = $cacheFactory;
        this.utilitiesService = UtilitiesService;

        this.cacheNames = [];
        this.urlStack = [];
    }

    public start(): void {
        this.rootScope.$on("$locationChangeStart", (event: ng.IAngularEvent, nextLocation: string, currentLocation: string) => {
            this.locationChangeStart(event, nextLocation, currentLocation);
        });
    }

    public getCache(): ICacheHelper {
        const currentPath = this.utilitiesService.getCurrentPath();

        let cache = this.cacheFactory.get(currentPath);
        if (cache === undefined) {
            cache = this.cacheFactory(currentPath);
        }

        if (this.cacheNames.indexOf(currentPath) === -1) {
            this.cacheNames.push(currentPath);
        }

        return (new CacheHelper(cache));
    }

    public resetCacheStack(url?: string): void {
        if (url && this.urlStack.length > 0 && this.urlStack[0] === this.utilitiesService.getPath(url)) {
            this.urlStack = [this.urlStack[0]];
        } else {
            this.urlStack = [];
        }
    }

    public destroyAllCache(): void {
        for (let i = 0; i < this.cacheNames.length; i++) {
            const cache = this.cacheFactory.get(this.cacheNames[i]);
            if (cache !== undefined) {
                cache.destroy();
            }
        }
        this.cacheNames = [];
        this.urlStack = [];
    }

    private deleteNotReferredCache(): void {
        const newCacheNameList = [];
        for (let i = 0; i < this.cacheNames.length; i++) {
            const cacheName = this.cacheNames[i];

            if (this.urlStack.indexOf(cacheName) === -1) {
                const cache = this.cacheFactory.get(cacheName);
                if (cache !== undefined) {
                    cache.destroy();
                }
            } else {
                newCacheNameList.push(cacheName);
            }
        }
        this.cacheNames = newCacheNameList;
    }

    private locationChangeStart(event: ng.IAngularEvent, nextLocation: string, currentLocation: string, newState?: string, oldState?: string): void {
        if (event.defaultPrevented === true) {
            return;
        }

        const path = this.utilitiesService.getPath(nextLocation);
        const index = this.urlStack.indexOf(path);

        if (this.urlStack.length > 0 && this.urlStack[this.urlStack.length - 1] === path) {
            return;
        }

        // remove urlStack references from index to urlStack.length
        if (index !== -1) {
            this.urlStack = this.urlStack.splice(0, index);
        }

        this.urlStack.push(path);
        this.clearDefer = this.utilitiesService.defer(() => {
            this.deleteNotReferredCache();
        }, 100, this);
    }
}
