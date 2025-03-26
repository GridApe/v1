"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { AuthCard } from "../auth-card";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { LoaderCircle, LockIcon, Mail } from "lucide-react";

export default function LoginPage() {
  const { toast } = useToast();
  const auth = useAuth();
  const { user, loading } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // Handle input changes efficiently
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  }, []);

  // Handle checkbox change
  const handleCheckboxChange = useCallback((checked: boolean) => {
    setFormData((prev) => ({ ...prev, rememberMe: checked }));
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await auth.login(formData.email, formData.password);
      toast({
        title: "Success",
        description: "Welcome back! You've successfully logged in.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
      });
    }
  };

  return (
    <AuthCard 
      title="Welcome Back" 
      description="Sign in to your account to continue"
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
              value={formData.email}
              onChange={handleInputChange}
              required
              className="pl-9 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">Password</Label>
          <div className="relative">
            <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="pl-9 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="rememberMe" 
              checked={formData.rememberMe} 
              onCheckedChange={handleCheckboxChange}
              className="border-gray-300 focus:ring-indigo-500" 
            />
            <Label htmlFor="rememberMe" className="text-gray-600 dark:text-gray-400">Remember me</Label>
          </div>
          <Link 
            href="/auth/forgot-password" 
            className="text-indigo-600 hover:text-indigo-500 hover:underline transition-colors"
          >
            Forgot password?
          </Link>
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
                <span>Signing in...</span>
              </div>
            ) : (
              "Sign in"
            )}
          </Button>
        </motion.div>

        {/* Register Link */}
        <div className="text-center text-sm">
          <p className="text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link 
              href="/auth/register" 
              className="text-indigo-600 hover:text-indigo-500 hover:underline transition-colors font-medium"
            >
              Create one now
            </Link>
          </p>
        </div>
      </form>
    </AuthCard>
  );
}
