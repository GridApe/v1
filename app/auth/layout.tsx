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
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#4338ca] via-blue-900 to-[#312e81]    p-6 overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute w-[1400px] h-[1400px] bg-white/5 blur-3xl -bottom-[700px] -left-[700px] rounded-full"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
        className="absolute w-[1400px] h-[1400px] bg-white/5 blur-3xl -top-[700px] -right-[700px] rounded-full"
      />

      {/* Decorative grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Authentication Container */}
      <Suspense fallback={
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
        </div>
      }>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-white/95 dark:bg-gray-900/95 shadow-2xl rounded-2xl p-1 backdrop-blur-xl border border-white/20"
        >
          {/* Container glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl" />
          
          {/* Content wrapper */}
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8">
            {children}
          </div>
        </motion.div>
        <Toaster />
      </Suspense>
    </div>
  );
}
