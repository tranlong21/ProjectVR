import api from './api';

const ENDPOINT = '/scenes';

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
    const response = await api.get(`/scenes/project/${projectId}`);
    return response.data;
};

export const uploadPanorama = async (formData) => {
    const response = await api.post('/files/upload/scenes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};
