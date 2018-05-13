import { Logger } from '../shared.module';

/**
 * Set focus to the element when the condition "mc-focus-if" is true
 *
 * example: <div mc-focus-if="functionToEvaluate()"></div>
 */
export const mcFocusIfDirective = ($timeout: ng.ITimeoutService) => {

  const directive: ng.IDirective = {};

  directive.priority = 0;
  directive.restrict = 'A';
  directive.link = (scope: ng.IScope, element: JQLite, attrs: ng.IAttributes) => {
    try {
      const mcFocusIf = 'mcFocusIf';

      const clearWatcher = scope.$watch(() => {
        return scope.$eval(attrs[mcFocusIf]);
      }, (newValue, oldValue) => {
        if (newValue !== oldValue && newValue === true) {
          $timeout(() => {
            element[0].focus();
          }, 200);
        }
      });

      if (scope.$eval(attrs[mcFocusIf]) === true) {
        $timeout(() => {
          element[0].focus();
        }, 200);
      }

      scope.$on('$destroy', (event: ng.IAngularEvent) => {
        if (clearWatcher) {
          clearWatcher();
        }
      });
    } catch (e) {
      Logger.exception(scope, e);
    }
  };
  return directive;
};

mcFocusIfDirective.$inject = ['$timeout'];
