"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AuthCard } from "../auth-card";
import { Icons } from "@/components/icons";
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
export default function RegisterPage() {
  const { toast } = useToast();
  const router = useRouter();
  // const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { loading } = useAuthStore();
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match.",
      });
      return;
    }

    // setLoading(true);
    try {
      await auth.register(
        formData.email,
        formData.password,
        formData.confirmPassword,
        formData.first_name,
        formData.last_name
      );
      toast({
        title: 'Success',
        description: 'Registration successful. Please verify your email.',
      });
      router.push(`/auth/otp?email=${encodeURIComponent(formData.email)}`);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to register',
      });
      console.log(error);
    } finally {
      // setLoading(false);
    }
  };

  return (
    <AuthCard 
      title="Create Account" 
      description="Join us and get started with your journey"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Input */}
        <div className="space-y-2">
          <Label htmlFor="first_name" className="text-sm font-medium">First Name</Label>
          <div className="relative">
            <Icons.user className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              id="first_name"
              type="text"
              placeholder="Enter your first name"
              value={formData.first_name}
              onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
              required
              className="pl-9 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name" className="text-sm font-medium">Last Name</Label>
          <div className="relative">
            <Icons.user className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              id="last_name"
              type="text"
              placeholder="Enter your last name"
              value={formData.last_name}
              onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
              required
              className="pl-9 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Email Input */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">Email</Label>
          <div className="relative">
            <Icons.mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              className="pl-9 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">Password</Label>
          <div className="relative">
            <Icons.lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
              minLength={8}
              className="pl-9 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Confirm Password Input */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
          <div className="relative">
            <Icons.lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              required
              minLength={8}
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
            disabled={loading || formData.password !== formData.confirmPassword}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Icons.spinner className="h-4 w-4 animate-spin" />
                <span>Creating account...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Icons.check className="h-4 w-4" />
                <span>Create Account</span>
              </div>
            )}
          </Button>
        </motion.div>

        {/* Login Link */}
        <div className="text-center text-sm">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link 
              href="/auth/login" 
              className="text-indigo-600 hover:text-indigo-500 hover:underline transition-colors font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthCard>
  );
}
