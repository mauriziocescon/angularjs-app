import {Logger} from "../shared.module";

/**
 * Call $setValidity on the ngModel based on
 * mcCustomValidator attribute (function or variable).
 * For more information, check
 * {@link https://docs.angularjs.org/api/ng/type/ngModel.NgModelController}
 *
 * example: <input type="text" ng-model="name" mc-custom-validator="validatorFunction()"/>
 */
export const mcCustomValidatorDirective = () => {

    const setValidity = (scope: ng.IScope, attrs: ng.IAttributes, ngModel: ng.INgModelController) => {
        ngModel.$setValidity("mcCustomValidatorError", scope.$eval(attrs["mcCustomValidator"]) == true);
    };

    const directive: ng.IDirective = {};

    directive.priority = 0;
    directive.restrict = "A";
    directive.require = "^ngModel";
    directive.link = (scope: ng.IScope, element: JQuery, attrs: ng.IAttributes, ngModel: ng.INgModelController) => {
        try {
            const clearWatcher = scope.$watch(() => {
                setValidity(scope, attrs, ngModel);
            });
            setValidity(scope, attrs, ngModel);

            scope.$on("$destroy", (event: ng.IAngularEvent) => {
                if (clearWatcher)
                    clearWatcher();
            });
        } catch (e) {
            Logger.exception(scope, e);
        }
    };
    return directive;
};
