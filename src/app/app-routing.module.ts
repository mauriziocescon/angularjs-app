export const routingConfigFunc = ($locationProvider: ng.ILocationProvider, $stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) => {

    $stateProvider.state({
        name: "albums",
        url: "/albums",
        template: "<albums></albums>"
    });
    $stateProvider.state({
        name: "photos",
        params: {
            albumId: null
        },
        template: "<photos></photos>"
    });
    $stateProvider.state({
        name: "users",
        url: "/users",
        template: "<users></users>"
    });
    $stateProvider.state({
        name: "user-posts",
        url: "/user-posts/{userId}",
        template: "<user-posts></user-posts>"
    });
    $stateProvider.state({
        name: "user-todos",
        url: "/user-todos/{userId}",
        template: "<user-todos></user-todos>"
    });
    $urlRouterProvider.otherwise("/users");
};

routingConfigFunc.$inject = ["$locationProvider", "$stateProvider", "$urlRouterProvider"];
