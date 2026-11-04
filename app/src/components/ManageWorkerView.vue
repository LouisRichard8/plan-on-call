<script setup lang="ts">
import { useWorkerStore } from '@/store/useWorkerStore';
import { ref } from 'vue';

const workerStore = useWorkerStore();

const name = ref<string>('');

function addWorker() {
    workerStore.addWorker(name.value);
}

function deleteWorker(id: number) {
    workerStore.removeWorker(id);
}

function toggleOnCall(id: number) {
    const worker = workerStore.getWorkerById(id);
    workerStore.setIsOnCall(id, !worker?.isOnCall);
}

function toggleHelper(id: number) {
    const worker = workerStore.getWorkerById(id);
    workerStore.setIsHelper(id, !worker?.isHelper);
}

</script>

<template>
    <div class="container">
        <div>
            <form @submit="addWorker()"">
                <label for="name">Nom : </label>
                <input type="text" id="name" v-model="name">
                <input type="submit" value="Ajouter">
            </form>
            <table>
                <thead>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Astreinte</th>
                    <th>Soutient</th>
                </thead>
                <tbody>
                    <tr v-for="worker in workerStore.workerList" :key="worker.id">
                        <td>{{ worker.id }}</td>
                        <td>{{ worker.name }}</td>
                        <td>
                            <input type="checkbox" :id="'isOnCall' + worker.id" @click="toggleOnCall(worker.id)"
                                :checked="worker.isOnCall">
                            <label :for="'isOnCall' + worker.id">{{ worker.isOnCall ? 'Oui' : 'Non' }}</label>
                        </td>
                        <td>
                            <input type="checkbox" :id="'isHelper' + worker.id" @click="toggleHelper(worker.id)"
                                :checked="worker.isHelper">
                            <label :for="'isHelper' + worker.id">{{ worker.isHelper ? 'Oui' : 'Non' }}</label>
                        </td>
                        <td><button @click="deleteWorker(worker.id)">Supprimer</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style lang="css" scoped>
.container {
    display: flex;
    justify-content: space-around;
    padding: 10px;
}
</style>