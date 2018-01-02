import * as Constants from "./app-constants.model";

/**
 * Get application constants
 * saved in app-constants.model
 * grouped by field
 */
export interface IAppConstantsService {
    /**
     * Api
     */
    Api: Constants.Api;
    /**
     * Application
     */
    Application: Constants.Application;
    /**
     * Supported languages
     */
    Languages: Constants.Languages;
    /**
     * Local storage keys
     */
    LocalStorageKey: Constants.LocalStorageKey;
    /**
     * RegExp
     */
    Validator: Constants.Validator;
}

export class AppConstantsService {
    public static $inject = ["$window"];

    protected api: Constants.Api;
    protected application: Constants.Application;
    protected languages: Constants.Languages;
    protected localStorageKey: Constants.LocalStorageKey;
    protected validator: Constants.Validator;

    constructor(protected window: ng.IWindowService) {
        this.api = new Constants.Api();
        this.application = new Constants.Application();
        this.languages = new Constants.Languages();
        this.localStorageKey = new Constants.LocalStorageKey();
        this.validator = new Constants.Validator();
    }

    public get Api(): Constants.Api {
        return this.api;
    }

    public get Application(): Constants.Application {
        return this.application;
    }

    public get Languages(): Constants.Languages {
        return this.languages;
    }

    public get LocalStorageKey(): Constants.LocalStorageKey {
        return this.localStorageKey;
    }

    public get Validator(): Constants.Validator {
        return this.validator;
    }
}
