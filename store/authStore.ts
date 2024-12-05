'use client';

import { create } from 'zustand';
import Cookies from 'js-cookie';
import { UserTypes } from '@/types/interface';

interface AuthState {
  user: UserTypes | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (email: string, token: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    password_confirmation: string,
    first_name: string,
    last_name: string
  ) => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  updateUser: (user: UserTypes) => void;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,

  login: async (email: string, password: string): Promise<void> => {
    try {
      set({ loading: true });

      const response: Response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const responseData = await response.json();
      
      if (response.ok) {
        const responseData = await response.json();
        
        Cookies.set('token', responseData.data.access_token);
        await useAuthStore.getState().fetchCurrentUser();
        set({ loading: false });
      } else {
        throw new Error(responseData.error);
      }
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
  verifyEmail: async (email: string, token: string): Promise<void> => {
    try {
      set({ loading: true });

      const response: Response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token }),
      });

      if (response.ok) {
        set({ loading: false });
      } else {
        throw new Error('Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      set({ loading: false });
      throw error;
    }
  },
  resendOtp: async (email: string): Promise<void> => {
    try {
      set({ loading: true });

      const response: Response = await fetch('/api/auth/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        set({ loading: false });
      } else {
        throw new Error('Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      set({ loading: false });
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      const response: Response = await fetch('/api/auth/logout', {
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
  ): Promise<void> => {
    try {
      set({ loading: true });

      const response: Response = await fetch('/api/auth/register', {
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

  fetchCurrentUser: async (): Promise<void> => {
    try {
      set({ loading: true });

      const response: Response = await fetch('/api/user/profile', {
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to fetch user');

      const responseData: { data: { user: UserTypes } } = await response.json();
      set({ user: responseData.data.user, loading: false });
    } catch (error) {
      console.error('Fetch user error:', error);
      set({ loading: false });
    }
  },
  updateUser: async (userData: Partial<UserTypes>): Promise<void> => {
    try {
      set({ loading: true });

      const response: Response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error('Failed to update user');

      const responseData: { data: { user: UserTypes } } = await response.json();
      set({ user: { ...useAuthStore.getState().user, ...responseData.data.user }, loading: false });
    } catch (error) {
      console.error('Update user error:', error);
      set({ loading: false });
      throw error;
    }
  },
  updatePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      set({ loading: true });

      const response: Response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });

      if (!response.ok) throw new Error('Failed to update password');

      set({ loading: false });
    } catch (error) {
      console.error('Update password error:', error);
      set({ loading: false });
      throw error;
    }
  },
}));
