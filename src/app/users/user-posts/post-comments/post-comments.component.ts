import template from './post-comments.component.html';

import {
  INavigationBarService,
  IUIUtilitiesService,
  IUtilitiesService,
} from '../../../app.module';
import {
  ISharedFilterService,
  Logger,
  ResponseWs,
} from '../../../shared/shared.module';

import { IPostCommentsService } from './post-comments.data-service';
import { Comment } from './post-comments.model';

export class PostCommentsController {
  public static $inject = ['$filter', '$translate', 'NavigationBarService', 'UIUtilitiesService', 'UtilitiesService', 'PostCommentsService'];
  public name: string;

  protected postId!: number;
  protected comments: Comment[] | undefined;
  protected busy!: boolean;

  constructor(protected filter: ISharedFilterService,
              protected translate: ng.translate.ITranslateService,
              protected navigationBarService: INavigationBarService,
              protected uiUtilitiesService: IUIUtilitiesService,
              protected utilitiesService: IUtilitiesService,
              protected postCommentsService: IPostCommentsService) {
    this.name = 'PostCommentsComponent';
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

  public get dataSource(): Comment[] | undefined {
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
    return comment.id + ' ' + comment.name + comment.email;
  }

  public loadDataSource(): void {
    this.busy = true;
    this.comments = undefined;

    this.postCommentsService.getPostComments(this.postId.toString())
      .then((response: ResponseWs<Comment[] | undefined>) => {

        if (response.isSuccess()) {
          this.comments = response.getData();
        }
        else if (response.hasBeenCanceled() === false) {
          // we do not notify the user in case of cancel request
          this.translate(['POST_COMMENTS.ERROR_ACCESS_DATA', 'POST_COMMENTS.CLOSE'])
            .then((translations: any) => {
              this.uiUtilitiesService.modalAlert(translations['POST_COMMENTS.ERROR_ACCESS_DATA'], response.getMessage(), translations['POST_COMMENTS.CLOSE']);
            });
        }
      })
      .catch((reason: any) => {
        this.translate(['POST_COMMENTS.ERROR_ACCESS_DATA', 'POST_COMMENTS.CLOSE'])
          .then((translations: any) => {
            this.uiUtilitiesService.modalAlert(translations['POST_COMMENTS.ERROR_ACCESS_DATA'], reason.toString(), translations['POST_COMMENTS.CLOSE']);
          });
        Logger.log(reason);
      })
      .finally(() => {
        this.busy = false;
      });
  }
}

export const PostCommentsComponent: ng.IComponentOptions = {
  bindings: { postId: '<' },
  controller: PostCommentsController,
  template: () => {
    return template;
  },
};
