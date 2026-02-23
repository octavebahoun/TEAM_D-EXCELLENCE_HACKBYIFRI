import { laravelApiClient } from '../api/client';

export const adminService = {
    // Départements
    getDepartements: async () => {
        const response = await laravelApiClient.get('/admin/departements');
        return response.data;
    },

    getDepartement: async (id) => {
        const response = await laravelApiClient.get(`/admin/departements/${id}`);
        return response.data;
    },

    getDepartementStats: async (id) => {
        const response = await laravelApiClient.get(`/admin/departements/${id}/stats`);
        return response.data;
    },

    createDepartement: async (data) => {
        const response = await laravelApiClient.post('/admin/departements', data);
        return response.data;
    },

    updateDepartement: async (id, data) => {
        const response = await laravelApiClient.put(`/admin/departements/${id}`, data);
        return response.data;
    },

    deleteDepartement: async (id) => {
        const response = await laravelApiClient.delete(`/admin/departements/${id}`);
        return response.data;
    },

    // Chefs de Département
    getChefs: async () => {
        const response = await laravelApiClient.get('/admin/chefs-departement');
        return response.data;
    },

    getChef: async (id) => {
        const response = await laravelApiClient.get(`/admin/chefs-departement/${id}`);
        return response.data;
    },

    createChef: async (data) => {
        const response = await laravelApiClient.post('/admin/chefs-departement', data);
        return response.data;
    },

    updateChef: async (id, data) => {
        const response = await laravelApiClient.put(`/admin/chefs-departement/${id}`, data);
        return response.data;
    },

    deleteChef: async (id) => {
        const response = await laravelApiClient.delete(`/admin/chefs-departement/${id}`);
        return response.data;
    },

    toggleChefStatus: async (id) => {
        const response = await laravelApiClient.post(`/admin/chefs-departement/${id}/toggle`);
        return response.data;
    },

    // Statistiques
    getGlobalStats: async () => {
        const response = await laravelApiClient.get('/admin/stats/global');
        return response.data;
    },

    getDashboardStats: async () => {
        const response = await laravelApiClient.get('/admin/stats/dashboard');
        return response.data;
    },

    // Matières (CRUD)
    getMatieres: async (params = {}) => {
        const response = await laravelApiClient.get('/admin/matieres', { params });
        return response.data;
    },

    getMatiere: async (id) => {
        const response = await laravelApiClient.get(`/admin/matieres/${id}`);
        return response.data;
    },

    createMatiere: async (data) => {
        const response = await laravelApiClient.post('/admin/matieres', data);
        return response.data;
    },

    updateMatiere: async (id, data) => {
        const response = await laravelApiClient.put(`/admin/matieres/${id}`, data);
        return response.data;
    },

    deleteMatiere: async (id) => {
        const response = await laravelApiClient.delete(`/admin/matieres/${id}`);
        return response.data;
    },

    // Notes (CRUD)
    getNotes: async (params = {}) => {
        const response = await laravelApiClient.get('/admin/notes', { params });
        return response.data;
    },

    getNote: async (id) => {
        const response = await laravelApiClient.get(`/admin/notes/${id}`);
        return response.data;
    },

    createNote: async (data) => {
        const response = await laravelApiClient.post('/admin/notes', data);
        return response.data;
    },

    updateNote: async (id, data) => {
        const response = await laravelApiClient.put(`/admin/notes/${id}`, data);
        return response.data;
    },

    deleteNote: async (id) => {
        const response = await laravelApiClient.delete(`/admin/notes/${id}`);
        return response.data;
    },

    // Emploi du temps
    getEmploiTempsByFiliere: async (filiereId, params = {}) => {
        const response = await laravelApiClient.get(`/admin/emploi-temps/filieres/${filiereId}`, { params });
        return response.data;
    },

    getEmploiTemps: async (params = {}) => {
        const response = await laravelApiClient.get('/admin/emploi-temps', { params });
        return response.data;
    },

    getEmploiTempsItem: async (id) => {
        const response = await laravelApiClient.get(`/admin/emploi-temps/${id}`);
        return response.data;
    },

    createEmploiTemps: async (data) => {
        const response = await laravelApiClient.post('/admin/emploi-temps', data);
        return response.data;
    },

    updateEmploiTemps: async (id, data) => {
        const response = await laravelApiClient.put(`/admin/emploi-temps/${id}`, data);
        return response.data;
    },

    deleteEmploiTemps: async (id) => {
        const response = await laravelApiClient.delete(`/admin/emploi-temps/${id}`);
        return response.data;
    },
};
