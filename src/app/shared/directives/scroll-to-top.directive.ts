import { IScrollToService } from '../../app.module';
import { Logger } from '../shared.module';

/**
 * When the user starts scrolling and window.pageYOffset
 * gets larger than 100, the element is displayed. This
 * is binded with a click event that set
 * window.pageYOffset back to 0 (scroll up to the top).
 *
 * example: <div mc-scroll-to-top></div>
 */
export const mcScrollToTopDirective = ($window: ng.IWindowService, ScrollToService: IScrollToService) => {

  const onScroll = (element: JQLite, attrs: ng.IAttributes) => {

    const elementVisibility = attrs['element-visibility'];
    const shouldBeVisible = ScrollToService.getScrollPosition() > 100;

    if (shouldBeVisible === true && elementVisibility !== true) {
      element.css('visibility', 'visible');
      attrs['element-visibility'] = true;
    } else if (shouldBeVisible === false && elementVisibility !== false) {
      element.css('visibility', 'hidden');
      attrs['element-visibility'] = false;
    }
  };

  const directive: ng.IDirective = {};

  directive.priority = 0;
  directive.restrict = 'A';
  directive.link = (scope: ng.IScope, element: JQLite, attrs: ng.IAttributes) => {
    try {
      element.on('click', () => {
        ScrollToService.scrollTo(0);
      });

      const scrollFunc = (ev: UIEvent) => {
        onScroll(element, attrs);
      };

      $window.addEventListener('scroll', scrollFunc, false);
      onScroll(element, attrs);

      scope.$on('$destroy', (event: ng.IAngularEvent) => {
        element.off('click');
        $window.removeEventListener('scroll', scrollFunc, false);
      });
    } catch (e) {
      Logger.exception(scope, e);
    }
  };
  return directive;
};

mcScrollToTopDirective.$inject = ['$window', 'ScrollToService'];
