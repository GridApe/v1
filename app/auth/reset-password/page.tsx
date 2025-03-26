'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AuthCard } from '../auth-card';
import { useAuth } from '@/hooks/useAuth';
import { LoaderCircle, LockIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {
  const { toast } = useToast();
  const auth = useAuth();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    password_confirmation: '',
  });
  const token = searchParams.get('token') || '';

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Passwords do not match',
      });
      return;
    }

    setLoading(true);
    try {
      await auth.resetPassword(token, formData.password);
      toast({
        title: 'Success',
        description: 'Your password has been reset successfully.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to reset password',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard 
      title="Reset Password" 
      description="Enter your new password below"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* New Password Input */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">New Password</Label>
          <div className="relative">
            <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              id="password"
              type="password"
              placeholder="Enter your new password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="pl-9 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Confirm Password Input */}
        <div className="space-y-2">
          <Label htmlFor="password_confirmation" className="text-sm font-medium">Confirm Password</Label>
          <div className="relative">
            <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              id="password_confirmation"
              type="password"
              placeholder="Confirm your new password"
              value={formData.password_confirmation}
              onChange={handleInputChange}
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
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20 transition-all duration-200"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                <span>Resetting password...</span>
              </div>
            ) : (
              'Reset Password'
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
