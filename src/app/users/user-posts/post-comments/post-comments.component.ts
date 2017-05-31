import {
    ILocalizedStringService,
    IUIUtilitiesService,
    IUtilitiesService,
} from "../../../app.module";
import {
    INavigationBarService,
    ISharedFilterService,
    Logger,
    ResponseWs,
} from "../../../shared/shared.module";

import { IPostCommentsService } from "./post-comments.data-service";
import { Comment } from "./post-comments.model";

export class PostCommentsController {
    public static $inject = ["$filter", "LocalizedStringService", "UIUtilitiesService", "UtilitiesService", "NavigationBarService", "PostCommentsService"];
    public name: string;

    protected filter: ISharedFilterService;
    protected localizedStringService: ILocalizedStringService;
    protected uiUtilitiesService: IUIUtilitiesService;
    protected utilitiesService: IUtilitiesService;
    protected navigationBarService: INavigationBarService;
    protected postCommentsService: IPostCommentsService;

    protected postId: number;
    protected comments: Comment[];
    protected busy: boolean;

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
        return this.busy === true;
    }

    public get hasNoData(): boolean {
        return this.comments !== undefined && this.comments.length === 0 && this.isLoadingData === false;
    }

    public get shouldRetry(): boolean {
        return this.comments === undefined && this.isLoadingData === false;
    }

    public get showData(): boolean {
        return this.isLoadingData === false && this.hasNoData === false && this.shouldRetry === false;
    }

    public get dataSource(): Comment[] {
        return this.comments;
    }

    public $onInit(): void {
        this.busy = false;
        this.loadDataSource();
    }

    public $onDestroy(): void {
        this.postCommentsService.cancelOngoingRequests();
    }

    public getCommentTitle(comment: Comment): string {
        return comment.id + " " + comment.name + comment.email;
    }

    public loadDataSource(): void {
        this.busy = true;
        this.comments = undefined;

        this.postCommentsService.getPostComments(this.postId.toString()).then((response: ResponseWs<Comment[]>) => {

            if (response.isSuccess()) {
                this.comments = response.getData();
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
}

export const PostCommentsComponent: ng.IComponentOptions = {
    bindings: {postId: "<"},
    controller: PostCommentsController,
    templateUrl: () => {
        return "post-comments.component.html";
    },
};
