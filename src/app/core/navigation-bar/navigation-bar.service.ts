export interface INavigationBarService {
    setTitle(title: string): void;
    getTitle(): string;
}

export class NavigationBarService implements INavigationBarService {
    private title: string;

    static $inject = [];

    constructor() {
    }

    public setTitle(title: string): void {
        this.title = title;
    }

    public getTitle(): string {
        return this.title;
    }
}
