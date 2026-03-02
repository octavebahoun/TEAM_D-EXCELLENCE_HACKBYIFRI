import { laravelApiClient } from '../api/client';
import { syncQueue } from './syncQueue';

export const studentService = {
    getProfil: async () => {
        const response = await laravelApiClient.get('/student/profil');
        return response.data;
    },

    getMoyennes: async () => {
        const response = await laravelApiClient.get('/student/moyennes');
        return response.data;
    },

    getNotes: async (params = {}) => {
        const response = await laravelApiClient.get('/student/notes', { params });
        return response.data;
    },

    getEmploiTemps: async (params = {}) => {
        const response = await laravelApiClient.get('/student/emploi-temps', { params });
        return response.data;
    },

    getTaches: async (params = {}) => {
        const response = await laravelApiClient.get('/student/taches', { params });
        return response.data;
    },

    createTache: async (data) => {

        if (!navigator.onLine) {
            const op = await syncQueue.enqueue('createTache', data);
            return {
                id: `offline-${op.id}`,
                ...data,
                statut: 'a_faire',
                _offline: true,
                _syncId: op.id,
            };
        }
        const response = await laravelApiClient.post('/student/taches', data);
        return response.data;
    },

    getTache: async (id) => {
        const response = await laravelApiClient.get(`/student/taches/${id}`);
        return response.data;
    },

    updateTache: async (id, data) => {
        if (!navigator.onLine) {
            await syncQueue.enqueue('updateTache', { id, data });
            return { id, ...data, _offline: true };
        }
        const response = await laravelApiClient.put(`/student/taches/${id}`, data);
        return response.data;
    },

    deleteTache: async (id) => {
        if (!navigator.onLine) {
            await syncQueue.enqueue('deleteTache', { id });
            return { success: true, _offline: true };
        }
        const response = await laravelApiClient.delete(`/student/taches/${id}`);
        return response.data;
    },

    completeTache: async (id) => {
        if (!navigator.onLine) {
            await syncQueue.enqueue('completeTache', { id });
            return { id, statut: 'terminee', _offline: true };
        }
        const response = await laravelApiClient.patch(`/student/taches/${id}/complete`);
        return response.data;
    },

    // Alertes
    getAlertes: async (params = {}) => {
        const response = await laravelApiClient.get('/student/alertes', { params });
        return response.data;
    },

    markAlerteAsRead: async (id) => {
        const response = await laravelApiClient.patch(`/student/alertes/${id}/read`);
        return response.data;
    },

    // Analyse IA
    triggerAnalysis: async () => {
        const response = await laravelApiClient.get('/student/analysis');
        return response.data;
    },

    getAnalysisHistory: async () => {
        const response = await laravelApiClient.get('/student/analysis/history');
        return response.data;
    },

    markAnalysisAsSent: async (id) => {
        const response = await laravelApiClient.post(`/student/analysis/mark-sent/${id}`);
        return response.data;
    },

    // Google OAuth
    getGoogleAuthUrl: async () => {
        const response = await laravelApiClient.get('/auth/google/redirect');
        return response.data;
    },

    updateProfil: async (data) => {
        const response = await laravelApiClient.put('/student/profil', data);
        return response.data;
    },
};
