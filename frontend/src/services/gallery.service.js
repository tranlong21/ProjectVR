import api from "./api";

const ADMIN_ENDPOINT = "/admin/gallery";
const PUBLIC_ENDPOINT = "/gallery";

export const getByProjectId = async (projectId) => {
  const res = await api.get(`${PUBLIC_ENDPOINT}/project/${projectId}`);
  return res.data;
};

export const getById = async (id) => {
  const res = await api.get(`${PUBLIC_ENDPOINT}/${id}`);
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

export const uploadImage = async (formData) => {
  const res = await api.post("/files/upload/gallery", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
