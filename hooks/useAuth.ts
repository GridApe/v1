import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const { user, loading, login, logout, register, fetchCurrentUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
    router.push('/dashboard');
  };

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  const handleRegister = async (email: string, password: string, password_confirmation: string, first_name: string, last_name: string) => {
    await register( email, password, password_confirmation, first_name, last_name );
    router.push('/dashboard');
  };
1
  return { user, loading, login: handleLogin, logout: handleLogout, register: handleRegister };
}