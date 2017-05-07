import * as angular from "angular";
import { PhotosComponent } from "./photos.component";
import { PhotosService } from "./photos.data-service";

export const photos = angular.module("albums.photos", [])
    .service("PhotosService", PhotosService)
    .component("photos", PhotosComponent)
    .name;
