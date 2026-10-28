import { databaseConfig } from '@/config/database';
import sqlite3InitModule, { type Database } from '@sqlite.org/sqlite-wasm';

let db: Database | null = null;

async function initDatabase() {
    if (db !== null) return;
    try {
        const sqlite3 = await sqlite3InitModule();
        const db = new sqlite3.oo1.OpfsDb(databaseConfig.filename, 'ct');

        // creation of database tables
        db.exec(databaseConfig.tables.worker.schema);

        self.postMessage({ type: 'ready' });
    } catch (err: any) {
        self.postMessage({ type: 'init-error', message: err.message });
    }
}

async function closeDatabase() {
    db?.close();
    self.postMessage({ type: 'closed' });
}

async function exec(id: string, sql: string, bind: []) {
    // init database if not already opened
    await initDatabase();
    try {
        const rows: any = [];
        db?.exec({
            sql,
            bind,
            rowMode: 'object',
            callback: (row) => rows.push(row)
        });
        self.postMessage({ type: 'success', id, result: rows });
    } catch (err: any) {
        self.postMessage({ type: 'error', id, error: err.message });
    }
}

self.onmessage = ({ data }) => {
    console.log(data)
    const { type, id, sql, bind } = data;
    if (type === 'start') {
        initDatabase();
    }
    else if (type === 'stop') {
        closeDatabase();
    }
    else if (type === 'exec') {
        exec(id, sql, bind);
    }
};
