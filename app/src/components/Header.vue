<script lang="ts" setup>
import { useYearStore } from '@/store/useYearStore';


const yearStore = useYearStore();

function changeYear(offset: number) {
    yearStore.setYear(yearStore.year + offset)
}

</script>

<template>
    <div class="title">
        <h1>Planning astreinte</h1>
        <div>
            <button @click="changeYear(- 1)"><</button>
            {{ yearStore.year }}
            <button @click="changeYear(1)">></button>
        </div>
        <div>
            <a href="#/" class="button">Planning</a>
            <a href="#/workers" class="button">Employers</a>
        </div>
    </div>
</template>

<style lang="css" scoped>
.title {
    font-family: sans-serif;
    font-size: 1.2rem;
    background-color: cadetblue;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 10px 0px 10px;
}

.button {
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    cursor: pointer;
}
</style>