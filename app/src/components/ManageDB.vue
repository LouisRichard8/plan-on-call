<script setup lang="ts">
import { useSQLite } from '@/composables/useSQLite';
import { ref } from 'vue';

const { executeQuery, dropDatabase } = useSQLite();

const dev_db = ref(false);

function logWorkers() {
    executeQuery('SELECT * FROM worker;').then(rows => console.log(rows));
}

function deleteWorkers() {
    executeQuery('DELETE FROM worker;');
}

function logAvailabality() {
    executeQuery('SELECT * FROM availabality;').then(rows => console.log(rows));
}

function deleteAvailabality() {
    executeQuery('DELETE FROM availabality;');
}

function dropDatabse() {
    dropDatabase();
}

</script>

<template>
    <div>
        <label for="dev">Dev DB</label>
        <input type="checkbox" v-model="dev_db" id="dev">
        <div v-if="dev_db">
            <button class="button" @click="logWorkers()">Workers</button>
            <button class="button" @click="deleteWorkers()">Delete all workers</button>
            <button class="button" @click="logAvailabality()">Availabality</button>
            <button class="button" @click="deleteAvailabality()">Delete all availabality</button>
            <button class="button" @click="dropDatabse()">Drop Database</button>
        </div>
    </div>
</template>