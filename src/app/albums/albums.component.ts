import template from "./albums.component.html";

import {
    IDelayExecutionService,
    INavigationBarService,
    IUIUtilitiesService,
    IUtilitiesService,
} from "../app.module";
import {
    Enum,
    ISharedFilterService,
    Logger,
    ResponseWs,
} from "../shared/shared.module";

import { IAlbumsService } from "./albums.data-service";
import { Album } from "./albums.model";

export class AlbumsController {
    public static $inject = ["$filter", "$state", "$translate", "DelayExecutionService", "NavigationBarService", "UIUtilitiesService", "UtilitiesService", "AlbumsService"];
    public name: string;
    public textFilter: string | undefined;

    protected filter: ISharedFilterService;
    protected state: ng.ui.IStateService;
    protected translate: ng.translate.ITranslateService;
    protected delayExecutionService: IDelayExecutionService;
    protected navigationBarService: INavigationBarService;
    protected uiUtilitiesService: IUIUtilitiesService;
    protected utilitiesService: IUtilitiesService;
    protected albumsService: IAlbumsService;

    protected albums: Album[] | undefined;
    protected pageNumber: number;
    protected loadCompleted: boolean;
    protected busy: boolean;

    protected loadAlbumsKey: Enum;

    constructor($filter: ISharedFilterService,
                $state: ng.ui.IStateService,
                $translate: ng.translate.ITranslateService,
                DelayExecutionService: IDelayExecutionService,
                NavigationBarService: INavigationBarService,
                UIUtilitiesService: IUIUtilitiesService,
                UtilitiesService: IUtilitiesService,
                AlbumsService: IAlbumsService) {
        this.filter = $filter;
        this.state = $state;
        this.translate = $translate;
        this.delayExecutionService = DelayExecutionService;
        this.navigationBarService = NavigationBarService;
        this.uiUtilitiesService = UIUtilitiesService;
        this.utilitiesService = UtilitiesService;
        this.albumsService = AlbumsService;

        this.name = "AlbumsComponent";
    }

    public get isLoadingData(): boolean {
        return this.busy === true;
    }

    public get isLoadCompleted(): boolean {
        return this.isLoadingData === false && this.albums !== undefined && this.albums.length > 0 && this.loadCompleted === true;
    }

    public get hasNoData(): boolean {
        return this.albums !== undefined && this.albums.length === 0 && this.isLoadingData === false;
    }

    public get shouldRetry(): boolean {
        return this.albums === undefined && this.isLoadingData === false;
    }

    public get isInfiniteScrollDisabled(): boolean {
        return this.isLoadingData === true || this.loadCompleted === true || this.albums === undefined || this.albums.length === 0;
    }

    public get dataSource(): Album[] | undefined {
        return this.albums;
    }

    public $onInit(): void {
        this.translate(["ALBUMS.ALBUMS"])
            .then((translations: any) => {
                this.navigationBarService.setTitle(translations["ALBUMS.ALBUMS"]);
                this.loadAlbumsKey = new Enum("ALBUMS");
                this.busy = false;
                this.loadDataSourceFirstPage();
            });
    }

    public $onDestroy(): void {
        this.albumsService.cancelOngoingRequests();
    }

    public getAlbumDesc(album: Album): string {
        return album.title;
    }

    public resetTextFilter(): void {
        if (this.textFilter === undefined) {
            return;
        }

        this.textFilter = undefined;
        this.loadDataSourceFirstPage();
    }

    public textFilterDidChange(): void {
        this.delayExecutionService.execute(() => {
            this.loadDataSourceFirstPage();
        }, this.loadAlbumsKey, 1500);
    }

    public loadDataSourceFirstPage(): void {
        this.busy = true;
        this.pageNumber = 1;
        this.loadCompleted = false;
        this.albums = undefined;

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
        this.albumsService.getAlbums(this.textFilter, this.pageNumber)
            .then((response: ResponseWs<Album[] | undefined>) => {

                if (response.isSuccess()) {
                    const data = response.getData();
                    this.albums = this.albums === undefined ? data : this.albums.concat(data ? data : []);
                    this.loadCompleted = response.isLastPage();

                    if (!this.loadCompleted) {
                        this.pageNumber++;
                    }
                }
                else if (response.hasBeenCanceled() === false) {
                    // we do not notify the user in case of cancel request
                    this.translate(["ALBUMS.ERROR_ACCESS_DATA", "ALBUMS.CLOSE"])
                        .then((translations: any) => {
                            this.uiUtilitiesService.modalAlert(translations["ALBUMS.ERROR_ACCESS_DATA"], response.getMessage(), translations["ALBUMS.CLOSE"]);
                        });
                }
            })
            .catch((reason: any) => {
                this.translate(["ALBUMS.ERROR_ACCESS_DATA", "ALBUMS.CLOSE"])
                    .then((translations: any) => {
                        this.uiUtilitiesService.modalAlert(translations["ALBUMS.ERROR_ACCESS_DATA"], reason.toString(), translations["ALBUMS.CLOSE"]);
                    });
                Logger.log(reason);
            })
            .finally(() => {
                this.busy = false;
            });
    }

    public goToPhotos(album: Album): void {
        this.state.go("photos", {albumId: album.id});
    }
}

export const AlbumsComponent: ng.IComponentOptions = {
    bindings: {},
    controller: AlbumsController,
    template: () => {
        return template;
    },
};
