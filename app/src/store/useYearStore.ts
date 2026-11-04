import { useSQLite } from "@/composables/useSQLite";
import { YearGraph } from "@/core/models/YearGraph";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useWorkerStore } from "./useWorkerStore";

export const useYearStore = defineStore('year', () => {
    const { executeQuery } = useSQLite();
    const workerStore = useWorkerStore();
    
    const yearGraph = ref<YearGraph>();
    const year = ref(0);

    function setYear(newYear: number) {
        year.value = newYear;
        fetchYearGraph(year.value);
    }

    function fetchYearGraph(year: number) {
        executeQuery('SELECT * FROM yearGraph WHERE year = (?);', [year]).then(yearRows => {
            console.log(yearRows);
            if (!(yearRows instanceof Array)) return
            if (yearRows.length == 0) {
                addYearGraph(year);
            }
            else {
                executeQuery('SELECT * FROM assignment WHERE year = (?);', [yearRows[0].id]).then(weeks => {
                    console.log(weeks);
                    if (!(weeks instanceof Array)) return
                    yearGraph.value = new YearGraph(yearRows[0].id, year);
                    weeks.forEach(week => {
                        const weekNode = yearGraph.value?.weekNodes[week.week];
                        if (weekNode !== undefined) {
                            weekNode.choice = week.on_call;
                            weekNode.secondChoice = week.helper;
                        }
                    })
                    workerStore.fetchWorkers();
                })
            }
        })
    }

    function addYearGraph(year: number) {
        executeQuery('INSERT INTO yearGraph (year, complete) VALUES ((?), 0);', [year]).then(() => fetchYearGraph(year));
    }

    function saveYearGraph() {
        let sql = '';
        yearGraph.value?.weekNodes.forEach(week => {
            sql += 'INSERT INTO assignment (year, week, on_call, helper) VALUES (' + yearGraph.value?.id +', ' + week.id + ', ' + week.choice + ', ' + week.secondChoice + ');';
        })
        executeQuery(sql);
    }

    return {
        yearGraph,
        year,
        setYear,
        fetchYearGraph,
        saveYearGraph,
    }
})