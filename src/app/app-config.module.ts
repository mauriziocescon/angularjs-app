export const appConfigFunc = ($httpProvider: ng.IHttpProvider,
                              $translateProvider: ng.translate.ITranslateProvider,
                              tmhDynamicLocaleProvider: ng.dynamicLocale.tmhDynamicLocaleProvider,
                              cfpLoadingBarProvider: ng.loadingBar.ILoadingBarProvider) => {
    $httpProvider.defaults.headers = {
        common: {
            "Content-Type": "application/json",
        },
    };
    $translateProvider.useMissingTranslationHandlerLog();
    $translateProvider.useStaticFilesLoader({
        prefix: "assets/i18n/",
        suffix: ".json",
    });
    $translateProvider.preferredLanguage("en");
    tmhDynamicLocaleProvider.localeLocationPattern("locales/angular-locale_{{locale}}.js");
    cfpLoadingBarProvider.includeSpinner = false;
};

appConfigFunc.$inject = ["$httpProvider", "$translateProvider", "tmhDynamicLocaleProvider", "cfpLoadingBarProvider"];
