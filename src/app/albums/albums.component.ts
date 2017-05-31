import {
    IDelayExecutionService,
    ILocalizedStringService,
    IUIUtilitiesService,
    IUtilitiesService,
} from "../app.module";
import {
    Enum,
    INavigationBarService,
    ISharedFilterService,
    Logger,
    ResponseWs,
} from "../shared/shared.module";

import { IAlbumsService } from "./albums.data-service";
import { Album } from "./albums.model";

export class AlbumsController {
    public static $inject = ["$filter", "$state", "DelayExecutionService", "LocalizedStringService", "UIUtilitiesService", "UtilitiesService", "NavigationBarService", "AlbumsService"];
    public name: string;
    public textFilter: string;

    protected filter: ISharedFilterService;
    protected state: ng.ui.IStateService;
    protected delayExecutionService: IDelayExecutionService;
    protected localizedStringService: ILocalizedStringService;
    protected uiUtilitiesService: IUIUtilitiesService;
    protected utilitiesService: IUtilitiesService;
    protected navigationBarService: INavigationBarService;
    protected albumsService: IAlbumsService;

    protected albums: Album[];
    protected pageNumber: number;
    protected loadCompleted: boolean;
    protected busy: boolean;

    protected loadAlbumsKey: Enum;

    constructor($filter: ISharedFilterService,
                $state: ng.ui.IStateService,
                DelayExecutionService: IDelayExecutionService,
                LocalizedStringService: ILocalizedStringService,
                UIUtilitiesService: IUIUtilitiesService,
                UtilitiesService: IUtilitiesService,
                NavigationBarService: INavigationBarService,
                AlbumsService: IAlbumsService) {
        this.filter = $filter;
        this.state = $state;
        this.delayExecutionService = DelayExecutionService;
        this.localizedStringService = LocalizedStringService;
        this.uiUtilitiesService = UIUtilitiesService;
        this.utilitiesService = UtilitiesService;
        this.navigationBarService = NavigationBarService;
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

    public get textFilterPlaceholder(): string {
        return this.localizedStringService.getLocalizedString("INPUT_TEXT_PLACEHOLDER");
    }

    public get dataSource(): Album[] {
        return this.albums;
    }

    public $onInit(): void {
        this.navigationBarService.setTitle(this.localizedStringService.getLocalizedString("ALBUMS"));
        this.loadAlbumsKey = new Enum("ALBUMS");
        this.busy = false;
        this.loadDataSourceFirstPage();
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
        this.albumsService.getAlbums(this.textFilter, this.pageNumber).then((response: ResponseWs<Album[]>) => {

            if (response.isSuccess()) {
                this.albums = this.albums === undefined ? response.getData() : this.albums.concat(response.getData());
                this.loadCompleted = response.isLastPage();

                if (!this.loadCompleted) {
                    this.pageNumber++;
                }
            }
            else if (response.hasBeenCanceled() === false) {
                // we do not notify the user in case of cancel request
                this.uiUtilitiesService.modalAlert(this.localizedStringService.getLocalizedString("ERROR_ACCESS_DATA"), response.getMessage(), this.localizedStringService.getLocalizedString("CLOSE"));
            }
        }).catch((reason: any) => {
            this.uiUtilitiesService.modalAlert(this.localizedStringService.getLocalizedString("ERROR_ACCESS_DATA_COMPONENT"), reason.toString(), this.localizedStringService.getLocalizedString("CLOSE"));
            Logger.log(reason);
        }).finally(() => {
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
    templateUrl: () => {
        return "albums.component.html";
    },
};
