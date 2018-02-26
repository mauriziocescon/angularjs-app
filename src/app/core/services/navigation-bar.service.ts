export interface INavigationBarService {
    setTitle(title: string): void;
    getTitle(): string;
}

export class NavigationBarService implements INavigationBarService {
    public static $inject = [];

    protected title: string;

    constructor() {
        this.title = "";
    }

    public setTitle(title: string): void {
        this.title = title;
    }

    public getTitle(): string {
        return this.title;
    }
}
