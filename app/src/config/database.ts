export const databaseConfig = {
    filename: 'mydb.sqlite3',
    tables: {
        worker: {
            name: 'worker',
            schema: `
                CREATE TABLE IF NOT EXISTS worker (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL
                );
            `,
        },
        yearGraph: {
            name: 'yearGraph',
            schema: `
                CREATE TABLE IF NOT EXISTS yearGraph (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                year INTEGER NOT NULL,
                complete INTEGER NOT NULL
                );
            `,
        },
        assignment: {
            name: 'assignment',
            schema: `
                CREATE TABLE IF NOT EXISTS assignment (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                year INTEGER NOT NULL,
                week INTEGER NOT NULL,
                on_call INTEGER NOT NULL,
                helper INTEGER NOT NULL,
                FOREIGN KEY(year) REFERENCES yearGraph(id)
                FOREIGN KEY(on_call) REFERENCES worker(id)
                FOREIGN KEY(helper) REFERENCES worker(id)
                );
            `,
        },
        availabality: {
            name: 'availabality',
            schema: `
                CREATE TABLE IF NOT EXISTS availabality (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                year INTEGER NOT NULL,
                worker INTEGER NOT NULL,
                on_call INTEGER NOT NULL,
                helper INTEGER NOT NULL,
                FOREIGN KEY(year) REFERENCES yearGraph(id)
                FOREIGN KEY(worker) REFERENCES worker(id)
                );
            `,
        },
    },
} as const