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
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <AuthCard title="Login">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="focus:ring-[#4338ca] focus:border-[#4338ca]"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="focus:ring-[#4338ca] focus:border-[#4338ca]"
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Checkbox id="rememberMe" checked={formData.rememberMe} onCheckedChange={handleCheckboxChange} />
              <Label htmlFor="rememberMe">Remember me</Label>
            </div>
            <Link href="/auth/forgot-password" className="text-[#4338ca] hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              type="submit"
              className="w-full bg-[#4338ca] hover:bg-[#3730a3] transition-all focus:ring-4 focus:ring-[#4338ca]/50"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </motion.div>

          {/* Register Link */}
          <div className="text-center text-sm">
            <p>
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-[#4338ca] hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </AuthCard>
    </motion.div>
  );
}
