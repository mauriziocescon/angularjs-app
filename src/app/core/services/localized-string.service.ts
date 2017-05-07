import { IAppLanguageService } from "./app-language.service";
import { IUtilitiesService } from "./utilities.service";
import { LOCALIZED_STRINGS_OBJECT } from "./localized-string.model";

/**
 * Retrieves the value from the
 * multilanguage resource file stored
 * in localized-string.model
 */
export interface ILocalizedStringService {
    /**
     * Setup the service: this method has
     * to be called as soon as the service
     * gets created
     */
    start(): void;
    /**
     * return the value from the
     * @param key: value identifier
     */
    getLocalizedString(key: string, ...args: Array<string | number>): string;
}

export class LocalizedStringService implements ILocalizedStringService {
    public static $inject = ["AppLanguageService", "UtilitiesService"];

    private appLanguageService: IAppLanguageService;
    private utilitiesService: IUtilitiesService;

    private specificDictionary: any;
    private defaultDictionary: any;

    constructor(AppLanguageService: IAppLanguageService,
                UtilitiesService: IUtilitiesService) {
        this.appLanguageService = AppLanguageService;
        this.utilitiesService = UtilitiesService;
    }

    public start(): void {
        this.defaultDictionary = LOCALIZED_STRINGS_OBJECT[this.appLanguageService.getDefaultLanguageId()];
        this.specificDictionary = LOCALIZED_STRINGS_OBJECT[this.appLanguageService.getLanguageId()];
    }

    public getLocalizedString(key: string, ...args: Array<string | number>): string {
        if (this.utilitiesService.isDefinedAndNotEmpty(key) === false || key === "") {
            return "##";
        }

        let result: string;

        if (this.specificDictionary !== undefined) {
            result = this.specificDictionary[key];
        }

        if (result === undefined && this.defaultDictionary !== undefined) {
            result = this.defaultDictionary[key];
        }

        if (result === undefined) {
            result = "#" + key + "#";
        }

        return this.utilitiesService.formatString(result, ...args);
    }
}
