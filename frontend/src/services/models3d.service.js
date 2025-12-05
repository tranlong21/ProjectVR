import api from './api';

const ADMIN_ENDPOINT = '/admin/projects';
const PUBLIC_PROJECT_ENDPOINT = '/models3d/project';

export const getByProjectIdPublic = async (projectId) => {
    const response = await api.get(`${PUBLIC_PROJECT_ENDPOINT}/${projectId}`);
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

export const deleteModelAdmin = async (id) => {
    const response = await api.delete(`/admin/models/${id}`);
    return response.data;
};
