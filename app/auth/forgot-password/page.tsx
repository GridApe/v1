'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AuthCard } from '../auth-card';
import { useAuth } from '@/hooks/useAuth';
import { LoaderCircle, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await auth.forgotPassword(email);
      toast({
        title: 'Success',
        description: 'Password reset instructions have been sent to your email.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send reset instructions',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard 
      title="Reset Password" 
      description="Enter your email address and we'll send you instructions to reset your password."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-9 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#4338ca] to-indigo-900 hover:from-indigo-900 hover:to-[#4338ca] text-white shadow-lg shadow-indigo-500/20 transition-all duration-200"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                <span>Sending reset link...</span>
              </div>
            ) : (
              'Send Reset Link'
            )}
          </Button>
        </motion.div>

        {/* Back to Login */}
        <div className="text-center text-sm">
          <Link 
            href="/auth/login" 
            className="text-indigo-600 hover:text-indigo-500 hover:underline transition-colors"
          >
            Back to login
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}
