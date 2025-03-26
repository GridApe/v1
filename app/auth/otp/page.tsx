"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AuthCard } from "../auth-card";
import { useAuth } from "@/hooks/useAuth";
import { LoaderCircle, Key } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function OTPPage() {
  const { toast } = useToast();
  const auth = useAuth();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const email = searchParams.get("email") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await auth.verify(email, otp);
      toast({
        title: "Success",
        description: "Your email has been verified successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to verify OTP",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      await auth.resend(email);
      toast({
        title: "Success",
        description: "A new OTP has been sent to your email.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to resend OTP",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard 
      title="Verify Your Email" 
      description="Enter the verification code sent to your email address"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* OTP Input */}
        <div className="space-y-2">
          <Label htmlFor="otp" className="text-sm font-medium">Verification Code</Label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              id="otp"
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
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
                <span>Verifying...</span>
              </div>
            ) : (
              "Verify Code"
            )}
          </Button>
        </motion.div>

        {/* Resend OTP Button */}
        <Button
          type="button"
          variant="outline"
          className="w-full text-indigo-600 hover:text-indigo-500 hover:bg-indigo-50"
          onClick={handleResendOTP}
          disabled={loading}
        >
          Resend Code
        </Button>

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
