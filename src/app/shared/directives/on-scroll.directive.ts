import { IUtilitiesService } from "../../app.module";
import { Logger } from "../shared.module";

/**
 * Invoke a function when scroll event fires on the element
 *
 * example: <div mc-on-scroll="functionToCall(scrollLeft,scrollTop)"></div>
 */
export const mcOnScrollDirective = (UtilitiesService: IUtilitiesService) => {

    const directive: ng.IDirective = {};

    directive.priority = 0;
    directive.restrict = "A";
    directive.link = (scope: ng.IScope, element: JQuery, attrs: ng.IAttributes) => {
        try {
            const raw = element[0];

            element.on("scroll", (eventObject: JQueryEventObject) => {
                const mcOnScroll = "mcOnScroll";
                const callback: () => void = scope.$eval(attrs[mcOnScroll]);
                UtilitiesService.call(callback, scope, raw.scrollLeft, raw.scrollTop);
            });

            scope.$on("$destroy", (event: ng.IAngularEvent) => {
                element.off("scroll");
            });
        } catch (e) {
            Logger.exception(scope, e);
        }
    };
    return directive;
};

mcOnScrollDirective.$inject = ["UtilitiesService"];
