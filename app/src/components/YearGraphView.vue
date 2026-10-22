<script setup lang="ts">
import { YearGraph } from '@/core/models/YearGraph';
import { ref } from 'vue';
import WeekNodeItem from './WeekNodeItem.vue';

const props = defineProps({yearGraph: YearGraph});

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

defineExpose({
    selectAllChild,
    unselectAllChild
});

</script>

<template>
    <table>
        <thead>
            <th>Semaine</th>
            <th>Technicien <br /> d'astreinte</th>
            <th>Soutient</th>
        </thead>
        <tbody>
            <WeekNodeItem ref="childRefs" v-for="weekNode in props.yearGraph?.weekNodes" :key="weekNode.id"
                :week-node="weekNode" :year="props.yearGraph?.year" />
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

</style>
