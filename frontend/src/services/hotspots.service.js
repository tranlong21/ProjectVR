import api from "./api";

const SCENE_ENDPOINT = "/admin/scenes";
const MODEL_ENDPOINT = "/admin/models";
const HOTSPOT_ENDPOINT = "/admin/hotspots";

/* SCENE */

export const getBySceneId = async (sceneId) => {
    const url = `${SCENE_ENDPOINT}/${sceneId}/hotspots`;
    console.log("GET SCENE HOTSPOTS:", url);

    const response = await api.get(url);
    return response.data;
};

export const createForScene = async (sceneId, data) => {
    const url = `${SCENE_ENDPOINT}/${sceneId}/hotspots`;
    console.log("CREATE SCENE HOTSPOT:", url, data);

    const response = await api.post(url, data);
    return response.data;
};

export const updateSceneHotspot = async (hotspotId, data) => {
    const url = `${HOTSPOT_ENDPOINT}/${hotspotId}`;
    console.log("UPDATE SCENE HOTSPOT:", url, data);

    const response = await api.put(url, data);
    return response.data;
};

export const deleteSceneHotspot = async (hotspotId) => {
    const url = `${HOTSPOT_ENDPOINT}/${hotspotId}`;
    console.log("DELETE SCENE HOTSPOT:", url);

    const response = await api.delete(url);
    return response.data;
};


/* 3D MODEL*/

export const getByModelId = async (modelId) => {
    const url = `${MODEL_ENDPOINT}/${modelId}/hotspots`;
    console.log("GET MODEL HOTSPOTS:", url);

    const response = await api.get(url);
    return response.data;
};

export const createForModel = async (modelId, data) => {
    const url = `${MODEL_ENDPOINT}/${modelId}/hotspots`;
    console.log("CREATE MODEL HOTSPOT:", url, data);

    const response = await api.post(url, data);
    return response.data;
};

export const updateForModel = async (modelId, hotspotId, data) => {
    const url = `${MODEL_ENDPOINT}/${modelId}/hotspots/${hotspotId}`;
    console.log("UPDATE MODEL HOTSPOT:", url, data);

    const response = await api.put(url, data);
    return response.data;
};

export const removeForModel = async (modelId, hotspotId) => {
    const url = `${MODEL_ENDPOINT}/${modelId}/hotspots/${hotspotId}`;
    console.log("DELETE MODEL HOTSPOT:", url);

    const response = await api.delete(url);
    return response.data;
};

export default {
    getBySceneId,
    createForScene,
    updateSceneHotspot,
    deleteSceneHotspot,

    getByModelId,
    createForModel,
    updateForModel,
    removeForModel
};
