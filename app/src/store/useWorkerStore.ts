import { useSQLite } from "@/composables/useSQLite";
import { Worker } from "@/core/models/Worker";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useWorkerStore = defineStore('worker', () => {

    const { executeQuery } = useSQLite();
    const workerList = ref<Worker[]>(new Array());

    function fetchWorkers(year: number) {
        workerList.value = [];
        executeQuery('SELECT w.id, w.name, a.on_call, a.helper FROM worker w, availabality a WHERE w.id = a.worker AND a.year = (?);', [year]).then(rows => {
            console.log(rows);
            (rows as []).forEach((row: {id: number, name: string, on_call: boolean, helper: boolean}) => {
                workerList.value.push(new Worker(row.id, row.name, row.on_call, row.helper));
            })
            console.log(workerList.value);
        });
    }

    function addWorker(name: string) {
        executeQuery('INSERT INTO worker (name) VALUES (?);', [name]).then(e => {
            executeQuery('INSERT INTO availabality (year, worker, on_call, helper) VALUES (0, (SELECT id FROM worker WHERE name = (?)), 0, 0);', [name]);
            fetchWorkers(0);
        }
        ).catch(e => console.error(e));
    }

    function removeWorker(id: number) {
        executeQuery('DELETE FROM availabality WHERE year = (?) AND worker = (?);', [0, id])
        executeQuery('DELETE FROM worker WHERE id = (?)', [id]).then(value => fetchWorkers(0));
    }

    function getWorkerById(id: number) {
        return workerList.value.find(worker => worker.id === id);
    }

    function setIsOnCall(id: number, value: boolean) {
        const worker = workerList.value.find(worker => worker.id === id);
        if (worker) {
            worker.isOnCall = value;
            executeQuery('UPDATE availabality SET on_call = (?) WHERE year = (?) AND worker = (?);', [value, 0, id]);
        }
    }

    function setIsHelper(id: number, value: boolean) {
        const worker = workerList.value.find(worker => worker.id === id);
        if (worker) {
            worker.isHelper = value;
            executeQuery('UPDATE availabality SET helper = (?) WHERE year = (?) AND worker = (?);', [value, 0, id]);
        }
    }

    function getWorkerOnCall() {
        return workerList.value.filter(worker => worker.isOnCall);
    }

    function getWorkerHelper() {
        return workerList.value.filter(worker => worker.isHelper);
    }

    return {
        workerList,
        fetchWorkers,
        addWorker,
        removeWorker,
        getWorkerById,
        setIsOnCall,
        setIsHelper,
        getWorkerOnCall,
        getWorkerHelper
    };
});
