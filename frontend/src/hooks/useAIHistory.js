import { useState, useEffect, useCallback } from "react";
import { aiService } from "../services/aiService";

/**
 * Hook pour gérer l'historique IA par type de service.
 * @param {string} type - "summary" | "quiz" | "exercise" | "podcast" | "image" | "chat"
 */
export function useAIHistory(type) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        setLoading(true);
        try {
            const data = await aiService.getHistory(type);
            setItems(data.items || []);
        } catch {
            // Silencieux — l'historique ne bloque pas l'outil
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, [type]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    /**
     * Ajout optimiste d'une entrée (après génération réussie).
     * @param {object} entry
     */
    const addItem = useCallback((entry) => {
        setItems((prev) => [entry, ...prev]);
    }, []);

    /**
     * Suppression optimiste puis appel API.
     * @param {string} historyId
     */
    const removeItem = useCallback(async (historyId) => {
        setItems((prev) => prev.filter((e) => e.history_id !== historyId));
        try {
            await aiService.deleteHistoryItem(historyId);
        } catch {
            // Re-fetch si l'API échoue
            refresh();
        }
    }, [refresh]);

    /**
     * Vide tout l'historique du type.
     */
    const clearAll = useCallback(async () => {
        const previous = items;
        setItems([]);
        try {
            await aiService.clearHistory(type);
        } catch {
            setItems(previous);
        }
    }, [items, type]);

    return { items, loading, addItem, removeItem, clearAll, refresh };
}
