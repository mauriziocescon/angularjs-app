import {Comment} from "./post-comments.model";
import {IPostCommentsService} from "./post-comments.data-service";
import {
    ISharedFilterService,
    ResponseWs,
    Logger
} from "../../../shared/shared.module";
import {
    ILocalizedStringService,
    IUIUtilitiesService,
    IUtilitiesService,
    INavigationBarService
} from "../../../app.module";

export class PostCommentsController {
    private filter: ISharedFilterService;
    private localizedStringService: ILocalizedStringService;
    private uiUtilitiesService: IUIUtilitiesService;
    private utilitiesService: IUtilitiesService;
    private navigationBarService: INavigationBarService;
    private postCommentsService: IPostCommentsService;

    private postId: number;

    public name: string;
    public comments: Array<Comment>;
    private busy: boolean;

    static $inject = ["$filter", "LocalizedStringService", "UIUtilitiesService", "UtilitiesService", "NavigationBarService", "PostCommentsService"];

    constructor($filter: ISharedFilterService,
                LocalizedStringService: ILocalizedStringService,
                UIUtilitiesService: IUIUtilitiesService,
                UtilitiesService: IUtilitiesService,
                NavigationBarService: INavigationBarService,
                PostCommentsService: IPostCommentsService) {
        this.filter = $filter;
        this.localizedStringService = LocalizedStringService;
        this.uiUtilitiesService = UIUtilitiesService;
        this.utilitiesService = UtilitiesService;
        this.navigationBarService = NavigationBarService;
        this.postCommentsService = PostCommentsService;

        this.name = "PostCommentsComponent";
    }

    public get isLoadingData(): boolean {
        return this.busy == true;
    }

    public get hasNoData(): boolean {
        return this.comments != undefined && this.comments.length == 0 && this.isLoadingData == false;
    }

    public get shouldRetry(): boolean {
        return this.comments == undefined && this.isLoadingData == false;
    }

    public get showData(): boolean {
        return this.isLoadingData == false && this.hasNoData == false && this.shouldRetry == false;
    }

    public $onInit(): void {
        this.busy = false;
        this.loadComments();
    }

    public getCommentTitle(comment: Comment): string {
        return comment.id + " " + comment.name + comment.email;
    }

    protected loadComments(): void {
        this.busy = true;
        this.comments = undefined;

        this.postCommentsService.getPostComments(this.postId.toString()).then((response: ResponseWs<Array<Comment>>) => {

            if (response.isSuccess()) {
                this.comments = response.getData();
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
        this.postCommentsService.cancelOngoingRequests();
    }
}

export const PostCommentsComponent: ng.IComponentOptions = {
    bindings: {postId: "<"},
    controller: PostCommentsController,
    templateUrl: () => {
        return "post-comments.component.html";
    }
};
