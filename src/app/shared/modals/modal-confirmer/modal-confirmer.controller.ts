export class ModalConfirmerController {
    public  static $inject = ["$uibModalInstance", "modalTitle", "modalMessage", "modalYesButtonLabel", "modalNoButtonLabel"];
    public name: string;

    protected modalInstance: ng.ui.bootstrap.IModalServiceInstance;
    protected modalTitle: string;
    protected modalMessage: string;
    protected modalYesButtonLabel: string;
    protected modalNoButtonLabel: string;

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
