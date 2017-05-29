export class ModalAlertController {
    public static $inject = ["$uibModalInstance", "modalTitle", "modalMessage", "modalButtonLabel"];
    public name: string;

    protected modalInstance: ng.ui.bootstrap.IModalInstanceService;
    protected modalTitle: string;
    protected modalMessage: string;
    protected modalButtonLabel: string;

    constructor($uibModalInstance: ng.ui.bootstrap.IModalInstanceService, modalTitle: string, modalMessage: string, modalButtonLabel: string) {
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
