export class ModalAlertController {
  public static $inject = ['$uibModalInstance', 'modalTitle', 'modalMessage', 'modalButtonLabel'];
  public name: string;

  constructor(protected uibModalInstance: ng.ui.bootstrap.IModalInstanceService,
              protected modalTitle: string,
              protected modalMessage: string,
              protected modalButtonLabel: string) {
    this.name = 'ModalAlertController';
  }

  public close(): void {
    this.uibModalInstance.dismiss();
  }
}
