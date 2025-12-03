import api from "./api";

const ADMIN_ENDPOINT = "/admin/scenes";
const PUBLIC_ENDPOINT = "/scenes";

// GET SCENES BY PROJECT
export const getByProjectId = async (projectId) => {
  const res = await api.get(`${PUBLIC_ENDPOINT}/project/${projectId}`);
  return res.data;
};

// GET ONE SCENE
export const getById = async (id) => {
  const res = await api.get(`${PUBLIC_ENDPOINT}/${id}`);
  return res.data;
};

//  ADMIN

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

export const uploadPanorama = async (formData) => {
  const response = await api.post("/files/upload/scenes", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
