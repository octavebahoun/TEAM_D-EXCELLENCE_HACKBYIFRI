import { pythonApiClient } from '../api/client';

/**
 * Service pour interagir avec l'API Python (Intelligence Artificielle)
 */
export const aiService = {
    /**
     * Génère une fiche de révision à partir d'un fichier
     */
    generateSummary: async ({ file, level = 'medium', style = 'bullets', format = 'markdown', matiere }) => {
        const formData = new FormData();
        formData.append('file', file);

        let url = `/summary/generate?level=${level}&style=${style}&format=${format}`;
        if (matiere) url += `&matiere=${encodeURIComponent(matiere)}`;

        const response = await pythonApiClient.post(url, formData);
        return response.data;
    },

    /**
     * Génère un podcast à partir d'un fichier
     */
    generatePodcast: async ({ file }) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await pythonApiClient.post('/podcast/generate', formData);
        return response.data;
    },

    /**
     * Récupère une fiche existante
     */
    getSummary: async (id) => {
        const response = await pythonApiClient.get(`/summary/${id}`);
        return response.data;
    },

    /**
     * Génère un quiz à partir d'un fichier
     */
    generateQuiz: async ({ file, nbQuestions = 10, difficulty = 'medium', matiere }) => {
        const formData = new FormData();
        formData.append('file', file);

        let url = `/quiz/generate?nb_questions=${nbQuestions}&difficulty=${difficulty}`;
        if (matiere) url += `&matiere=${encodeURIComponent(matiere)}`;

        const response = await pythonApiClient.post(url, formData);
        return response.data;
    },

    /**
     * Corrige un quiz
     */
    correctQuiz: async (quizId, answers) => {
        const response = await pythonApiClient.post('/quiz/correct', {
            quiz_id: quizId,
            answers
        });
        return response.data;
    },

    /**
     * Génère des exercices à partir d'un fichier
     */
    generateExercises: async ({ file, nbExercises = 5, difficulty = 'progressive', matiere, chapitre }) => {
        const formData = new FormData();
        formData.append('file', file);

        let url = `/exercises/generate?nb_exercises=${nbExercises}&difficulty=${difficulty}`;
        if (matiere) url += `&matiere=${encodeURIComponent(matiere)}`;
        if (chapitre) url += `&chapitre=${encodeURIComponent(chapitre)}`;

        const response = await pythonApiClient.post(url, formData);
        return response.data;
    },

    /**
     * Pose une question au RAG (Chat IA)
     */
    askChat: async (question, history = []) => {
        const response = await pythonApiClient.post('/chat', { question, history });
        return response.data;
    },

    /**
     * Uploade un fichier pour le RAG
     */
    uploadForRAG: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await pythonApiClient.post('/upload', formData);
        return response.data;
    },

    /**
     * Génère une image à partir d'un prompt
     */
    generateImage: async (prompt) => {
        const response = await pythonApiClient.post(`/image/generate?prompt=${encodeURIComponent(prompt)}`);
        return response.data;
    },

    /**
     * Récupère un quiz existant par ID
     */
    getQuiz: async (id) => {
        const response = await pythonApiClient.get(`/quiz/${id}`);
        return response.data;
    },

    /**
     * Récupère des exercices existants par ID
     */
    getExercises: async (id) => {
        const response = await pythonApiClient.get(`/exercises/${id}`);
        return response.data;
    },

    // --- Méthodes historique ---
    getHistory: async (type) => {
        const url = type ? `/history?type=${type}` : '/history';
        const response = await pythonApiClient.get(url);
        return response.data;
    },

    deleteHistoryItem: async (historyId) => {
        const response = await pythonApiClient.delete(`/history/${historyId}`);
        return response.data;
    },

    clearHistory: async (type) => {
        const response = await pythonApiClient.delete(`/history?type=${type}`);
        return response.data;
    },

    // --- Roadmap ---
    generateRoadmap: async ({ mode, matiere, notion, niveau }) => {
        const response = await pythonApiClient.post('/roadmap/generate', {
            mode,
            matiere,
            notion,
            niveau,
        });
        return response.data;
    },

    getRoadmapStatus: async (jobId) => {
        const response = await pythonApiClient.get(`/roadmap/${jobId}/status`);
        return response.data;
    },

    getRoadmap: async (roadmapUuid) => {
        const response = await pythonApiClient.get(`/roadmap/${roadmapUuid}`);
        return response.data;
    },

    downloadRoadmapPdf: async (roadmapUuid) => {
        const response = await pythonApiClient.get(`/roadmap/${roadmapUuid}/pdf`, {
            responseType: 'blob',
        });
        return response.data;
    },
};
