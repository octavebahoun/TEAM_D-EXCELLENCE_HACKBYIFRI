import { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import { syncQueue } from '../services/syncQueue';
import { studentService } from '../services/studentService';
import { useNetworkStatus } from './useNetworkStatus';


const HANDLERS = {
    createTache: (p) => studentService.createTache(p),
    updateTache: (p) => studentService.updateTache(p.id, p.data),
    deleteTache: (p) => studentService.deleteTache(p.id),
    completeTache: (p) => studentService.completeTache(p.id),
};

export function useSyncQueue() {
    const { isOnline } = useNetworkStatus();
    const [pendingCount, setPendingCount] = useState(0);


    const isSyncing = useRef(false);

    const refreshCount = useCallback(async () => {
        const count = await syncQueue.count();
        setPendingCount(count);
    }, []);

    useEffect(() => {
        let cancelled = false;
        syncQueue.count().then((c) => {
            if (!cancelled) setPendingCount(c);
        });
        return () => { cancelled = true; };
    }, []);


    const runSync = useCallback(async () => {
        if (isSyncing.current) return;
        isSyncing.current = true;

        const ops = await syncQueue.getAll();
        if (ops.length === 0) {
            isSyncing.current = false;
            return;
        }

        // Toast de démarrage discret
        const toastId = toast.loading(
            `Synchronisation de ${ops.length} action(s) en attente…`
        );

        let successCount = 0;
        let failCount = 0;

        for (const op of ops) {
            const handler = HANDLERS[op.type];

            if (!handler) {
                // Type inconnu : on retire l'op pour ne pas bloquer la queue
                await syncQueue.remove(op.id);
                continue;
            }

            try {
                await handler(op.payload);
                await syncQueue.remove(op.id);
                successCount++;
            } catch (err) {
                await syncQueue.incrementRetry(op.id);
                failCount++;
                console.warn(`[useSyncQueue] Échec de l'op "${op.type}" :`, err);
            }
        }

        if (failCount === 0) {
            toast.success(
                successCount === 1
                    ? `1 action synchronisée avec succès ✓`
                    : `${successCount} actions synchronisées avec succès ✓`,
                { id: toastId, duration: 4000 }
            );
        } else if (successCount === 0) {
            toast.error(
                `Échec de la synchronisation — ${failCount} action(s) non envoyée(s)`,
                { id: toastId, duration: 5000 }
            );
        } else {
            // Sync partielle
            toast(
                `${successCount} synchronisée(s) · ${failCount} en erreur`,
                { id: toastId, icon: '⚠️', duration: 5000 }
            );
        }

        await refreshCount();
        isSyncing.current = false;
    }, [refreshCount]);

    const prevIsOnlineRef = useRef(isOnline);

    useEffect(() => {
        const wasOffline = prevIsOnlineRef.current === false;
        const isNowOnline = isOnline === true;

        if (wasOffline && isNowOnline) {
            const timer = setTimeout(runSync, 1000);
            prevIsOnlineRef.current = isOnline;
            return () => clearTimeout(timer);
        }

        prevIsOnlineRef.current = isOnline;
    }, [isOnline, runSync]);

    return { pendingCount, refreshCount };
}
