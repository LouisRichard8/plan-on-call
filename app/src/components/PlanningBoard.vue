<script lang="ts" setup>
import { planGraph } from '@/core/utils/GraphUtils';
import { useWorkerStore } from '@/store/useWorkerStore';
import { ref } from 'vue';
import YearGraphView from './YearGraphView.vue';
import WorkerAmountView from './WorkerAmountView.vue';
import { useYearStore } from '@/store/useYearStore.ts';

const yearStore = useYearStore();

const yearGraphRef = ref<InstanceType<typeof YearGraphView>>();

const workerStore = useWorkerStore();
// workerStore.setWorkers(["Jean", "Marc", "Didier", "Paul", "Albert", "Samuel", "Frank", "Benoit"])

const selectedAmount = ref<{ worker: number, first: number, second: number }[]>([]);

function selectAllChild() {
    yearGraphRef.value?.selectAllChild();
}

function unselectAllChild() {
    yearGraphRef.value?.unselectAllChild();
}

function plan() {
    const workers = workerStore.getWorkerOnCall();
    const assistWorkers = workerStore.getWorkerHelper();

    selectedAmount.value = [];
    if (yearStore.yearGraph === undefined) return;
    let succeed = planGraph(yearStore.yearGraph, workers, assistWorkers, selectedAmount.value, 20);

    if (succeed) {
        // unselect all week items
        unselectAllChild();
    }
    else {
        // one or more week are not assigned
        alert("Une ou plusieur affection n'on pas aboutie !");
    }

    console.log(succeed, selectedAmount);
}

function save() {
    yearStore.saveYearGraph();
}

</script>

<template>
    <div class="menu">
        <div>
            <button class="button" @click="plan()">Plannifier</button>
            <button class="button" @click="save()">Sauvegarder</button>
        </div>
        <div>
            <button class="button" @click="selectAllChild()">Tous selectionner</button>
            <button class="button" @click="unselectAllChild()">Déselectionner</button>
        </div>
    </div>
    <div class="container">
        <YearGraphView ref="yearGraphRef" :year-graph="yearStore.yearGraph" />
        <WorkerAmountView :worker-amount="selectedAmount" />
    </div>

</template>

<style lang="css" scoped>
.menu {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 4px;
}

.button {
    background-color: grey;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    cursor: pointer;
}

.container {
    display: flex;
    justify-content: space-around;
    padding: 10px;
}
</style>