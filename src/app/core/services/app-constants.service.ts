import * as Constants from "./app-constants.model";

/**
 * Get application constants
 * saved in app-constants.model
 * grouped by field
 */
export interface IAppConstantsService {
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
	private window: ng.IWindowService;

	protected application: Constants.Application;
	protected languages: Constants.Languages;
	protected localStorageKey: Constants.LocalStorageKey;
	protected validator: Constants.Validator;

	static $inject = ["$window"];

	constructor($window: ng.IWindowService) {
		this.window = $window;

		this.application = new Constants.Application();
		this.languages = new Constants.Languages();
		this.localStorageKey = new Constants.LocalStorageKey();
		this.validator = new Constants.Validator();
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