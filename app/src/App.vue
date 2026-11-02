<script setup lang="ts">
import Header from './components/Header.vue';
import PlanningBoard from './components/PlanningBoard.vue';
import ManageWorkerView from './components/ManageWorkerView.vue';
import { computed, ref } from 'vue';
import ManageDB from './components/ManageDB.vue';

const routes = {
	'/': PlanningBoard,
	'/workers': ManageWorkerView,
	'/dbmanager' : ManageDB
}

const currentPath = ref(window.location.hash);

window.addEventListener('hashchange', () => {
	currentPath.value = window.location.hash
});

const currentView = computed(() => {
	const key = (currentPath.value.slice(1) || '/') as keyof typeof routes;
	return routes[key];
});

</script>

<template>
	<Header />
	<component :is="currentView"></component>
</template>

<style scoped></style>
