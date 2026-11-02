import type { Worker } from "../models/Worker";
import { YearGraph } from "../models/YearGraph";
import { shuffleArray } from "./Utils";

export function planGraph(graph: YearGraph, workers: Worker[], helpers: Worker[], selectedAmount: { worker: number, first: number, second: number }[], maxTry: number): boolean {
    graph.resetWeeks();
    let choices: number[] = [];
    let helperChoices: number[] = [];
    workers.forEach((worker, id) => {
        choices[id] = worker.id;
        selectedAmount[id] = { worker: worker.id, first: 0, second: 0 };
    });
    helpers.forEach((helper, id) => {
        helperChoices[id] = helper.id;
        if (selectedAmount.findIndex(amount => amount.worker == helper.id) == -1) {
            selectedAmount[selectedAmount.length] = { worker: helper.id, first: 0, second: 0 };
        }
    });
    graph.weekNodes.forEach(week => {
        if (!week.toAssign) {
            const firstChoice = selectedAmount.find(a => a.worker == week.choice);
            const secondChoice = selectedAmount.find(a => a.worker == week.secondChoice);
            if (firstChoice && secondChoice) {
                firstChoice.first += 1;
                secondChoice.second += 1;
            }
        }
    });
    let complete = false;
    let nbTry = maxTry;
    while (!complete && nbTry > 0) {
        complete = true;
        graph.weekNodes.forEach(week => {
            if (!week.toAssign) return;
            shuffleArray(choices);
            for (let j = 0; j < choices.length; j++) {
                const workerId: number = choices[j] ?? -1;
                const amount = selectedAmount.find(a => a.worker == workerId);
                if (week.check(workerId) && amount && amount.first <= amount.second) {
                    week.choice = workerId;
                    amount.first += 1;
                    break;
                }
            }
            for (let j = 0; j < helperChoices.length; j++) {
                const workerId: number = helperChoices[j] ?? -1;
                const amount = selectedAmount.find(a => a.worker == workerId);
                if (week.check(workerId) && amount && amount.first >= amount.second) {
                    week.secondChoice = workerId;
                    amount.second += 1;
                    break;
                }
            }
            complete = complete && week.choice != -1 && week.secondChoice != -1;
        });
        nbTry--;
    }
    graph.weekNodes.forEach(week => {
        week.needAssign(!complete);
    });

    return complete;
}
