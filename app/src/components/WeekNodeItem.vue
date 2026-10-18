<script lang="ts" setup>
import { getWeekDateStringFromYear } from '@/core/utils/DateUtils';
import { useWorkerStore } from '@/store/useWorkerStore';
import { ref } from 'vue';

const props = defineProps(['weekNode', 'year']);

const workerStore = useWorkerStore();

const isSelected = ref(false);

function select() {
    isSelected.value = !isSelected.value;
    props.weekNode.needAssign(isSelected.value);
    console.log(props.weekNode);
}

</script>

<template>
    <tr @click="select();" :class="{ selected: isSelected }">
        <th>
            {{ getWeekDateStringFromYear(year, weekNode.id) }}
        </th>
        <th>
            {{ weekNode.choice < 0 ? 'Non défini' : workerStore.getWorkerById(weekNode.choice)?.name }} 
        </th>
        <th>
            {{ weekNode.secondChoice < 0 ? 'Non défini' : workerStore.getWorkerById(weekNode.secondChoice)?.name }}
        </th>
    </tr>
</template>

<style lang="css" scoped>
.selected {
    border: 2px solid rgb(153, 255, 255);
    background-color: rgb(197, 253, 253);
    color: white;
    text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
}
</style>
