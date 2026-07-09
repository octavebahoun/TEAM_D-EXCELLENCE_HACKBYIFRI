import { laravelApiClient } from '../api/client';

/**
 * Service du tableau de bord professeur (données Laravel).
 */
export const professeurService = {
    // Statistiques d'en-tête : { matieres, etudiants, communications }
    stats: async () => {
        const { data } = await laravelApiClient.get('/professeur/stats');
        return data;
    },
};
