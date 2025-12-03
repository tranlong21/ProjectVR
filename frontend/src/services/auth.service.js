import api from './api';

const auth = {
    login: async (username, password) => {
        const res = await api.post('/auth/login', { username, password });
        return res.data; // ALWAYS RETURN DATA
    },

    register: async (username, email, password) => {
        const res = await api.post('/auth/register', { username, email, password });
        return res.data;
    },
};

export default auth;
