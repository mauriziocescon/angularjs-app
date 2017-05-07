import * as angular from "angular";
import { app } from "./app.module";

import { albumsRunFuncMocks } from "./albums/albums.data-service-mocks";
import { photosRunFuncMocks } from "./albums/photos/photos.data-service-mocks";
import { postCommentsRunFuncMocks } from "./users/user-posts/post-comments/post-comments.data-service-mocks";
import { userPostsRunFuncMocks } from "./users/user-posts/user-posts.data-service-mocks";
import { usersRunFuncMocks } from "./users/users.data-service-mocks";
import { userTodosRunFuncMocks } from "./users/user-todos/user-todos.data-service-mocks";

const appDevModule = angular.module("appDev", [app, "ngMockE2E"]);

const defaultRunFuncMocks = ($httpBackend: ng.IHttpBackendService) => {
    // by default call the real ws
    $httpBackend.whenGET((url: string) => {
        return true;
    }).passThrough();

    $httpBackend.whenPOST((url: string) => {
        return true;
    }).passThrough();
};

defaultRunFuncMocks.$inject = ["$httpBackend"];

// run functions
appDevModule.run(albumsRunFuncMocks);
appDevModule.run(photosRunFuncMocks);
appDevModule.run(postCommentsRunFuncMocks);
appDevModule.run(userPostsRunFuncMocks);
appDevModule.run(usersRunFuncMocks);
appDevModule.run(userTodosRunFuncMocks);

appDevModule.run(defaultRunFuncMocks);

export const appDev = appDevModule.name;
