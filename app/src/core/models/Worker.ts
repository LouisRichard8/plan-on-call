export class Worker {
    id: number;
    name: string;
    isOnCall: boolean = true;
    isHelper: boolean = true;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}
