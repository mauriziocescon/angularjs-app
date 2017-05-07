export const appConfigFunc = (tmhDynamicLocaleProvider: ng.dynamicLocale.tmhDynamicLocaleProvider,
                              cfpLoadingBarProvider: ng.loadingBar.ILoadingBarProvider) => {
    tmhDynamicLocaleProvider.localeLocationPattern("lib/angular-locale_{{locale}}.js");
    cfpLoadingBarProvider.includeSpinner = false;
};

appConfigFunc.$inject = ["tmhDynamicLocaleProvider", "cfpLoadingBarProvider"];
