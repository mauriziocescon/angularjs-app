import * as $ from "jquery";

import { ILocalizedStringService } from "../../app.module";
import { Logger } from "../shared.module";

/**
 * Replace the mc-localized-string element with
 * the value in the multilanguage
 * resource file (check LocalizedStringService)
 * based on the current language
 *
 * example: <mc-localized-string key="KEY"></mc-localized-string>
 */
export const mcLocalizedStringDirective = (LocalizedStringService: ILocalizedStringService) => {

    const directive: ng.IDirective = {};

    directive.priority = 0;
    directive.restrict = "E";
    directive.link = (scope: ng.IScope, element: JQuery, attrs: ng.IAttributes) => {
        try {
            const key = "key";

            if (attrs[key] !== undefined && $(element).parent() !== undefined) {
                $(element).replaceWith(LocalizedStringService.getLocalizedString(attrs[key]));
            }

        } catch (e) {
            Logger.exception(scope, e);
        }
    };
    return directive;
};

mcLocalizedStringDirective.$inject = ["LocalizedStringService"];
