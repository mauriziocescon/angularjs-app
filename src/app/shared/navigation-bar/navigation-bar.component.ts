import * as ng from 'angular';

import template from './navigation-bar.component.html';

import {
  IAppConstantsService,
  IAppLanguageService,
  INavigationBarService,
  IUtilitiesService,
} from '../../core/services/services.module';

export class NavigationBarController {
  public static $inject = ['$location', '$translate', '$window', 'AppConstantsService', 'AppLanguageService', 'NavigationBarService', 'UtilitiesService'];
  public name: string;
  public selectedLanguageId!: string;
  public isNavCollapsed!: boolean;
  public languageDropdown!: boolean;

  protected languages!: string[];

  constructor(protected location: ng.ILocationService,
              protected translate: ng.translate.ITranslateService,
              protected window: ng.IWindowService,
              protected appConstantsService: IAppConstantsService,
              protected appLanguageService: IAppLanguageService,
              protected navigationBarService: INavigationBarService,
              protected utilitiesService: IUtilitiesService) {
    this.name = 'NavigationBarComponent';
  }

  get canShowAnalysis(): boolean {
    return this.appConstantsService.Application.SHOW_ANALYSIS === true;
  }

  get canOpenJsonServer(): boolean {
    return this.appConstantsService.Application.SHOW_JSON_SERVER_API === true;
  }

  get analysis(): string {
    return '<pre>' + this.utilitiesService.analyzeWebApp() + '</pre>';
  }

  get pageDesc(): string {
    return this.navigationBarService.getTitle();
  }

  public $onInit(): void {
    this.selectedLanguageId = this.appLanguageService.getLanguageId();
    this.languages = this.appLanguageService.getSupportedLanguagesList();
    this.isNavCollapsed = true;
    this.languageDropdown = false;
  }

  public $onDestroy(): void {
    // do nothing
  }

  public goToAlbums(): void {
    this.location.path('/albums');
  }

  public goToUsers(): void {
    this.location.path('/users');
  }

  public selectLanguage(language: string): void {
    if (this.appLanguageService.getLanguageId() !== language) {
      this.selectedLanguageId = language;
      this.appLanguageService.setLanguageId(this.selectedLanguageId);
    }
  }

  public openJsonServer(): void {
    this.window.open(this.appConstantsService.Application.JSON_SERVER_API_URL);
  }
}

export const NavigationBarComponent: ng.IComponentOptions = {
  bindings: {},
  controller: NavigationBarController,
  template: () => {
    return template;
  },
};
