import api from "./api";

const ADMIN_ENDPOINT = "/admin/categories";
const PUBLIC_ENDPOINT = "/categories";

export const getAll = async () => {
    const response = await api.get(PUBLIC_ENDPOINT);
    return response.data;
};

export const getById = async (id) => {
    const response = await api.get(`${PUBLIC_ENDPOINT}/${id}`);
    return response.data;
};

export const create = async (data) => {
    const response = await api.post(ADMIN_ENDPOINT, data);
    return response.data;
};

export const update = async (id, data) => {
    const response = await api.put(`${ADMIN_ENDPOINT}/${id}`, data);
    return response.data;
};

export const remove = async (id) => {
    const response = await api.delete(`${ADMIN_ENDPOINT}/${id}`);
    return response.data;
};
