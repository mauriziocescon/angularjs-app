import * as angular from 'angular';

import { postComments } from './post-comments/post-comments.module';

import { UserPostsComponent } from './user-posts.component';
import { UserPostsService } from './user-posts.data-service';

export const userPosts = angular.module('users.userPosts', [postComments])
  .service('UserPostsService', UserPostsService)
  .component('userPosts', UserPostsComponent)
  .name;
