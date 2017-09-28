import * as $ from "jquery";
import { Logger } from "../shared.module";

/**
 * At the click event, mc-toggle is evaluated and
 * - on or off function is called,
 * - on or off class is added to the element (the other one is removed),
 * - on or off class is added to the sub-elements with selector toggle-on-selector
 *
 * With keep-watching="true", a watcher is set to
 * mc-toggle function.
 * If the toggle is fired by the user click, the event
 * is passed to on / off functions.
 *
 * example: <div mc-toggle="function()==true" on="fuction($event)" off="function($event)" toggle-on-selector="check" keep-watching="true"></div>
 */
export const mcToggleDirective = () => {

    const getState = (scope: ng.IScope, attrs: ng.IAttributes) => {
        const mcToggle = "mcToggle";
        return scope.$eval(attrs[mcToggle]) === true;
    };

    const execute = (scope: ng.IScope, element: JQuery, attrs: ng.IAttributes, state: boolean, eventObject?: JQueryEventObject) => {
        setClass(scope, element, attrs, state);
        callStateFunction(scope, element, attrs, state, eventObject);
    };

    const setClass = (scope: ng.IScope, element: JQuery, attrs: ng.IAttributes, state: boolean) => {
        const toggleOnSelector = "toggleOnSelector";

        if (state === true) {
            $(element).removeClass("off");
            $(element).addClass("on");

            if (attrs[toggleOnSelector]) {
                const subElement = element.find(attrs[toggleOnSelector]);
                const selector = [attrs[toggleOnSelector], ".on"].join(",");

                // remove on and add off everywhere
                const elements = $(selector).not(subElement);
                elements.removeClass("on");
                elements.addClass("off");

                // add on for childrens of element
                subElement.removeClass("off");
                subElement.addClass("on");
            }
        } else {
            $(element).removeClass("on");
            $(element).addClass("off");

            if (attrs[toggleOnSelector]) {
                const subElement = element.find(attrs[toggleOnSelector]);

                // remove on and add off
                subElement.removeClass("on");
                subElement.addClass("off");
            }
        }
    };

    const callStateFunction = (scope: ng.IScope, element: JQuery, attrs: ng.IAttributes, state: boolean, eventObject?: JQueryEventObject) => {
        const on = "on";
        const off = "off";

        if (state === true) {
            if (attrs[on] !== undefined) {
                scope.$apply(() => {
                    scope.$eval(attrs[on], {$event: eventObject});
                });
            }
        } else {
            if (attrs[off] !== undefined) {
                scope.$apply(() => {
                    scope.$eval(attrs[off], {$event: eventObject});
                });
            }
        }
    };

    const directive: ng.IDirective = {};

    directive.priority = 0;
    directive.restrict = "A";
    directive.link = (scope: ng.IScope, element: JQuery, attrs: ng.IAttributes) => {
        try {
            const keepWatching = "keepWatching";
            const keepWatchingAttrs = scope.$eval(attrs[keepWatching]) === true;
            setClass(scope, element, attrs, getState(scope, attrs));
            let clearWatcher: () => void | undefined;

            if (keepWatchingAttrs) {
                clearWatcher = scope.$watch(() => {
                    return getState(scope, attrs);
                }, (newvalue: boolean, oldvalue: boolean) => {
                    if (newvalue !== oldvalue) {
                        execute(scope, element, attrs, newvalue);
                    }
                });
            }

            $(element).on("click", (eventObject: JQueryEventObject) => {
                execute(scope, element, attrs, getState(scope, attrs) !== true, eventObject);
            });

            scope.$on("$destroy", (event: ng.IAngularEvent) => {
                if (clearWatcher) {
                    clearWatcher();
                }

                $(element).off("click");
            });
        } catch (e) {
            Logger.exception(scope, e);
        }
    };
    return directive;
};
