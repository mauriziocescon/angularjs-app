import * as angular from "angular";
import { AlbumsComponent } from "./albums.component";
import { AlbumsService } from "./albums.data-service";
import { photos } from "./photos/photos.module";

export const albums = angular.module("app.albums", [photos])
    .service("AlbumsService", AlbumsService)
    .component("albums", AlbumsComponent)
    .name;
