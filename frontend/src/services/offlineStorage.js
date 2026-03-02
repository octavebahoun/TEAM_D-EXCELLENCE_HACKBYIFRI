import { openDB } from 'idb';

const DB_NAME = 'academix-offline';
const DB_VERSION = 1;

const STORES = {
    summary: 'summaries',
    quiz: 'quizzes',
    exercise: 'exercises',
    podcast: 'podcasts',
};

function getDB() {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            // Crée chaque object store si absent
            // keyPath: 'id' ,  la propriété "id" de chaque objet sert de clé primaire
            Object.values(STORES).forEach((storeName) => {
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName, { keyPath: 'id' });
                }
            });
        },
    });
}


export const offlineStorage = {
    async save(type, id, data) {
        const storeName = STORES[type];
        if (!storeName) return;

        try {
            const db = await getDB();
            // On s'assure que la propriété `id` est bien présente sur l'objet
            await db.put(storeName, {
                ...data,
                id,                                         // clé primaire explicite
                _savedAt: new Date().toISOString(),         // horodatage de mise en cache
            });
        } catch (err) {
            // On ne bloque jamais l'UI si l'écriture IndexedDB échoue
            console.warn('[offlineStorage] save() failed :', err);
        }
    },

    async get(type, id) {
        const storeName = STORES[type];
        if (!storeName) return undefined;

        try {
            const db = await getDB();
            return db.get(storeName, id);
        } catch (err) {
            console.warn('[offlineStorage] get() failed :', err);
            return undefined;
        }
    },

    async getAll(type) {
        const storeName = STORES[type];
        if (!storeName) return [];

        try {
            const db = await getDB();
            const items = await db.getAll(storeName);

            // Tri décroissant par date de sauvegarde
            return items.sort((a, b) =>
                new Date(b._savedAt) - new Date(a._savedAt)
            );
        } catch (err) {
            console.warn('[offlineStorage] getAll() failed :', err);
            return [];
        }
    },

    async delete(type, id) {
        const storeName = STORES[type];
        if (!storeName) return;

        try {
            const db = await getDB();
            await db.delete(storeName, id);
        } catch (err) {
            console.warn('[offlineStorage] delete() failed :', err);
        }
    },

    async clear(type) {
        const storeName = STORES[type];
        if (!storeName) return;

        try {
            const db = await getDB();
            await db.clear(storeName);
        } catch (err) {
            console.warn('[offlineStorage] clear() failed :', err);
        }
    },
};
