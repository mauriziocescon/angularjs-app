import {
    INavigationBarService,
    IUIUtilitiesService,
    IUtilitiesService,
} from "../../app.module";
import {

    ISharedFilterService,
    Logger,
    ResponseWs,
} from "../../shared/shared.module";

import { IPhotosService } from "./photos.data-service";
import { Photo } from "./photos.model";

export class PhotosController {
    public static $inject = ["$filter", "$stateParams", "$translate", "NavigationBarService", "UIUtilitiesService", "UtilitiesService", "PhotosService"];
    public name: string;

    protected filter: ISharedFilterService;
    protected stateParams: ng.ui.IStateParamsService;
    protected translate: ng.translate.ITranslateService;
    protected navigationBarService: INavigationBarService;
    protected uiUtilitiesService: IUIUtilitiesService;
    protected utilitiesService: IUtilitiesService;
    protected photosService: IPhotosService;

    protected photos: Photo[];
    protected pageNumber: number;
    protected loadCompleted: boolean;
    protected busy: boolean;

    constructor($filter: ISharedFilterService,
                $stateParams: ng.ui.IStateParamsService,
                $translate: ng.translate.ITranslateService,
                NavigationBarService: INavigationBarService,
                UIUtilitiesService: IUIUtilitiesService,
                UtilitiesService: IUtilitiesService,
                PhotosService: IPhotosService) {
        this.filter = $filter;
        this.stateParams = $stateParams;
        this.translate = $translate;
        this.navigationBarService = NavigationBarService;
        this.uiUtilitiesService = UIUtilitiesService;
        this.utilitiesService = UtilitiesService;
        this.photosService = PhotosService;

        this.name = "PhotosComponent";
    }

    public get isLoadingData(): boolean {
        return this.busy === true;
    }

    public get isLoadCompleted(): boolean {
        return this.isLoadingData === false && this.photos !== undefined && this.photos.length > 0 && this.loadCompleted === true;
    }

    public get hasNoData(): boolean {
        return this.photos !== undefined && this.photos.length === 0 && this.isLoadingData === false;
    }

    public get shouldRetry(): boolean {
        return this.photos === undefined && this.isLoadingData === false;
    }

    public get isInfiniteScrollDisabled(): boolean {
        return this.isLoadingData === true || this.loadCompleted === true || this.photos === undefined || this.photos.length === 0;
    }

    public get dataSource(): Photo[] {
        return this.photos;
    }

    public $onInit(): void {
        this.translate(["PHOTOS"]).then((translations: any) => {
            this.navigationBarService.setTitle(translations.PHOTOS);
            this.busy = false;
            this.loadDataSourceFirstPage();
        });
    }

    public $onDestroy(): void {
        this.photosService.cancelOngoingRequests();
    }

    public getPhotoDesc(photo: Photo): string {
        return "[" + photo.id.toString() + "] " + photo.title.toString();
    }

    public loadDataSourceFirstPage(): void {
        this.busy = true;
        this.pageNumber = 1;
        this.loadCompleted = false;
        this.photos = undefined;

        this.loadDataSource();
    }

    public loadDataSourceNextPage(): void {
        if (this.isInfiniteScrollDisabled) {
            return;
        }

        this.busy = true;
        this.loadDataSource();
    }

    public loadDataSource(): void {
        const albumId = "albumId";
        this.photosService.getPhotosForAlbum(this.stateParams[albumId], this.pageNumber).then((response: ResponseWs<Photo[]>) => {

            if (response.isSuccess()) {
                this.photos = this.photos === undefined ? response.getData() : this.photos.concat(response.getData());
                this.loadCompleted = response.isLastPage();

                if (!this.loadCompleted) {
                    this.pageNumber++;
                }
            }
            else if (response.hasBeenCanceled() === false) {
                // we do not notify the user in case of cancel request
                this.translate(["ERROR_ACCESS_DATA", "CLOSE"]).then((translations: any) => {
                    this.uiUtilitiesService.modalAlert(translations.ERROR_ACCESS_DATA, response.getMessage(), translations.CLOSE);
                });
            }
        }).catch((reason: any) => {
            this.translate(["ERROR_ACCESS_DATA_COMPONENT", "CLOSE"]).then((translations: any) => {
                this.uiUtilitiesService.modalAlert(translations.ERROR_ACCESS_DATA_COMPONENT, reason.toString(), translations.CLOSE);
            });
            Logger.log(reason);
        }).finally(() => {
            this.busy = false;
        });
    }
}

export const PhotosComponent: ng.IComponentOptions = {
    bindings: {},
    controller: PhotosController,
    templateUrl: () => {
        return "photos.component.html";
    },
};
