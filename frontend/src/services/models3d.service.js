import api from './api';

const ENDPOINT = '/models3d';

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

export const getByProjectId = async (projectId) => {
    const response = await api.get(`/projects/${projectId}/models`);
    return response.data;
};

export const uploadModel = async (projectId, formData) => {
    const response = await api.post(`/projects/${projectId}/models`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
};
