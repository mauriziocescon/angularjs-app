/* shared directives */
import * as angular from "angular";
import {mcCustomValidatorDirective} from "./custom-validator.directive";
import {mcFallbackImageUrlDirective} from "./fallback-image-name.directive";
import {mcFocusIfDirective} from "./focus-if.directive";
import {mcLocalizedStringDirective} from "./localized-string.directive";
import {mcOnMouseWheelDirective} from "./on-mouse-wheel.directive";
import {mcOnScrollDirective} from "./on-scroll.directive";
import {mcScrollToTopDirective} from "./scroll-to-top.directive";
import {mcToggleDirective} from "./toggle.directive";

// shared directives
export const mcDirectives = angular.module("shared.mcDirectives", [])
	.directive("mcCustomValidator", mcCustomValidatorDirective)
	.directive("mcFallbackImageUrl", mcFallbackImageUrlDirective)
	.directive("mcFocusIf", mcFocusIfDirective)
	.directive("mcLocalizedString", mcLocalizedStringDirective)
	.directive("mcOnMouseWheel", mcOnMouseWheelDirective)
	.directive("mcOnScroll", mcOnScrollDirective)
	.directive("mcScrollToTop", mcScrollToTopDirective)
	.directive("mcToggle", mcToggleDirective)
	.name;