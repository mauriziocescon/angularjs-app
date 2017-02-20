import * as angular from "angular";
import {appConfigFunc} from "./app-config.module";
import {routingConfigFunc} from "./app-routing.module";
import {runFunc} from "./app-run.module";
import {AppComponent} from "./app.component";
import {core} from "./core/core.module";
import {shared} from "./shared/shared.module";
import {albums} from "./albums/albums.module";
import {users} from "./users/users.module";

export * from "./core/core.module";

const appModule = angular.module("app", [
	"angular-loading-bar",
	"angular-stats",
	"app-templates",
	"infinite-scroll",
	"ngAnimate",
	"ngSanitize",
	"ngTouch",
	"tmh.dynamicLocale",
	"ui.bootstrap",
	"ui.router",
	"ui.scroll",
	core,
	shared,
	albums,
	users
]);

// register app component
appModule.component(appModule.name, AppComponent);

// config locale provider
appModule.config(appConfigFunc);

// config route provider
appModule.config(routingConfigFunc);

// run function
appModule.run(runFunc);

export const app = appModule.name;