import { Album } from "./albums.model";
import { IAlbumsService } from "./albums.data-service";
import {
    Enum,
    ISharedFilterService,
    Logger,
    ResponseWs,
} from "../shared/shared.module";
import {
    IDelayExecutionService,
    ILocalizedStringService,
    INavigationBarService,
    IUIUtilitiesService,
    IUtilitiesService,
} from "../app.module";

export class AlbumsController {
    public static $inject = ["$filter", "$state", "DelayExecutionService", "LocalizedStringService", "UIUtilitiesService", "UtilitiesService", "NavigationBarService", "AlbumsService"];
    public name: string;

    private filter: ISharedFilterService;
    private state: ng.ui.IStateService;
    private delayExecutionService: IDelayExecutionService;
    private localizedStringService: ILocalizedStringService;
    private uiUtilitiesService: IUIUtilitiesService;
    private utilitiesService: IUtilitiesService;
    private navigationBarService: INavigationBarService;
    private albumsService: IAlbumsService;

    public albums: Album[];
    private pageNumber: number;
    private loadCompleted: boolean;
    private busy: boolean;
    public textFilter: string;
    private loadAlbumsKey: Enum;

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

    public $onInit(): void {
        this.navigationBarService.setTitle(this.localizedStringService.getLocalizedString("ALBUMS"));
        this.loadAlbumsKey = new Enum("ALBUMS");
        this.busy = false;
        this.loadAlbumsFirstPage();
    }

    public getAlbumDesc(album: Album): string {
        return album.title;
    }

    public resetTextFilter(): void {
        if (this.textFilter === undefined) {
            return;
        }

        this.textFilter = undefined;
        this.loadAlbumsFirstPage();
    }

    public textFilterDidChange(): void {
        this.delayExecutionService.execute(() => {
            this.loadAlbumsFirstPage();
        }, this.loadAlbumsKey, 1500);
    }

    protected loadAlbumsFirstPage(): void {
        this.busy = true;
        this.pageNumber = 1;
        this.loadCompleted = false;
        this.albums = undefined;

        this.loadAlbums();
    }

    protected loadAlbumsNextPage(): void {
        if (this.isInfiniteScrollDisabled) {
            return;
        }

        this.busy = true;
        this.loadAlbums();
    }

    protected loadAlbums(): void {
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

    public $onDestroy(): void {
        this.albumsService.cancelOngoingRequests();
    }
}

export const AlbumsComponent: ng.IComponentOptions = {
    bindings: {},
    controller: AlbumsController,
    templateUrl: () => {
        return "albums.component.html";
    }
};
