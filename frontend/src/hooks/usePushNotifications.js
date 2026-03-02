

import { useState, useEffect, useCallback } from 'react';
import { pushNotificationService } from '../services/pushNotificationService';

const LS_KEY = 'academix_push_subscribed';

export function usePushNotifications() {

    const [permission, setPermission] = useState('default'); // 'default'|'granted'|'denied'
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const isSupported = pushNotificationService.isSupported();

    useEffect(() => {
        if (!isSupported) return;

        // Lire la permission actuelle
        setPermission(pushNotificationService.getPermissionState());

        const stored = localStorage.getItem(LS_KEY);
        if (stored === 'true' && Notification.permission === 'granted') {
            setIsSubscribed(true);
        }
    }, [isSupported]);

    const canSubscribe = isSupported &&
        permission !== 'denied' &&
        !isSubscribed;

    const subscribe = useCallback(async () => {
        if (!isSupported || isLoading) return;

        setIsLoading(true);
        setError(null);

        try {
            const perm = await pushNotificationService.requestPermission();
            setPermission(perm);

            if (perm !== 'granted') {
                // L'utilisateur a refusé ou laissé "default"
                setError(perm === 'denied'
                    ? 'Tu as bloqué les notifications. Tu peux les activer dans les paramètres du navigateur.'
                    : null
                );
                return;
            }

            // 2. Créer l'abonnement et l'envoyer au serveur
            const result = await pushNotificationService.subscribe();

            if (result.success) {
                setIsSubscribed(true);
                localStorage.setItem(LS_KEY, 'true');
            } else {
                setError(result.error || "L'abonnement a échoué");
            }
        } catch (err) {
            console.error('[Push] Erreur abonnement:', err);
            setError("Une erreur est survenue lors de l'abonnement aux notifications");
        } finally {
            setIsLoading(false);
        }
    }, [isSupported, isLoading]);

    const unsubscribe = useCallback(async () => {
        if (!isSupported || isLoading) return;

        setIsLoading(true);
        setError(null);

        try {
            const ok = await pushNotificationService.unsubscribe();
            if (ok) {
                setIsSubscribed(false);
                localStorage.removeItem(LS_KEY);
            }
        } catch (err) {
            console.error('[Push] Erreur désabonnement:', err);
            setError('Impossible de se désabonner');
        } finally {
            setIsLoading(false);
        }
    }, [isSupported, isLoading]);

    return {
        isSupported,
        isSubscribed,
        isLoading,
        permission,
        canSubscribe,
        error,
        subscribe,
        unsubscribe,
    };
}
