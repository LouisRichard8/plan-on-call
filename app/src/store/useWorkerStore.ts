import { Worker } from "@/core/models/Worker";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useWorkerStore = defineStore('worker', () => {

    const workerList = ref<Worker[]>(new Array());

    function setWorkers(workerNameList: string[]) {
        workerNameList.forEach(workerName => {
            workerList.value.push(new Worker(workerList.value.length, workerName));
        })
    }

    function getWorkerById(id: number) {
        return workerList.value.at(id);
    }

    function setIsOnCall(id: number, value: boolean) {
        const worker = workerList.value.at(id);
        if (worker) {
            worker.isOnCall = true;
        }
    }

    function setIsHelper(id: number, value: boolean) {
        const worker = workerList.value.at(id);
        if (worker) {
            worker.isHelper = true;
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
        setWorkers,
        getWorkerById,
        setIsOnCall,
        setIsHelper,
        getWorkerOnCall,
        getWorkerHelper
    };
});
