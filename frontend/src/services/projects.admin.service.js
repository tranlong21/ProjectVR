// projects.admin.service.js
import api from "./api";

const ADMIN_ENDPOINT = "/admin/projects";

export const getAll = async () => {
    const res = await api.get(ADMIN_ENDPOINT);
    return res.data;
};

export const getById = async (id) => {
    const res = await api.get(`${ADMIN_ENDPOINT}/${id}`);
    return res.data;
};

export const create = async (data) => {
    const res = await api.post(ADMIN_ENDPOINT, data);
    return res.data;
};

export const update = async (id, data) => {
    const res = await api.put(`${ADMIN_ENDPOINT}/${id}`, data);
    return res.data;
};

export const remove = async (id) => {
    const res = await api.delete(`${ADMIN_ENDPOINT}/${id}`);
    return res.data;
};

export const uploadThumbnail = async (id, data) => {
    const isFormData = data instanceof FormData;
    const res = await api.post(
        `${ADMIN_ENDPOINT}/${id}/thumbnail`,
        data,
        { headers: isFormData ? { "Content-Type": "multipart/form-data" } : {} }
    );
    return res.data;
};
