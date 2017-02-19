import {Photo} from "./photos.model";
import {IPhotosService} from "./photos.data-service";
import {
	ISharedFilterService,
	ResponseWs,
	Logger
} from "../../shared/shared.module";
import {
	ILocalizedStringService,
	IUIUtilitiesService,
	IUtilitiesService,
	INavigationBarService
} from "../../app.module";

export class PhotosController {
	private filter: ISharedFilterService;
	private stateParams: ng.ui.IStateParamsService;
	private localizedStringService: ILocalizedStringService;
	private uiUtilitiesService: IUIUtilitiesService;
	private utilitiesService: IUtilitiesService;
	private navigationBarService: INavigationBarService;
	private photosService: IPhotosService;

	public name: string;
	public photos: Array<Photo>;
	private pageNumber: number;
	private loadCompleted: boolean;
	private busy: boolean;

	static $inject = ["$filter", "$stateParams", "LocalizedStringService", "UIUtilitiesService", "UtilitiesService", "NavigationBarService", "PhotosService"];

	constructor($filter: ISharedFilterService,
				$stateParams: ng.ui.IStateParamsService,
				LocalizedStringService: ILocalizedStringService,
				UIUtilitiesService: IUIUtilitiesService,
				UtilitiesService: IUtilitiesService,
				NavigationBarService: INavigationBarService,
				PhotosService: IPhotosService) {
		this.filter = $filter;
		this.stateParams = $stateParams;
		this.localizedStringService = LocalizedStringService;
		this.uiUtilitiesService = UIUtilitiesService;
		this.utilitiesService = UtilitiesService;
		this.navigationBarService = NavigationBarService;
		this.photosService = PhotosService;

		this.name = "PhotosComponent";
	}

	public get isLoadingData(): boolean {
		return this.busy == true;
	}

	public get isLoadCompleted(): boolean {
		return this.isLoadingData == false && this.photos != undefined && this.photos.length > 0 && this.loadCompleted == true;
	}

	public get hasNoData(): boolean {
		return this.photos != undefined && this.photos.length == 0 && this.isLoadingData == false;
	}

	public get shouldRetry(): boolean {
		return this.photos == undefined && this.isLoadingData == false;
	}

	public get isInfiniteScrollDisabled(): boolean {
		return this.isLoadingData == true || this.loadCompleted == true || this.photos == undefined || this.photos.length == 0;
	}

	public $onInit(): void {
		this.navigationBarService.setTitle(this.localizedStringService.getLocalizedString("PHOTOS"));
		this.busy = false;
		this.loadPhotosFirstPage();
	}

	public getPhotoDesc(photo: Photo): string {
		return "[" + photo.id.toString() + "] " + photo.title.toString();
	}

	protected loadPhotosFirstPage(): void {
		this.busy = true;
		this.pageNumber = 1;
		this.loadCompleted = false;
		this.photos = undefined;

		this.loadPhotos();
	}

	protected loadPhotosNextPage(): void {
		if (this.isInfiniteScrollDisabled) return;

		this.busy = true;
		this.loadPhotos();
	}

	public loadPhotos(): void {
		this.photosService.getPhotosForAlbum(this.stateParams["albumId"], this.pageNumber).then((response: ResponseWs<Array<Photo>>) => {

			if (response.isSuccess()) {
				this.photos = this.photos == undefined ? response.getData() : this.photos.concat(response.getData());
				this.loadCompleted = response.isLastPage();

				if (!this.loadCompleted) {
					this.pageNumber++;
				}
			}
			else if (response.hasBeenCanceled() == false) {
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

	public $onDestroy(): void {
		this.photosService.cancelOngoingRequests();
	}
}

export const PhotosComponent: ng.IComponentOptions = {
	bindings: {},
	controller: PhotosController,
	templateUrl: () => {
		return "photos.component.html";
	}
};