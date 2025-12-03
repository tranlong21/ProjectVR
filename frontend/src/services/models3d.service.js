import api from './api';

const ENDPOINT = '/models3d';
const ADMIN_ENDPOINT = '/admin/projects';

export const getAll = async () => {
    const response = await api.get(ENDPOINT);
    return response.data;
};

export const getById = async (id) => {
    const response = await api.get(`${ENDPOINT}/${id}`);
    return response.data;
};

export const create = async (data) => {
    const response = await api.post(ENDPOINT, data);
    return response.data;
};

export const update = async (id, data) => {
    const response = await api.put(`${ENDPOINT}/${id}`, data);
    return response.data;
};

export const remove = async (id) => {
    const response = await api.delete(`${ENDPOINT}/${id}`);
    return response.data;
};

// --- ADMIN AREA ---

export const getByProjectId = async (projectId) => {
    const response = await api.get(`${ADMIN_ENDPOINT}/${projectId}/models`);
    return response.data;
};

export const uploadModel = async (projectId, formData) => {
    const response = await api.post(`${ADMIN_ENDPOINT}/${projectId}/models`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
};
