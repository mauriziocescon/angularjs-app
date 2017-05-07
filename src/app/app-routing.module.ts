export const routingConfigFunc = ($locationProvider: ng.ILocationProvider,
                                  $stateProvider: ng.ui.IStateProvider,
                                  $urlRouterProvider: ng.ui.IUrlRouterProvider) => {
    $stateProvider.state({
        name: "albums",
        template: "<albums></albums>",
        url: "/albums",
    });
    $stateProvider.state({
        name: "photos",
        params: {
            albumId: null,
        },
        template: "<photos></photos>",
    });
    $stateProvider.state({
        name: "users",
        template: "<users></users>",
        url: "/users",
    });
    $stateProvider.state({
        name: "user-posts",
        template: "<user-posts></user-posts>",
        url: "/user-posts/{userId}",
    });
    $stateProvider.state({
        name: "user-todos",
        template: "<user-todos></user-todos>",
        url: "/user-todos/{userId}",
    });
    $urlRouterProvider.otherwise("/users");
};

routingConfigFunc.$inject = ["$locationProvider", "$stateProvider", "$urlRouterProvider"];
