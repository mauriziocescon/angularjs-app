import * as angular from "angular";

import { NavigationBarComponent } from "./navigation-bar.component";

export const navigationBar = angular.module("core.navigationBar", [])
    .component("navigationBar", NavigationBarComponent)
    .name;
