export class Worker {
    id: number;
    name: string;
    isOnCall: boolean = false;
    isHelper: boolean = false;

    constructor(id: number, name: string, on_call: boolean, helper: boolean) {
        this.id = id;
        this.name = name;
        this.isOnCall = on_call;
        this.isHelper = helper;
    }
}
