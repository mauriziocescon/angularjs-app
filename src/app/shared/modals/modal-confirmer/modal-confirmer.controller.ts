export class ModalConfirmerController {
	private modalInstance: ng.ui.bootstrap.IModalServiceInstance;
	private modalTitle: string;
	private modalMessage: string;
	private modalYesButtonLabel: string;
	private modalNoButtonLabel: string;

	public name: string;

	static $inject = ["$uibModalInstance", "modalTitle", "modalMessage", "modalYesButtonLabel", "modalNoButtonLabel"];

	constructor($uibModalInstance: ng.ui.bootstrap.IModalServiceInstance, modalTitle: string, modalMessage: string, modalYesButtonLabel: string, modalNoButtonLabel: string) {
		this.modalInstance = $uibModalInstance;
		this.modalTitle = modalTitle;
		this.modalMessage = modalMessage;
		this.modalYesButtonLabel = modalYesButtonLabel;
		this.modalNoButtonLabel = modalNoButtonLabel;

		this.name = "ModalConfirmerController";
	}

	public yes(): void {
		this.modalInstance.close();
	}

	public no(): void {
		this.modalInstance.dismiss();
	}
}