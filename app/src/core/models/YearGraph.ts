import { WeekNode } from "./WeekNode";

export class YearGraph {
    year: number;
    weekNodes: WeekNode[] = [];

    constructor(year: number) {
        this.year = year;
    }

    createWeeks(nbWeeks: number, rest: number) {
        for (let i = 0; i < nbWeeks; i++) {
            let m = new WeekNode(i);
            this.weekNodes[i] = m;
            m.neighbors = [];
            for (let j = 1; j <= rest; j++) {
                const n = i - j;
                if (n >= 0 && this.weekNodes[n]) {
                    m.addNeighbor(this.weekNodes[n]);
                    this.weekNodes[n].addNeighbor(m);
                }
            }
            if (i >= (nbWeeks - rest)) {
                for (let j = 0; j < (rest + i) % nbWeeks + 1; j++) {
                    const n = (i + nbWeeks - i + j) % nbWeeks;
                    if (n != i && this.weekNodes[n]) {
                        m.addNeighbor(this.weekNodes[n]);
                        this.weekNodes[n].addNeighbor(m);
                    }
                }
            }
        }
        console.log(this.weekNodes);
    }

    // resetWeeks(start: number, end: number) {
    //     for (let i = 0; i < this.weekNodes.length; i++) {
    //         let m = this.weekNodes[i];
    //         if (i >= start && i <= end && m !== undefined) {
    //             m.choice = -1;
    //             m.secondChoice = -1;
    //         }
    //     }
    // }

    resetWeeks() {
        for (let i = 0; i < this.weekNodes.length; i++) {
            let m = this.weekNodes[i];
            if (m !== undefined && m.toAssign) {
                m.choice = -1;
                m.secondChoice = -1;
            }
        }
    }
}
