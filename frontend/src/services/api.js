// api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Log lỗi nhưng KHÔNG auto logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API ERROR:", {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
    });

    return Promise.reject(error);
  }
);

export default api;
