import { laravelApiClient } from '../api/client';

/**
 * Services pour les endpoints /api/v1/departement/*
 * (Chef de département / Admin propriétaire du département)
 */
export const departementService = {
    // Matières (CRUD)
    getMatieres: async (params = {}) => {
        const response = await laravelApiClient.get('/departement/matieres', { params });
        return response.data;
    },

    getMatiere: async (id) => {
        const response = await laravelApiClient.get(`/departement/matieres/${id}`);
        return response.data;
    },

    createMatiere: async (data) => {
        const response = await laravelApiClient.post('/departement/matieres', data);
        return response.data;
    },

    updateMatiere: async (id, data) => {
        const response = await laravelApiClient.put(`/departement/matieres/${id}`, data);
        return response.data;
    },

    deleteMatiere: async (id) => {
        const response = await laravelApiClient.delete(`/departement/matieres/${id}`);
        return response.data;
    },

    // Filières
    getFilieres: async (params = {}) => {
        const response = await laravelApiClient.get('/departement/filieres', { params });
        return response.data;
    },

    getFiliere: async (id) => {
        const response = await laravelApiClient.get(`/departement/filieres/${id}`);
        return response.data;
    },

    createFiliere: async (data) => {
        const response = await laravelApiClient.post('/departement/filieres', data);
        return response.data;
    },

    updateFiliere: async (id, data) => {
        const response = await laravelApiClient.put(`/departement/filieres/${id}`, data);
        return response.data;
    },

    deleteFiliere: async (id) => {
        const response = await laravelApiClient.delete(`/departement/filieres/${id}`);
        return response.data;
    },

    // Affectations matières ↔ filière
    assignMatiereToFiliere: async (filiereId, payload) => {
        const response = await laravelApiClient.post(`/departement/filieres/${filiereId}/matieres`, payload);
        return response.data;
    },

    removeMatiereFromFiliere: async (filiereId, matiereId) => {
        const response = await laravelApiClient.delete(`/departement/filieres/${filiereId}/matieres/${matiereId}`);
        return response.data;
    },

    // Filière - infos annexes
    getFiliereEtudiants: async (filiereId, params = {}) => {
        const response = await laravelApiClient.get(`/departement/filieres/${filiereId}/etudiants`, { params });
        return response.data;
    },

    getFiliereMatieres: async (filiereId) => {
        const response = await laravelApiClient.get(`/departement/filieres/${filiereId}/matieres`);
        return response.data;
    },

    getFiliereStats: async (filiereId) => {
        const response = await laravelApiClient.get(`/departement/filieres/${filiereId}/stats`);
        return response.data;
    },

    getFiliereEmploiTemps: async (filiereId, params = {}) => {
        const response = await laravelApiClient.get(`/departement/filieres/${filiereId}/emploi-temps`, { params });
        return response.data;
    },

    // Étudiants (liste département)
    getEtudiants: async (params = {}) => {
        const response = await laravelApiClient.get('/departement/etudiants', { params });
        return response.data;
    },

    // Imports (CSV)
    importEtudiants: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await laravelApiClient.post('/departement/import/etudiants', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    importNotes: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await laravelApiClient.post('/departement/import/notes', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Notes (CRUD)
    getNotes: async (params = {}) => {
        const response = await laravelApiClient.get('/departement/notes', { params });
        return response.data;
    },

    getNote: async (id) => {
        const response = await laravelApiClient.get(`/departement/notes/${id}`);
        return response.data;
    },

    createNote: async (data) => {
        const response = await laravelApiClient.post('/departement/notes', data);
        return response.data;
    },

    updateNote: async (id, data) => {
        const response = await laravelApiClient.put(`/departement/notes/${id}`, data);
        return response.data;
    },

    deleteNote: async (id) => {
        const response = await laravelApiClient.delete(`/departement/notes/${id}`);
        return response.data;
    },

    // Emploi du temps (CRUD)
    getEmploiTemps: async (params = {}) => {
        const response = await laravelApiClient.get('/departement/emploi-temps', { params });
        return response.data;
    },

    getEmploiTempsItem: async (id) => {
        const response = await laravelApiClient.get(`/departement/emploi-temps/${id}`);
        return response.data;
    },

    createEmploiTemps: async (data) => {
        const response = await laravelApiClient.post('/departement/emploi-temps', data);
        return response.data;
    },

    updateEmploiTemps: async (id, data) => {
        const response = await laravelApiClient.put(`/departement/emploi-temps/${id}`, data);
        return response.data;
    },

    deleteEmploiTemps: async (id) => {
        const response = await laravelApiClient.delete(`/departement/emploi-temps/${id}`);
        return response.data;
    },

    // Dashboard
    getDashboard: async () => {
        const response = await laravelApiClient.get('/departement/dashboard');
        return response.data;
    },

    // Enseignants (CRUD)
    getEnseignants: async (params = {}) => {
        const response = await laravelApiClient.get('/departement/enseignants', { params });
        return response.data;
    },

    getEnseignant: async (id) => {
        const response = await laravelApiClient.get(`/departement/enseignants/${id}`);
        return response.data;
    },

    createEnseignant: async (data) => {
        const response = await laravelApiClient.post('/departement/enseignants', data);
        return response.data;
    },

    updateEnseignant: async (id, data) => {
        const response = await laravelApiClient.put(`/departement/enseignants/${id}`, data);
        return response.data;
    },

    deleteEnseignant: async (id) => {
        const response = await laravelApiClient.delete(`/departement/enseignants/${id}`);
        return response.data;
    },

    validerEnseignant: async (id) => {
        const response = await laravelApiClient.post(`/departement/enseignants/${id}/valider`);
        return response.data;
    },

    assignMatiereToEnseignant: async (enseignantId, matiereId) => {
        const response = await laravelApiClient.post(`/departement/enseignants/${enseignantId}/matieres`, { matiere_id: matiereId });
        return response.data;
    },

    removeMatiereFromEnseignant: async (enseignantId, matiereId) => {
        const response = await laravelApiClient.delete(`/departement/enseignants/${enseignantId}/matieres/${matiereId}`);
        return response.data;
    },

    // Salles (CRUD)
    getSalles: async (params = {}) => {
        const response = await laravelApiClient.get('/departement/salles', { params });
        return response.data;
    },

    getSalle: async (id) => {
        const response = await laravelApiClient.get(`/departement/salles/${id}`);
        return response.data;
    },

    createSalle: async (data) => {
        const response = await laravelApiClient.post('/departement/salles', data);
        return response.data;
    },

    updateSalle: async (id, data) => {
        const response = await laravelApiClient.put(`/departement/salles/${id}`, data);
        return response.data;
    },

    deleteSalle: async (id) => {
        const response = await laravelApiClient.delete(`/departement/salles/${id}`);
        return response.data;
    },

    getSalleDisponibilite: async (params = {}) => {
        const response = await laravelApiClient.get('/departement/salles/disponibilite', { params });
        return response.data;
    },

    reserverSalle: async (salleId, data) => {
        const response = await laravelApiClient.post(`/departement/salles/${salleId}/reservations`, data);
        return response.data;
    },

    deleteReservationSalle: async (salleId, reservationId) => {
        const response = await laravelApiClient.delete(`/departement/salles/${salleId}/reservations/${reservationId}`);
        return response.data;
    },

    // Absences (CRUD)
    getAbsences: async (params = {}) => {
        const response = await laravelApiClient.get('/departement/absences', { params });
        return response.data;
    },

    getAbsence: async (id) => {
        const response = await laravelApiClient.get(`/departement/absences/${id}`);
        return response.data;
    },

    createAbsence: async (data) => {
        const response = await laravelApiClient.post('/departement/absences', data);
        return response.data;
    },

    updateAbsence: async (id, data) => {
        const response = await laravelApiClient.put(`/departement/absences/${id}`, data);
        return response.data;
    },

    deleteAbsence: async (id) => {
        const response = await laravelApiClient.delete(`/departement/absences/${id}`);
        return response.data;
    },

    getAbsenceStats: async (params = {}) => {
        const response = await laravelApiClient.get('/departement/absences/stats', { params });
        return response.data;
    },

    // Notes - Validation
    validerNote: async (id) => {
        const response = await laravelApiClient.post(`/departement/notes/${id}/valider`);
        return response.data;
    },

    invaliderNote: async (id) => {
        const response = await laravelApiClient.post(`/departement/notes/${id}/invalider`);
        return response.data;
    },

    validerLotNotes: async (ids) => {
        const response = await laravelApiClient.post('/departement/notes/valider-lot', { ids });
        return response.data;
    },

    // Audit logs
    getAuditLogs: async (params = {}) => {
        const response = await laravelApiClient.get('/departement/audit-logs', { params });
        return response.data;
    },

    // Communications
    getCommunications: async (params = {}) => {
        const response = await laravelApiClient.get('/departement/communications', { params });
        return response.data;
    },

    createCommunication: async (data) => {
        const response = await laravelApiClient.post('/departement/communications', data);
        return response.data;
    },

    deleteCommunication: async (id) => {
        const response = await laravelApiClient.delete(`/departement/communications/${id}`);
        return response.data;
    },

    // Responsable
    toggleResponsable: async (etudiantId) => {
        const response = await laravelApiClient.post(`/departement/etudiants/${etudiantId}/responsable`);
        return response.data;
    }
};
