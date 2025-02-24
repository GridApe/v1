"use client"; // <-- Add this at the top
// 
// import type { Metadata } from 'next';
import { ReactNode, Suspense } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { motion } from 'framer-motion';

// export const metadata: Metadata = {
//   title: 'Authentication',
//   description: 'Authentication pages for the application',
// };

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#4338ca] to-[#312e81] p-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="absolute w-[1200px] h-[1200px] bg-white/10 blur-3xl -bottom-[600px] -left-[600px] rounded-full"
      ></motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        className="absolute w-[1200px] h-[1200px] bg-white/10 blur-3xl -top-[600px] -right-[600px] rounded-full"
      ></motion.div>

      {/* Authentication Container */}
      <Suspense fallback={<div>Loading...</div>}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-1 backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90"
        >
          {children}
        </motion.div>
        <Toaster />
      </Suspense>
    </div>
  );
}
