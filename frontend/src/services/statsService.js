import { laravelApiClient } from '../api/client';

/**
 * Services statistiques (Laravel)
 * NB: Les routes sont réparties selon le rôle (admin vs chef).
 */
export const statsService = {
    // Admin uniquement (super_admin)
    getGlobal: async () => {
        const response = await laravelApiClient.get('/admin/stats/global');
        return response.data;
    },

    getAdminDashboard: async () => {
        const response = await laravelApiClient.get('/admin/stats/dashboard');
        return response.data;
    },

    // Admin/chef (selon backend, /departement/dashboard est réservé chef)
    getDepartementDashboard: async () => {
        const response = await laravelApiClient.get('/departement/dashboard');
        return response.data;
    },
};
