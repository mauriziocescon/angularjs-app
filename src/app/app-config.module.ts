import { IAppLanguageService } from "./core/core.module";

export const appConfigFunc = ($translateProvider: ng.translate.ITranslateProvider,
                              tmhDynamicLocaleProvider: ng.dynamicLocale.tmhDynamicLocaleProvider,
                              cfpLoadingBarProvider: ng.loadingBar.ILoadingBarProvider) => {
    $translateProvider.useStaticFilesLoader({
        prefix: "i18n/",
        suffix: ".json",
    });
    tmhDynamicLocaleProvider.localeLocationPattern("lib/angular-locale_{{locale}}.js");
    cfpLoadingBarProvider.includeSpinner = false;
};

appConfigFunc.$inject = ["$translateProvider", "tmhDynamicLocaleProvider", "cfpLoadingBarProvider"];
