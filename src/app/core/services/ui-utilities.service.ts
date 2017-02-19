import {IUIUtilitiesConstants, uiUtilitiesConstants} from "./ui-utilities.constants";
import {IAppConstantsService} from "./app-constants.service";
import {IUtilitiesService} from "./utilities.service";
import {Logger} from "../../shared/shared.module";

/**
 * UI Utilities
 */
export interface IUIUtilitiesService {
	/**
	 * Get the currency symbol
	 * from the ISO code
	 *
	 * @param currency
	 */
	getCurrencySymbol(currency: string): string;

	/**
	 * Display a modal alert
	 *
	 * @param title title of modal
	 * @param message body of the modal
	 * @param buttonLabel label of the button
	 */
	modalAlert(title: string, message: string, buttonLabel: string): void;
	/**
	 * Display a confirm alert
	 *
	 * @param title title of modal
	 * @param message body of the modal
	 * @param yesButtonLabel label of the affermative button
	 * @param noButtonLabel label of the negative button
	 * @param callback function executed when the user click on a button with the result
	 */
	modalConfirmer(title: string, message: string, yesButtonLabel: string, noButtonLabel: string, callback: (result: boolean) => void): void;
}

export class UIUtilitiesService implements IUIUtilitiesService {
	private uibModal: ng.ui.bootstrap.IModalService;
	private appConstantsService: IAppConstantsService;
	private utilitiesService: IUtilitiesService;
	private uiUtilitiesConstants: IUIUtilitiesConstants;

	static $inject = ["$uibModal", "AppConstantsService", "UtilitiesService", "UIUtilitiesConstants"];

	constructor($uibModal: ng.ui.bootstrap.IModalService,
				AppConstantsService: IAppConstantsService,
				UtilitiesService: IUtilitiesService,
				UIUtilitiesConstants: IUIUtilitiesConstants) {
		this.uibModal = $uibModal;
		this.appConstantsService = AppConstantsService;
		this.utilitiesService = UtilitiesService;
		this.uiUtilitiesConstants = UIUtilitiesConstants;
	}

	public getCurrencySymbol(currency: string): string {
		switch (currency) {
			case this.uiUtilitiesConstants.CurrencyCode.USD.toString(): {
				return this.uiUtilitiesConstants.CurrencyChar.USS.toString();
			}
			case this.uiUtilitiesConstants.CurrencyCode.GBP.toString(): {
				return this.uiUtilitiesConstants.CurrencyChar.GBP.toString();
			}
			case this.uiUtilitiesConstants.CurrencyCode.EUR.toString(): {
				return this.uiUtilitiesConstants.CurrencyChar.EUR.toString();
			}
			default: {
				return currency.toString();
			}
		}
	}

	public modalAlert(title: string, message: string, buttonLabel: string): void {
		try {
			const modalSettings: ng.ui.bootstrap.IModalSettings = {};
			modalSettings.templateUrl = "modal-alert.template.html";
			modalSettings.controller = "ModalAlertController";
			modalSettings.controllerAs = "$ctrl";
			modalSettings.size = "xs";
			modalSettings.resolve = {
				modalTitle: () => {
					return title;
				}, modalMessage: () => {
					return message;
				}, modalButtonLabel: () => {
					return buttonLabel;
				}
			};

			this.uibModal.open(modalSettings);
		} catch (e) {
			Logger.exception(this, e);
		}
	}

	public modalConfirmer(title: string, message: string, yesButtonLabel: string, noButtonLabel: string, callback: (result: boolean) => void): void {
		try {
			const modalSettings: ng.ui.bootstrap.IModalSettings = {};
			modalSettings.templateUrl = "modal-confirmer.template.html";
			modalSettings.controller = "ModalConfirmerController";
			modalSettings.controllerAs = "$ctrl";
			modalSettings.size = "xs";
			modalSettings.resolve = {
				modalTitle: () => {
					return title;
				}, modalMessage: () => {
					return message;
				}, modalYesButtonLabel: () => {
					return yesButtonLabel;
				}, modalNoButtonLabel: () => {
					return noButtonLabel;
				}
			};

			const modalInstance: ng.ui.bootstrap.IModalServiceInstance = this.uibModal.open(modalSettings);
			modalInstance.result.then(() => {
				callback(true);
			}, () => {
				callback(false);
			});
		} catch (e) {
			Logger.exception(this, e);
		}
	}
}