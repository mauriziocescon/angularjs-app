import template from './app.component.html';

export class AppController {
  public static $inject = [];
  public name: string;

  constructor() {
    this.name = 'AppComponent';
  }
}

export const AppComponent: ng.IComponentOptions = {
  controller: AppController,
  template: () => {
    return template;
  },
};
