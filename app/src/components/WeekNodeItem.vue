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
}

function unselect() {
    if (isSelected.value) {
        select();
    }
}

defineExpose({ unselect });

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
    border: 2px solid #a3c7f9;
    background-color: #c2dbff;
}
</style>
