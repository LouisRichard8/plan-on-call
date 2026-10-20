<script lang="ts" setup>
import { getWeekDateStringFromYear } from '@/core/utils/DateUtils';
import { useWorkerStore } from '@/store/useWorkerStore';
import { ref } from 'vue';

const props = defineProps(['weekNode', 'year']);

const workerStore = useWorkerStore();

const isSelected = ref(false);

function onMouseEnter(event: MouseEvent) {
    if (event.buttons != 1) return
    toggle();
}

function toggle() {
    if (isSelected.value) {
        unselect();
    }
    else {
        select();
    }
}

function select() {
    isSelected.value = true;
    props.weekNode.needAssign(true);
}

function unselect() {
    isSelected.value = false;
    props.weekNode.needAssign(false);
}

defineExpose({ select, unselect });

</script>

<template>
    <tr @mouseenter="onMouseEnter" @mousedown="toggle" :class="{ selected: isSelected }">
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
    border: 1px solid #a3c7f9;
    background-color: #c2dbff;
}
</style>
