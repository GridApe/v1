'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AuthCard } from '../auth-card';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    email: '',
    token: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      toast({
        variant: 'destructive',
        title: 'Invalid Access',
        description: 'Missing reset token or email. Please request a new password reset link.',
      });
      router.push('/auth/forgot-password');
      return;
    }

    setFormData(prev => ({
      ...prev,
      token,
      email,
    }));
  }, [searchParams, router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Passwords do not match',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/password/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          token: formData.token,
          password: formData.password,
          password_confirmation: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      toast({
        title: 'Success',
        description: data.message || 'Your password has been reset successfully',
      });
      router.push('/auth/login');

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <AuthCard title="Reset Password">
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter new password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#4338ca] hover:bg-[#3730a3]"
            disabled={loading}
          >
            {loading ? 'Please wait...' : 'Reset Password'}
          </Button>

          <div className="text-center text-sm">
            <p>
              Remember your password?{' '}
              <Link href="/auth/login" className="text-[#4338ca] hover:underline">
                Login
              </Link>
            </p>
          </div>
        </form>
      </AuthCard>
    </motion.div>
  );
}
