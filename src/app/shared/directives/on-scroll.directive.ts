import {Logger} from "../shared.module";
import {IUtilitiesService} from "../../app.module";

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

            element.bind("scroll", (eventObject: JQueryEventObject) => {
                const callback: Function = scope.$eval(attrs["mcOnScroll"]);
                UtilitiesService.call(callback, scope, raw.scrollLeft, raw.scrollTop);
            });

            scope.$on("$destroy", (event: ng.IAngularEvent) => {
                element.unbind("scroll");
            });
        } catch (e) {
            Logger.exception(scope, e);
        }
    };
    return directive;
};

mcOnScrollDirective.$inject = ["UtilitiesService"];
