import api from './api';

const ENDPOINT = '/blog';
const ADMIN_ENDPOINT = '/admin/blogs';

export const getAll = async () => {
    // Use public endpoint for fetching all blogs to avoid 401 for guests
    const response = await api.get(ENDPOINT);
    return response.data;
};

export const getBySlug = async (slug) => {
    const response = await api.get(`${ENDPOINT}/${slug}`);
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

export const remove = async (id) => {
    const response = await api.delete(`${ADMIN_ENDPOINT}/${id}`);
    return response.data;
};

export const uploadThumbnail = async (id, file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(
        `${ADMIN_ENDPOINT}/${id}/thumbnail`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data;
};

/* ================= AI BLOG (OLLAMA) ================= */

/**
 * Generate blog content by AI (Ollama – qwen2.5)
 * @param {Object} payload
 * @param {string} payload.title
 * @param {string} payload.topic
 * @param {number} payload.minWords
 * @param {number} payload.maxWords
 */
export const generateByAI = async ({
  title,
  topic,
  minWords = 600,
  maxWords = 800,
  audience,
  returnHtml = true
}) => {
  const response = await api.post(
    `${ADMIN_ENDPOINT}/generate`,   
    {
      title,
      topic,
      minWords,
      maxWords,
      audience,
      returnHtml
    }
  );

  return response.data;
};
