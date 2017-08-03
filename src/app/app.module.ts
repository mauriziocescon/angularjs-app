import * as angular from "angular";
import { angularStats } from "angular-stats";

import { core } from "./core/core.module";
import { shared } from "./shared/shared.module";

import { albums } from "./albums/albums.module";
import { users } from "./users/users.module";

import { appConfigFunc } from "./app-config.module";
import { routingConfigFunc } from "./app-routing.module";
import { runFunc } from "./app-run.module";

import { AppComponent } from "./app.component";

export * from "./core/core.module";

const appModule = angular.module("app", [
    "angular-loading-bar",
    angularStats,
    "app-templates",
    "infinite-scroll",
    "ngAnimate",
    "ngSanitize",
    "ngTouch",
    "pascalprecht.translate",
    "tmh.dynamicLocale",
    "ui.bootstrap",
    "ui.router",
    "ui.scroll",
    core,
    shared,
    albums,
    users,
]);

// config providers
appModule.config(appConfigFunc);

// config route provider
appModule.config(routingConfigFunc);

// run function
appModule.run(runFunc);

// register app component
appModule.component(appModule.name, AppComponent);

export const app = appModule.name;
