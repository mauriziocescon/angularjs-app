import * as angular from "angular";

import { userPosts } from "./user-posts/user-posts.module";
import { userTodos } from "./user-todos/user-todos.module";

import { UsersComponent } from "./users.component";
import { UsersService } from "./users.data-service";

export const users = angular.module("app.users", [userTodos, userPosts])
    .service("UsersService", UsersService)
    .component("users", UsersComponent)
    .name;
