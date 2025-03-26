'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Error() {
  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#2E3192] to-[#1a1c5c] p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#3639A0] rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-[#3639A0] rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <motion.div 
          className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-white">Oops! Something went wrong</h1>
              <p className="text-white/80">
                We encountered an unexpected error. Please try again or contact support if the problem persists.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Button
                variant="outline"
                className="flex-1 bg-white/5 hover:bg-white/10 text-white border-white/10"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Link href="/dashboard" className="flex-1">
                <Button className="w-full bg-[#E8590C] hover:bg-[#ff6b1a] text-white">
                  Return to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
