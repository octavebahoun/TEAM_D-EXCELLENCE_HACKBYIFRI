import { nodeApiClient } from '../api/client';

/**
 * Discussions Prof ↔ Responsable (service Node/MongoDB).
 */
export const discussionService = {
    list: async () => {
        const { data } = await nodeApiClient.get('/discussions');
        return data?.discussions || [];
    },

    getMessages: async (id) => {
        const { data } = await nodeApiClient.get(`/discussions/${id}/messages`);
        return data; // { discussion, messages }
    },

    // Prof → envoie à une classe (crée/continue le fil)
    sendToClasse: async (payload) => {
        const { data } = await nodeApiClient.post('/discussions', payload);
        return data; // { discussion, message }
    },

    // Répondre dans un fil existant (prof ou responsable)
    reply: async (id, payload) => {
        const { data } = await nodeApiClient.post(`/discussions/${id}/messages`, payload);
        return data; // { message }
    },

    uploadFile: async (file) => {
        const form = new FormData();
        form.append('file', file);
        const { data } = await nodeApiClient.post('/discussions/upload', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data?.file; // { url, name }
    },
};
