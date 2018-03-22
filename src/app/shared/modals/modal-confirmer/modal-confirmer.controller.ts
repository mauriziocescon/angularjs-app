export class ModalConfirmerController {
  public static $inject = ['$uibModalInstance', 'modalTitle', 'modalMessage', 'modalYesButtonLabel', 'modalNoButtonLabel'];
  public name: string;

  constructor(protected uibModalInstance: ng.ui.bootstrap.IModalInstanceService,
              protected modalTitle: string,
              protected modalMessage: string,
              protected modalYesButtonLabel: string,
              protected modalNoButtonLabel: string) {
    this.name = 'ModalConfirmerController';
  }

  public yes(): void {
    this.uibModalInstance.close();
  }

  public no(): void {
    this.uibModalInstance.dismiss();
  }
}
