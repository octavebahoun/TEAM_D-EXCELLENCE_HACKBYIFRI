import { openDB } from 'idb';


const DB_NAME = 'academix-sync-queue';
const DB_VERSION = 1;
const STORE_NAME = 'pending-operations';

function getDB() {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                // keyPath: 'id' → la propriété "id" de chaque opération sert de clé
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        },
    });
}
function generateId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}


export const syncQueue = {
    async enqueue(type, payload) {
        const operation = {
            id: generateId(),
            type,
            payload,
            enqueuedAt: new Date().toISOString(),
            retries: 0,
        };

        try {
            const db = await getDB();
            await db.put(STORE_NAME, operation);
        } catch (err) {
            console.warn('[syncQueue] enqueue() failed :', err);
        }

        return operation;
    },

    async getAll() {
        try {
            const db = await getDB();
            const ops = await db.getAll(STORE_NAME);
            return ops.sort((a, b) => new Date(a.enqueuedAt) - new Date(b.enqueuedAt));
        } catch (err) {
            console.warn('[syncQueue] getAll() failed :', err);
            return [];
        }
    },


    async count() {
        try {
            const db = await getDB();
            return db.count(STORE_NAME);
        } catch {
            return 0;
        }
    },


    async remove(id) {
        try {
            const db = await getDB();
            await db.delete(STORE_NAME, id);
        } catch (err) {
            console.warn('[syncQueue] remove() failed :', err);
        }
    },

    async incrementRetry(id) {
        try {
            const db = await getDB();
            const op = await db.get(STORE_NAME, id);
            if (op) {
                await db.put(STORE_NAME, { ...op, retries: (op.retries || 0) + 1 });
            }
        } catch (err) {
            console.warn('[syncQueue] incrementRetry() failed :', err);
        }
    },

    async clear() {
        try {
            const db = await getDB();
            await db.clear(STORE_NAME);
        } catch (err) {
            console.warn('[syncQueue] clear() failed :', err);
        }
    },
};
