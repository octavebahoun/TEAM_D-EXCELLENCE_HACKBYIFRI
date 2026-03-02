import { useState, useEffect } from 'react';

export function useNetworkStatus() {
    // Initialisation avec l'état réseau réel au moment du montage du composant
    const [isOnline, setIsOnline] = useState(
        typeof navigator !== 'undefined' ? navigator.onLine : true
    );
    // Flag éphémère : vrai pendant 3s après le retour de connexion
    const [justReconnected, setJustReconnected] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setJustReconnected(true);
            // On réinitialise le flag après 3 secondes
            const timer = setTimeout(() => setJustReconnected(false), 3000);

            return () => clearTimeout(timer);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setJustReconnected(false);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []); // [] = s'exécute une seule fois au montage

    return {
        isOnline,
        isOffline: !isOnline,
        justReconnected,
    };
}
