export class ModalAlertController {
    public static $inject = ["$uibModalInstance", "modalTitle", "modalMessage", "modalButtonLabel"];
    public name: string;

    private modalInstance: ng.ui.bootstrap.IModalServiceInstance;
    private modalTitle: string;
    private modalMessage: string;
    private modalButtonLabel: string;

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
