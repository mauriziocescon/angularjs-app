import * as angular from "angular";
import {UserPostsComponent} from "./user-posts.component";
import {UserPostsService} from "./user-posts.data-service";
import {postComments} from "./post-comments/post-comments.module";

export const userPosts = angular.module("users.userPosts", [postComments])
	.service("UserPostsService", UserPostsService)
	.component("userPosts", UserPostsComponent)
	.name;