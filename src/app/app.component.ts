export class AppController {
    public static $inject = [];
    public name: string;

    constructor() {
        this.name = "AppComponent";
    }
}

export const AppComponent: ng.IComponentOptions = {
    controller: AppController,
    templateUrl: () => {
        return "app.component.html";
    },
};
