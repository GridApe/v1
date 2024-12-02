'use client';

import { create } from 'zustand';
import Cookies from 'js-cookie';
import { UserTypes } from '@/types/interface';


interface AuthState {
  user: UserTypes | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    email: string,
    password: string,
    password_confirmation: string,
    first_name: string,
    last_name: string
  ) => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,

  login: async (email: string, password: string) => {
    try {
      set({ loading: true });
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const responseData = await response.json();
        Cookies.set('token', responseData.data.access_token)
        await useAuthStore.getState().fetchCurrentUser();
        set({ loading: false });
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      set({ loading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Logout failed');

      set({ user: null });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  register: async (
    email: string,
    password: string,
    password_confirmation: string,
    first_name: string,
    last_name: string
  ) => {
    try {
      set({ loading: true });

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          password_confirmation,
          first_name,
          last_name,
        }),
      });

      if (!response.ok) throw new Error('Registration failed');

      await useAuthStore.getState().fetchCurrentUser();
      set({ loading: false });
    } catch (error) {
      console.error('Registration error:', error);
      set({ loading: false });
      throw error;
    }
  },

  fetchCurrentUser: async () => {
    try {
      set({ loading: true });

      const response = await fetch('/api/user/profile', {
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to fetch user');

      const responseData = await response.json();
      set({ user: responseData.data.user, loading: false });
    } catch (error) {
      console.error('Fetch user error:', error);
      set({ loading: false });
    }
  },
}));
