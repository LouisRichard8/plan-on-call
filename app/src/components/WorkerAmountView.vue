<script lang="ts" setup>
import { useWorkerStore } from '@/store/useWorkerStore';

const props = defineProps(['workerAmount']);

const workerStore = useWorkerStore();

</script>

<template>
    <table v-if="workerAmount.length > 0">
        <thead>
            <tr>
                <th>Nom</th>
                <th>Astreinte</th>
                <th>Soutient</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="worker in workerAmount" :key="worker.worker">
                <td>{{ workerStore.getWorkerById(worker.worker)?.name }}</td>
                <td>{{ worker.first }}</td>
                <td>{{ worker.second }}</td>
            </tr>
        </tbody>
    </table>
</template>