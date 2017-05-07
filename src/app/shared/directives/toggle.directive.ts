import * as $ from "jquery";
import {Logger} from "../shared.module";

/**
 * At the click event, mc-toggle is evaluated and
 * - on or off function is called,
 * - on or off class is added to the element (the other one is removed),
 * - all elements selected by toggle-on-selector having class on
 * are switched to off (except the clicked one).
 *
 * With keep-watching="true", a watcher i set to
 * the mc-toggle function.
 * If the toggle is fired by the user click, the event
 * is passed to on / off functions.
 *
 * example: <div mc-toggle="function()==true" on="fuction($event)" off="function($event)" toggle-on-selector="check" keep-watching="true"></div>
 */
export const mcToggleDirective = () => {

    const getState = (scope: ng.IScope, attrs: ng.IAttributes) => {
        return scope.$eval(attrs["mcToggle"]) == true;
    };

    const execute = (scope: ng.IScope, element: JQuery, attrs: ng.IAttributes, state: boolean, eventObject?: JQueryEventObject) => {
        setClass(scope, element, attrs, state);
        callStateFunction(scope, element, attrs, state, eventObject);
    };

    let setClass = (scope: ng.IScope, element: JQuery, attrs: ng.IAttributes, state: boolean) => {

        if (state == true) {
            $(element).addClass("on");
            $(element).removeClass("off");
        } else {
            $(element).addClass("off");
            $(element).removeClass("on");
        }

        if (attrs["toggleOnSelector"]) {
            let selector = [attrs["toggleOnSelector"], ".on"].join(",");
            let elements = $(selector).not(element);
            elements.removeClass("on");
            elements.addClass("off");
        }
    };

    let callStateFunction = (scope: ng.IScope, element: JQuery, attrs: ng.IAttributes, state: boolean, eventObject: JQueryEventObject) => {

        if (state == true) {
            if (attrs["on"] != undefined) {
                scope.$apply(() => {
                    scope.$eval(attrs["on"], {$event: eventObject});
                });
            }
        } else {
            if (attrs["off"] != undefined) {
                scope.$apply(() => {
                    scope.$eval(attrs["off"], {$event: eventObject});
                });
            }
        }
    };

    const directive: ng.IDirective = {};

    directive.priority = 0;
    directive.restrict = "A";
    directive.link = (scope: ng.IScope, element: JQuery, attrs: ng.IAttributes) => {
        try {
            const keepWatching = scope.$eval(attrs["keepWatching"]) == true;
            setClass(scope, element, attrs, getState(scope, attrs));
            let clearWatcher;

            if (keepWatching) {
                clearWatcher = scope.$watch(() => {
                    return getState(scope, attrs);
                }, (newvalue: boolean, oldvalue: boolean) => {
                    if (newvalue != oldvalue)
                        execute(scope, element, attrs, newvalue);
                });
            }

            $(element).click((eventObject: JQueryEventObject) => {
                execute(scope, element, attrs, getState(scope, attrs) != true, eventObject);
            });

            scope.$on("$destroy", (event: ng.IAngularEvent) => {
                if (clearWatcher)
                    clearWatcher();

                $(element).unbind("click");
            });
        } catch (e) {
            Logger.exception(scope, e);
        }
    };
    return directive;
};
