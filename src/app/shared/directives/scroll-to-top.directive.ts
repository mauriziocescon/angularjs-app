import * as $ from "jquery";
import { Logger } from "../shared.module";
import { IScrollToService } from "../../app.module";

/**
 * When the user starts scrolling and window.pageYOffset
 * gets larger than 100, the element is displayed. This
 * is binded with a click event that set
 * window.pageYOffset back to 0 (scroll up to the top).
 *
 * example: <div mc-scroll-to-top></div>
 */
export const mcScrollToTopDirective = ($window: ng.IWindowService, ScrollToService: IScrollToService) => {

    const onScroll = (element: JQuery, attrs: ng.IAttributes) => {

        const elementVisibility = attrs["element-visibility"];
        const shouldBeVisible = ScrollToService.getScrollPosition() > 100;

        if (shouldBeVisible === true && elementVisibility !== true) {
            $(element).show();
            attrs["element-visibility"] = true;
        } else if (shouldBeVisible === false && elementVisibility !== false) {
            $(element).hide();
            attrs["element-visibility"] = false;
        }
    };

    const directive: ng.IDirective = {};

    directive.priority = 0;
    directive.restrict = "A";
    directive.link = (scope: ng.IScope, element: JQuery, attrs: ng.IAttributes) => {
        try {
            $(element).click(() => {
                ScrollToService.scrollTo(0);
            });

            const scrollFunc = (ev: UIEvent) => {
                onScroll(element, attrs);
            };

            $window.addEventListener("scroll", scrollFunc, false);
            onScroll(element, attrs);

            scope.$on("$destroy", (event: ng.IAngularEvent) => {
                $(element).unbind("click");
                $window.removeEventListener("scroll", scrollFunc, false);
            });
        } catch (e) {
            Logger.exception(scope, e);
        }
    };
    return directive;
};

mcScrollToTopDirective.$inject = ["$window", "ScrollToService"];
