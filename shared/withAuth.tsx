'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { LoaderCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function AuthComponent(props: P) {
    const { user, loading, fetchCurrentUser } = useAuthStore();
    const router = useRouter();
    const [isInitialized, setIsInitialized] = useState(false);
    const [hasAttemptedAuth, setHasAttemptedAuth] = useState(false);

    useEffect(() => {
      const initializeAuth = async () => {
        // Only attempt to fetch user once
        if (hasAttemptedAuth) return;

        setHasAttemptedAuth(true);

        try {
          await fetchCurrentUser();
        } catch (error) {
          console.error('Error fetching current user:', error);
        } finally {
          setIsInitialized(true);
        }
      };

      if (!isInitialized && !hasAttemptedAuth) {
        initializeAuth();
      }
    }, [fetchCurrentUser, isInitialized, hasAttemptedAuth]);

    useEffect(() => {
      // Only redirect if we've finished initializing and there's no user
      if (isInitialized && !loading && !user) {
        router.push('/auth/login');
      }
    }, [isInitialized, loading, user, router]);

    if (!isInitialized || loading) {
      return <LoadingScreen />;
    }

    if (!user) {
      return <UnauthorizedScreen />;
    }

    return <WrappedComponent {...props} />;
  };
}

const LoadingScreen = ({ loadingText = 'Loading...', logoSrc = '/logo.svg' }) => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-primary">
      <motion.img
        src={logoSrc}
        alt="Loading Logo"
        className="w-24 h-24 mb-6"
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <div className="flex items-center">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="mr-4"
        >
          <LoaderCircle size={40} className="text-white" />
        </motion.div>
        <p className="text-white text-lg font-black">{loadingText}</p>
      </div>
    </div>
  );
};

function UnauthorizedScreen() {
  return (
    <div className="flex justify-center items-center h-screen text-center">
      <p className="text-gray-600">You need to log in to access this page.</p>
    </div>
  );
}