import * as angular from "angular";
import {UserTodosComponent} from "./user-todos.component";
import {UserTodosService} from "./user-todos.data-service";

export const userTodos = angular.module("users.userTodos", [])
    .service("UserTodosService", UserTodosService)
    .component("userTodos", UserTodosComponent)
    .name;
