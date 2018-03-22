import * as angular from 'angular';

import { app } from './app/app.module';

class Main {

  public static appReady(): void {
    Main.loadAngular();
  }

  protected static loadAngular(): void {
    const config: ng.IAngularBootstrapConfig = { strictDi: true };
    const element = document.querySelector(app);

    if (element) {
      angular.bootstrap(element, [app], config);
    }
  }
}

document.addEventListener('DOMContentLoaded', Main.appReady.bind(Main));
