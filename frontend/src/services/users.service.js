import api from './api';

const ENDPOINT = '/admin/users';

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

export const updateStatus = async (id, status) => {
    const response = await api.patch(`${ENDPOINT}/${id}/status`, { status });
    return response.data;
};

export const updateRole = async (id, role) => {
    const response = await api.patch(`${ENDPOINT}/${id}/role`, { role });
    return response.data;
};
