export class ModalAlertController {
	private modalInstance: ng.ui.bootstrap.IModalServiceInstance;
	private modalTitle: string;
	private modalMessage: string;
	private modalButtonLabel: string;

	public name: string;

	static $inject = ["$uibModalInstance", "modalTitle", "modalMessage", "modalButtonLabel"];

	constructor($uibModalInstance: ng.ui.bootstrap.IModalServiceInstance, modalTitle: string, modalMessage: string, modalButtonLabel: string) {
		this.modalInstance = $uibModalInstance;
		this.modalTitle = modalTitle;
		this.modalMessage = modalMessage;
		this.modalButtonLabel = modalButtonLabel;

		this.name = "ModalAlertController";
	}

	public close(): void {
		this.modalInstance.dismiss();
	}
}