import * as angular from 'angular';
import { PostCommentsComponent } from './post-comments.component';
import { PostCommentsService } from './post-comments.data-service';

export const postComments = angular.module('userPosts.postComments', [])
  .service('PostCommentsService', PostCommentsService)
  .component('postComments', PostCommentsComponent)
  .name;
