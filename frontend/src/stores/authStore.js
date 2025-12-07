import { create } from 'zustand';
import authService from '../services/auth.service';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

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

  register: async (username, email, password) => {
    set({ isLoading: true, error: null });

    try {
      const data = await authService.register(username, email, password);

      // ❗ Vì API không trả token → không xử lý user/token tại đây
      set({ isLoading: false });

      return data;   // Trả về data gốc của API (thường là message)

    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });

      throw error;
    }
  },

  login: async (username, password) => {
    set({ isLoading: true, error: null });

    try {
      const data = await authService.login(username, password);

      if (!data?.token) {
        throw new Error("Token not found in login response");
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
