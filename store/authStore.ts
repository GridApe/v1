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
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
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
        // const responseData = await response.json();

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
      // console.error('Verification error:', error);
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
      // console.error('Verification error:', error);
      set({ loading: false });
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      // Try to logout on the server, but don't fail if it doesn't work
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
        });
      } catch (e) {
        // console.error('Server logout failed, continuing with client logout');
      }

      // Always clear local state and cookies regardless of server response
      Cookies.remove('token');
      set({ user: null });
    } catch (error) {
      // console.error('Logout error:', error);
      // Still clear cookies and user state even if there was an error
      Cookies.remove('token');
      set({ user: null });
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

      // await useAuthStore.getState().fetchCurrentUser();
      set({ loading: false });
    } catch (error) {
      // console.error('Registration error:', error);
      set({ loading: false });
      throw error;
    }
  },

  fetchCurrentUser: async (): Promise<void> => {
    try {
      set({ loading: true });

      const token = Cookies.get('token');

      // If no token exists, clear user state and return early
      if (!token) {
        set({ user: null, loading: false });
        return;
      }

      const response: Response = await fetch('/api/user/profile', {
        credentials: 'include',
      });

      if (response.status === 401) {
        // If unauthorized (expired token), clear user state and token
        Cookies.remove('token');
        set({ user: null, loading: false });
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch user');

      const responseData: { data: { user: UserTypes } } = await response.json();
      set({ user: responseData.data.user, loading: false });
    } catch (error) {
      // console.error('Fetch user error:', error);
      // On any error, ensure loading is set to false to prevent indefinite loading
      Cookies.remove('token');
      set({ user: null, loading: false });
    }
  },
  updateUser: async (userData: Partial<UserTypes>): Promise<void> => {
    try {
      // set({ loading: true });
      const { id } = userData;

      if (!id) {
        throw new Error("User ID is required to update the profile");
      }

      const response: Response = await fetch(`/api/user/profile?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      if (response.status === 401) {
        // Handle expired token
        Cookies.remove('token');
        set({ user: null });
        throw new Error('Your session has expired. Please log in again.');
      }

      if (!response.ok) throw new Error('Failed to update user');

      const responseData: { data: { user: UserTypes } } = await response.json();
      set({ user: { ...useAuthStore.getState().user, ...responseData.data.user } });
    } catch (error) {
      // console.error('Update user error:', error);
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

      if (response.status === 401) {
        // Handle expired token
        Cookies.remove('token');
        set({ user: null, loading: false });
        throw new Error('Your session has expired. Please log in again.');
      }

      if (!response.ok) throw new Error('Failed to update password');

      set({ loading: false });
    } catch (error) {
      // console.error('Update password error:', error);
      set({ loading: false });
      throw error;
    }
  },
  forgotPassword: async (email: string): Promise<void> => {
    try {
      set({ loading: true });

      const response: Response = await fetch('/api/auth/password/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send reset instructions');
      }

      set({ loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
  resetPassword: async (token: string, password: string): Promise<void> => {
    try {
      set({ loading: true });

      const response: Response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reset password');
      }

      set({ loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
}));
