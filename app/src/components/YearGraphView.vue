<script setup lang="ts">
import { YearGraph } from '@/core/models/YearGraph';
import { ref } from 'vue';
import WeekNodeItem from './WeekNodeItem.vue';
import { planGraph } from '@/core/utils/GraphUtils.ts';
import { useWorkerStore } from '@/store/useWorkerStore.ts';

const yearGraph = ref(new YearGraph(2026));
yearGraph.value.createWeeks(12, 3);

const workerStore = useWorkerStore();
workerStore.setWorkers(["Jean", "Marc", "Didier", "Paul", "Albert", "Samuel", "Frank", "Benoit"])

const childRefs = ref<InstanceType<typeof WeekNodeItem>[] | null>([]);

function selectAllChild() {
    childRefs.value?.forEach(child => {
        child.select();
    });
}

function unselectAllChild() {
    childRefs.value?.forEach(child => {
        child.unselect();
    });
}

function plan() {
    const workers = workerStore.getWorkerOnCall();
    const assistWorkers = workerStore.getWorkerHelper();

    let selectedAmount: { worker: number, first: number, second: number }[] = [];

    let succeed = planGraph(yearGraph.value, workers, assistWorkers, selectedAmount, 20);

    if (succeed) {
        // unselect all week items
        unselectAllChild();
    }

    console.log(succeed, selectedAmount);
}

</script>

<template>
    <button @click="plan()">Plannifier</button>
    <button @click="selectAllChild()">Tous selectionner</button>
    <button @click="unselectAllChild()">Déselectionner</button>
    <table>
        <thead>
            <th>Semaine</th>
            <th>Technicien <br /> d'Astreinte</th>
            <th>Soutient</th>
        </thead>
        <tbody>
            <WeekNodeItem ref="childRefs" v-for="weekNode in yearGraph.weekNodes" :key="weekNode.id"
                :week-node="weekNode" :year="yearGraph.year" />
        </tbody>
    </table>
</template>

<style lang="css">
table {
    border-collapse: collapse;
    border: 2px solid rgb(140 140 140);
    font-family: sans-serif;
    font-size: 0.8rem;
    letter-spacing: 1px;
}

th,
td {
    border: 1px solid rgb(160 160 160);
    padding: 8px 10px;
    user-select: none;
}

td {
    text-align: center;
}

div {
    padding-bottom: 10px;
}
</style>
