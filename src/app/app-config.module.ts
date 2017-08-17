export const appConfigFunc = ($translateProvider: ng.translate.ITranslateProvider,
                              tmhDynamicLocaleProvider: ng.dynamicLocale.tmhDynamicLocaleProvider,
                              cfpLoadingBarProvider: ng.loadingBar.ILoadingBarProvider) => {
    $translateProvider.useStaticFilesLoader({
        prefix: "i18n/",
        suffix: ".json",
    });
    $translateProvider.preferredLanguage("en");
    tmhDynamicLocaleProvider.localeLocationPattern("locales/angular-locale_{{locale}}.js");
    cfpLoadingBarProvider.includeSpinner = false;
};

appConfigFunc.$inject = ["$translateProvider", "tmhDynamicLocaleProvider", "cfpLoadingBarProvider"];
