import * as angular from "angular";
import { UsersComponent } from "./users.component";
import { UsersService } from "./users.data-service";
import { userTodos } from "./user-todos/user-todos.module";
import { userPosts } from "./user-posts/user-posts.module";

export const users = angular.module("app.users", [userTodos, userPosts])
    .service("UsersService", UsersService)
    .component("users", UsersComponent)
    .name;
