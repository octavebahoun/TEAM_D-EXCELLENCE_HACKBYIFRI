import { useState, useEffect, useCallback } from "react";
import { aiService } from "../services/aiService";
import { offlineStorage } from "../services/offlineStorage";


export function useAIHistory(type) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    // Indique si les données viennent du cache local 
    const [isOffline, setIsOffline] = useState(false);

    const refresh = useCallback(async () => {
        setLoading(true);
        try {
            const data = await aiService.getHistory(type);
            setItems(data.items || []);
            setIsOffline(false);
        } catch {
            const cached = await offlineStorage.getAll(type);
            if (cached.length > 0) {
                // Transforme les entrées IndexedDB au format attendu par les outils
                const offlineItems = cached.map((c) => ({
                    history_id: c.id,
                    service_type: type,
                    filename: c._filename || '',
                    result_id: c.id,
                    meta: c._meta || {},
                    created_at: c._savedAt || new Date().toISOString(),
                }));
                setItems(offlineItems);
                setIsOffline(true);
            } else {
                setItems([]);
                setIsOffline(false);
            }
        } finally {
            setLoading(false);
        }
    }, [type]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const addItem = useCallback((entry, result) => {
        setItems((prev) => [entry, ...prev]);

        if (result) {
            offlineStorage.save(type, entry.result_id, {
                ...result,
                _filename: entry.filename,
                _meta: entry.meta,
            });
        }
    }, [type]);


    const removeItem = useCallback(async (historyId) => {
        setItems((prev) => prev.filter((e) => e.history_id !== historyId));

        offlineStorage.delete(type, historyId);
        try {
            await aiService.deleteHistoryItem(historyId);
        } catch {
            refresh();
        }
    }, [type, refresh]);

    const clearAll = useCallback(async () => {
        const previous = items;
        setItems([]);
        offlineStorage.clear(type);
        try {
            await aiService.clearHistory(type);
        } catch {
            setItems(previous);
        }
    }, [items, type]);

    return { items, loading, isOffline, addItem, removeItem, clearAll, refresh };
}
