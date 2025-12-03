import api from "./api";
const ADMIN_ENDPOINT = "/admin/scenes";

export const getBySceneId = async (sceneId) => {
    return api.get(`${ADMIN_ENDPOINT}/${sceneId}/hotspots`)
        .then(res => res.data);
};

export const createForScene = async (sceneId, data) => {
    return api.post(`${ADMIN_ENDPOINT}/${sceneId}/hotspots`, data)
        .then(res => res.data);
};

export const update = async (sceneId, hotspotId, data) => {
    return api.put(`/admin/hotspots/${hotspotId}`, data)
        .then(res => res.data);
};

export const remove = async (sceneId, hotspotId) => {
    return api.delete(`/admin/hotspots/${hotspotId}`)
        .then(res => res.data);
};

