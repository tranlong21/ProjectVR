// services/projects.admin.service.js
import api from "./api";

const ENDPOINT = "/admin/projects";

export const adminGetAll = async () => {
    const res = await api.get(ENDPOINT);
    return res.data;
};

export const adminGetById = async (id) => {
    const res = await api.get(`${ENDPOINT}/${id}`);
    return res.data;
};

export const adminCreate = async (data) => {
    const res = await api.post(ENDPOINT, data);
    return res.data;
};

export const adminUpdate = async (id, data) => {
    const res = await api.put(`${ENDPOINT}/${id}`, data);
    return res.data;
};

export const adminRemove = async (id) => {
    const res = await api.delete(`${ENDPOINT}/${id}`);
    return res.data;
};

export const adminUploadThumbnail = async (id, formData) => {
    const res = await api.post(`${ENDPOINT}/${id}/thumbnail`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
};
