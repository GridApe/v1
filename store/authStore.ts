import apiService from '@/lib/api-service';
import { UserTypes } from '@/types/interface';
import { create } from 'zustand';


interface AuthState {
  user: UserTypes | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, password_confirmation: string, first_name: string, last_name: string) => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  login: async (email: string, password: string) => {
    try {
      const response = await apiService.login({ email, password });
      console.log({response})
      localStorage.setItem('token', response.data.access_token);
      // set({ user: response.username });
      await useAuthStore.getState().fetchCurrentUser();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },
  logout: async () => {
    try {
      await apiService.logout();
      localStorage.removeItem('token');
      set({ user: null });
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  },
  register: async (email: string, password: string, password_confirmation: string, first_name: string, last_name: string) => {
    try {
      const response = await apiService.register({ email, password, password_confirmation, first_name, last_name });
      localStorage.setItem('token', response.token);
      set({ user: response.user });
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },
  fetchCurrentUser: async () => {
    try {
      set({ loading: true });
      const response = await apiService.getCurrentUser();
      set({ user: response.data.user, loading: false });
    } catch (error) {
      console.error('Failed to load user:', error);
      set({ loading: false });
    }
  },
}));
