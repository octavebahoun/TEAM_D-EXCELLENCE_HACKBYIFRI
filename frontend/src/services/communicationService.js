import { laravelApiClient } from '../api/client';

/**
 * Service de communications de classe (transmission d'infos + supports de cours).
 * `scope` = 'professeur' | 'responsable' | 'departement' | 'student' (selon le profil connecté).
 */
export const communicationService = {
    // Liste paginée : renvoie l'objet Laravel { data: [...], ... }
    list: async (scope, params = {}) => {
        const { data } = await laravelApiClient.get(`/${scope}/communications`, { params });
        return data;
    },

    // Création (gère un fichier support via multipart/form-data)
    create: async (scope, payload) => {
        const form = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                form.append(key, value);
            }
        });
        const { data } = await laravelApiClient.post(`/${scope}/communications`, form, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    },

    remove: async (scope, id) => {
        const { data } = await laravelApiClient.delete(`/${scope}/communications/${id}`);
        return data;
    },

    // Filières que l'utilisateur peut cibler (pour le sélecteur de publication)
    filieres: async (scope = 'professeur') => {
        const { data } = await laravelApiClient.get(`/${scope}/filieres`);
        return data;
    },
};
