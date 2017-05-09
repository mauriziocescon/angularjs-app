import * as angular from "angular";

import { NavigationBarComponent } from "./navigation-bar.component";
import { NavigationBarService } from "./navigation-bar.service";

export * from "./navigation-bar.service";

export const navigationBar = angular.module("core.navigationBar", [])
    .service("NavigationBarService", NavigationBarService)
    .component("navigationBar", NavigationBarComponent)
    .name;
