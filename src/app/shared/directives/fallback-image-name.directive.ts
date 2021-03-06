import { Logger } from '../shared.module';

/**
 * Insert an image as fallback in case of error
 *
 * example: <img mc-fallback-image-url="url"/>
 */
export const mcFallbackImageUrlDirective = () => {

  const directive: ng.IDirective = {};

  directive.priority = 0;
  directive.restrict = 'A';
  directive.link = (scope: ng.IScope, element: JQLite, attrs: ng.IAttributes) => {
    try {
      const mcFallbackImageUrl = 'mcFallbackImageUrl';
      const fallbackImageUrl = scope.$eval(attrs[mcFallbackImageUrl]);

      element.on('error', () => {
        element.attr('src', fallbackImageUrl);
      });

      scope.$on('$destroy', (event: ng.IAngularEvent) => {
        element.off('error');
      });
    } catch (e) {
      Logger.exception(scope, e);
    }
  };
  return directive;
};
