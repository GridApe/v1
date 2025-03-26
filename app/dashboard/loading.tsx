'use client';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <motion.div 
      className="p-4 md:p-6 lg:p-8 min-h-screen bg-gradient-to-b from-[#2E3192] to-[#1a1c5c]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#3639A0] rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-[#3639A0] rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 space-y-8">
        {/* Search Bar Skeleton */}
        <motion.div 
          className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Skeleton className="h-16 w-full bg-white/10" />
        </motion.div>

        {/* Quick Actions Skeleton */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10"
            >
              <Skeleton className="h-32 w-full bg-white/10 rounded-lg" />
            </div>
          ))}
        </motion.div>

        {/* Performance Sections Skeleton */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {[1, 2].map((i) => (
            <div 
              key={i}
              className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10"
            >
              <Skeleton className="h-96 w-full bg-white/10 rounded-lg" />
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
