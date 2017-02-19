export class AppController {
	public name: string;

	static $inject = [];

	constructor() {
		this.name = "AppComponent";
	}

	public $onInit(): void {

	}

	public $onDestroy(): void {

	}
}

export const AppComponent: ng.IComponentOptions = {
	controller: AppController,
	templateUrl: () => {
		return "app.component.html";
	}
};