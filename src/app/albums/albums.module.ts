import * as angular from "angular";

import { photos } from "./photos/photos.module";

import { AlbumsComponent } from "./albums.component";
import { AlbumsService } from "./albums.data-service";

export const albums = angular.module("app.albums", [photos])
    .service("AlbumsService", AlbumsService)
    .component("albums", AlbumsComponent)
    .name;
