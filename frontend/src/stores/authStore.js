// authStore.js
import { create } from 'zustand';
import authService from '../services/auth.service';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  // Dùng khi app khởi động để sync lại từ localStorage
  hydrateFromLocalStorage: () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      const user = JSON.parse(userStr);
      set({
        token,
        user,
        isAuthenticated: true,
      });
    }
  },

  login: async (username, password) => {
    set({ isLoading: true, error: null });

    try {
      const data = await authService.login(username, password);

      console.log("LOGIN DATA FIXED:", data);

      if (!data?.token) {
        throw new Error("Token not found in response");
      }

      const user = {
        id: data.id,
        username: data.username,
        email: data.email,
        roles: data.roles
      };

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(user));

      set({
        user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
      });

      return user;

    } catch (error) {
      console.error("LOGIN ERROR FIX:", error);

      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });

      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
