export class Todo {
    public userId: number;
    public id: number;
    public title: string;
    public completed: boolean;

    constructor(userId: number, id: number, title: string, completed: boolean) {
        this.userId = userId;
        this.id = id;
        this.title = title;
        this.completed = completed;
    }
}
