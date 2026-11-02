<script setup lang="ts">
import { useSQLite } from '@/composables/useSQLite';
import { computed, ref, watch } from 'vue';

const { executeQuery, dropDatabase } = useSQLite();

const tables = [
    {
        value: 'yearGraph',
        id: 0
    },
    {
        value: 'worker',
        id: 1
    },
    {
        value: 'availabality',
        id: 2
    },
    {
        value: 'assignment',
        id: 3
    }
];
const selectedID = ref(0);
const tableDisplay = ref([]);

watch(selectedID, async () => {
    fetchTable();
})

function fetchTable() {
    executeQuery('SELECT * FROM ' + tables[selectedID.value]?.value + ';').then(rows => {
        console.log(rows);
        tableDisplay.value = rows as [];
    });
}
fetchTable();

function deleteTable() {
    executeQuery('DELETE FROM ' + tables[selectedID.value]?.value + ';').then(() => fetchTable());
}

function dropDatabse() {
    dropDatabase().then(() => fetchTable());
}

function deleteFromID(id: number) {
    executeQuery('DELETE FROM ' + tables[selectedID.value]?.value + ' WHERE id = (?);', [id]).then(() => fetchTable());
}

</script>

<template>
    <div>
        <label for="tableSelect">Table : </label>
        <select id="tableSelect" v-model="selectedID">
            <option v-for="table in tables" :key="table.id" :value="table.id">
                {{ table.value }}
            </option>
        </select>
        <button class="button" @click="deleteTable()">Delete Table</button>
        <button class="button" @click="dropDatabse()">Drop Database</button>
    </div>
    <span v-if="tableDisplay.length == 0">No data in table</span>
    <table>
        <thead>
            <tr>
                <td v-for="column in Object.keys(tableDisplay[0] ?? {})">
                    {{ column }}
                </td>
            </tr>
        </thead>
        <tbody>
            <tr v-for="row in tableDisplay">
                <td v-for="column in Object.values(row)">
                    {{ column }}
                </td>
                <td><button @click="deleteFromID(Object.values(row)[0] as number)">Supprimer</button></td>
            </tr>
        </tbody>
    </table>

</template>