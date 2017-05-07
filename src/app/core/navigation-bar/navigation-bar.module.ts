import * as angular from "angular";
import { NavigationBarService } from "./navigation-bar.service";
import { NavigationBarComponent } from "./navigation-bar.component";

export * from "./navigation-bar.service";

export const navigationBar = angular.module("core.navigationBar", [])
    .service("NavigationBarService", NavigationBarService)
    .component("navigationBar", NavigationBarComponent)
    .name;
