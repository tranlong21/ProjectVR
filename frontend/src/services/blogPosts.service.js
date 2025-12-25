import api from './api';

const PUBLIC_ENDPOINT = '/blog';
const ADMIN_ENDPOINT = '/admin/blogs';

// ================= PUBLIC APIs =================

export const getAllPublished = async () => {
    const response = await api.get(PUBLIC_ENDPOINT);
    return response.data;
};

export const getBySlug = async (slug) => {
    const response = await api.get(`${PUBLIC_ENDPOINT}/${slug}`);
    return response.data;
};

// ================= ADMIN APIs =================

export const getAllAdmin = async () => {
    const response = await api.get(ADMIN_ENDPOINT);
    return response.data;
};

export const getByStatus = async (status) => {
    const response = await api.get(`${ADMIN_ENDPOINT}/status/${status}`);
    return response.data;
};

export const getById = async (id) => {
    const response = await api.get(`${ADMIN_ENDPOINT}/${id}`);
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

export const updateFromHtml = async (id, html) => {
    const response = await api.put(`${ADMIN_ENDPOINT}/${id}/html`, { html });
    return response.data;
};

export const updateStatus = async (id, status) => {
    const response = await api.patch(`${ADMIN_ENDPOINT}/${id}/status`, { status });
    return response.data;
};

export const updateThumbnail = async (id, file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(
        `${ADMIN_ENDPOINT}/${id}/thumbnail`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data;
};

export const updateThumbnailUrl = async (id, thumbnailUrl) => {
    const response = await api.patch(`${ADMIN_ENDPOINT}/${id}/thumbnail`, { thumbnailUrl });
    return response.data;
};

export const remove = async (id) => {
    const response = await api.delete(`${ADMIN_ENDPOINT}/${id}`);
    return response.data;
};