import * as $ from "jquery";
import { Logger } from "../shared.module";

/**
 * Insert an image as fallback in case of error
 *
 * example: <img mc-fallback-image-url="url"/>
 */
export const mcFallbackImageUrlDirective = () => {

    const directive: ng.IDirective = {};

    directive.priority = 0;
    directive.restrict = "A";
    directive.link = (scope: ng.IScope, element: JQuery, attrs: ng.IAttributes) => {
        try {
            const mcFallbackImageUrl = "mcFallbackImageUrl";
            const fallbackImageUrl = scope.$eval(attrs[mcFallbackImageUrl]);

            $(element).bind("error", () => {
                $(element).attr("src", fallbackImageUrl);
            });

            scope.$on("$destroy", (event: ng.IAngularEvent) => {
                $(element).unbind("error");
            });
        } catch (e) {
            Logger.exception(scope, e);
        }
    };
    return directive;
};
