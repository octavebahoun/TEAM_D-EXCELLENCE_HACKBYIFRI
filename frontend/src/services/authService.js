import { laravelApiClient } from '../api/client';

const ROLE_CONFIG = [
    { key: 'student', endpoint: '/auth/student/login', userField: 'user', loginField: 'login', roleKey: 'student' },
    { key: 'chef', endpoint: '/auth/chef/login', userField: 'chef', loginField: 'email', roleKey: 'chef_departement' },
    { key: 'admin', endpoint: '/auth/admin/login', userField: 'admin', loginField: 'email', roleKey: 'super_admin' },
    { key: 'professeur', endpoint: '/auth/professeur/login', userField: 'professeur', loginField: 'email', roleKey: 'professeur' },
];

export const authService = {
    login: async ({ email, password }) => {
        const errors = [];
        for (const cfg of ROLE_CONFIG) {
            try {
                const payload = cfg.loginField === 'login'
                    ? { login: email, password }
                    : { email, password };
                const response = await laravelApiClient.post(cfg.endpoint, payload);
                if (response.data.token) {
                    localStorage.setItem('token', response.data.token);
                    const user = response.data[cfg.userField] || response.data.user || {};
                    localStorage.setItem('user', JSON.stringify(user));
                    const role = user?.is_responsable ? 'responsable' : cfg.roleKey;
                    localStorage.setItem('role', role);
                    return { ...response.data, role };
                }
            } catch (e) {
                errors.push(e.response?.data?.message || e.message);
            }
        }
        throw new Error('Identifiants invalides. Vérifiez votre email et mot de passe.');
    },

    adminRegister: async (data) => {
        const response = await laravelApiClient.post('/auth/admin/register', data);
        return response.data;
    },

    studentActivate: async (payload) => {
        const response = await laravelApiClient.post('/auth/student/activate', payload);
        return response.data;
    },

    studentRegister: async (data) => {
        const response = await laravelApiClient.post('/auth/student/register', data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('role', 'student');
        }
        return response.data;
    },

    logout: async () => {
        const role = localStorage.getItem('role');
        const endpoint = role === 'super_admin' ? '/auth/admin/logout'
            : role === 'chef_departement' ? '/auth/chef/logout'
                : role === 'professeur' ? '/auth/professeur/logout'
                : '/auth/student/logout';

        try {
            await laravelApiClient.post(endpoint);
        } catch (e) {
            console.error('Logout error on server', e);
        }
        localStorage.clear();
        window.location.href = '/landing';
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    getRole: () => {
        return localStorage.getItem('role');
    },

    me: async () => {
        const response = await laravelApiClient.get('/auth/me');
        return response.data;
    },
};
