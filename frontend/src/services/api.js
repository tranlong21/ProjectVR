// api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8096/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Gửi token vào mọi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// KHÔNG tự logout mọi 401 nữa
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    console.log("API ERROR:", status, url, error.response?.data);

    // Nếu muốn, chỉ logout khi gọi các endpoint nhạy cảm như /auth/me hoặc /auth/refresh
    // if (status === 401 && url?.includes("/auth/refresh")) {
    //   localStorage.removeItem("token");
    //   localStorage.removeItem("user");
    //   window.location.href = "/login";
    // }

    return Promise.reject(error);
  }
);

export default api;
