export class Album {
    public userId: number;
    public id: number;
    public title: string;

    constructor(userId: number, id: number, title: string) {
        this.userId = userId;
        this.id = id;
        this.title = title;
    }
}
