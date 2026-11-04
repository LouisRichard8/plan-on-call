import { useSQLite } from "@/composables/useSQLite";
import { Worker } from "@/core/models/Worker";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useYearStore } from "./useYearStore";

export const useWorkerStore = defineStore('worker', () => {

    const { executeQuery } = useSQLite();
    const yearStore = useYearStore();

    const workerList = ref<Worker[]>(new Array());

    function fetchWorkers() {
        workerList.value = [];
        executeQuery('SELECT w.id, w.name, a.on_call, a.helper FROM worker w, availabality a WHERE w.id = a.worker AND a.year = (?);', [yearStore.yearGraph?.id as number]).then(rows => {
            console.log(rows);
            if (!(rows instanceof Array)) return
            if (rows.length === 0) {
                addAssignmentForEach(yearStore.yearGraph?.id as number);
            }
            else {
                rows.forEach((row: { id: number, name: string, on_call: boolean, helper: boolean }) => {
                    workerList.value.push(new Worker(row.id, row.name, row.on_call, row.helper));
                })
                console.log(workerList.value);
            }
        });
    }

    function addWorker(name: string) {
        executeQuery('INSERT INTO worker (name) VALUES (?);', [name]).then(() => {
            executeQuery('INSERT INTO availabality (year, worker, on_call, helper) VALUES ((?), (SELECT id FROM worker WHERE name = (?)), 0, 0);', [yearStore.yearGraph?.id as number, name]);
            fetchWorkers();
        }
        ).catch(e => console.error(e));
    }

    function removeWorker(id: number) {
        executeQuery('DELETE FROM availabality WHERE year = (?) AND worker = (?);', [yearStore.yearGraph?.id as number, id])
        executeQuery('DELETE FROM worker WHERE id = (?)', [id]).then(() => fetchWorkers());
    }

    function addAssignmentForEach(year: number) {
        executeQuery('SELECT id FROM worker;').then(rows => {
            if (!(rows instanceof Array)) return
            let sql = '';
            rows.forEach(row => {
                sql += 'INSERT INTO availabality (year, worker, on_call, helper) VALUES (' + year + ', ' + row.id + ', 0, 0);';
            })
            executeQuery(sql).then(() => fetchWorkers());
        })
    }

    function getWorkerById(id: number) {
        return workerList.value.find(worker => worker.id === id);
    }

    function setIsOnCall(id: number, value: boolean) {
        const worker = workerList.value.find(worker => worker.id === id);
        if (worker) {
            worker.isOnCall = value;
            executeQuery('UPDATE availabality SET on_call = (?) WHERE year = (?) AND worker = (?);', [value, yearStore.yearGraph?.id as number, id]);
        }
    }

    function setIsHelper(id: number, value: boolean) {
        const worker = workerList.value.find(worker => worker.id === id);
        if (worker) {
            worker.isHelper = value;
            executeQuery('UPDATE availabality SET helper = (?) WHERE year = (?) AND worker = (?);', [value, yearStore.yearGraph?.id as number, id]);
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
