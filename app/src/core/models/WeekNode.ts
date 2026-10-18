export class WeekNode {
    id: number;
    neighbors: WeekNode[] = [];
    choice: number = -1;
    secondChoice: number = -1;
    avoid: number[] = [];
    toAssign: boolean = true;

    constructor(id: number) {
        this.id = id;
    }

    addNeighbor(node: WeekNode) {
        this.neighbors.push(node);
    }

    checkNeighbor(choice: number) {
        return this.neighbors.findIndex(n => n.choice == choice || n.secondChoice == choice) == -1;
    }

    check(worker: number) {
        return this.avoid.findIndex(w => w == worker) == -1 && this.checkNeighbor(worker) && worker != this.choice && worker != this.secondChoice;
    }

    needAssign(need: boolean) {
        if (this.toAssign && this.choice < 0) return;
        this.toAssign = need;
    }
}
