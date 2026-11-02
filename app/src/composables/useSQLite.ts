const worker = new Worker(new URL('../core/workers/worker.ts', import.meta.url), {
    type: 'module',
});

worker.onerror = (error) => {
    console.error('Worker failed silently:', error)
}

async function downloadDatabaseFile() {
    try {
        // Access the OPFS root directory
        const root = await navigator.storage.getDirectory()

        // Get handle to your database file (match the filename you used in OpfsDb)
        const fileHandle = await root.getFileHandle('mydb.sqlite3')

        // Convert handle to a downloadable Blob
        const file = await fileHandle.getFile()
        const blob = new Blob([file], { type: 'application/x-sqlite3' })

        // Create a temporary download link
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'backup-mydb.sqlite3'
        document.body.appendChild(a)
        a.click()

        // Clean up
        a.remove()
        URL.revokeObjectURL(url)
        console.log('Database downloaded successfully!')
    } catch (err) {
        console.error('Could not download database from OPFS:', err)
    }
}

export function useSQLite() {
    const executeQuery = async (sql: string, bind: unknown[] = []) => {
        const msgId = Math.random().toString(36).substring(7);
        return new Promise((resolve, reject) => {
            const handler = (e: MessageEvent) => {
                if (e.data.id === msgId) {
                    worker.removeEventListener('message', handler);
                    if (e.data.type === 'error') {
                        reject(e.data.error);
                    }
                    else {
                        resolve(e.data.result);
                    }
                }
            };
            worker.addEventListener('message', handler);
            worker.postMessage({ type: 'exec', id: msgId, sql, bind });
        });
    }

    const dropDatabase = async () => {
        const msgId = Math.random().toString(36).substring(7);
        return new Promise((resolve, reject) => {
            const handler = (e: MessageEvent) => {
                if (e.data.id === msgId) {
                    worker.removeEventListener('message', handler);
                    if (e.data.type === 'error') {
                        reject(e.data.error);
                    }
                    else {
                        resolve(e.data.result);
                    }
                }
            };
            worker.addEventListener('message', handler);
            worker.postMessage({ type: 'drop', id: msgId });
        });
    }

    return {
        executeQuery,
        dropDatabase,
    }
}