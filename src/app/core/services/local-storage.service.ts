import { Enum, Logger } from "../../shared/shared.module";

import { IAppConstantsService } from "./app-constants.service";

/**
 * Manage data in
 * local storage for the
 * application
 */
export interface ILocalStorageService {
    /**
     * Get data for key
     *
     * @param key
     */
    getData<T>(key: Enum): T | undefined;

    /**
     * Set fata for key
     *
     * @param key
     * @param data
     */
    setData(key: Enum, data: any): void;

    /**
     * Remove data for key
     *
     * @param key
     */
    removeData(key: Enum): void;

    /**
     * Remove all data related to
     * the application in local storage
     */
    removeAllData(): void;
}

export class LocalStorageService implements ILocalStorageService {
    public static $inject = ["AppConstantsService"];

    protected prefix: string;

    constructor(protected appConstantsService: IAppConstantsService) {
        this.prefix = this.appConstantsService.Application.APP_NAME;
    }

    public getData<T>(key: Enum): T | undefined {
        try {
            const result = localStorage.getItem(this.prefix + "_" + key.toString());
            return result !== null ? JSON.parse(result) : undefined;
        } catch (e) {
            Logger.warn(e);
            return undefined;
        }
    }

    public setData(key: Enum, data: any): void {
        try {
            if (data === undefined) {
                localStorage.removeItem(this.prefix + "_" + key.toString());
            } else {
                const result = JSON.stringify(data);
                localStorage.setItem(this.prefix + "_" + key.toString(), result);
            }
        } catch (e) {
            Logger.warn(e);
        }
    }

    public removeData(key: Enum): void {
        try {
            localStorage.removeItem(this.prefix + "_" + key.toString());
        } catch (e) {
            Logger.warn(e);
        }
    }

    public removeAllData(): void {
        try {
            for (const key in localStorage) {
                if (key.startsWith(this.prefix + "_")) {
                    localStorage.removeItem(key);
                }
            }
        } catch (e) {
            Logger.warn(e);
        }
    }
}
