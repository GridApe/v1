'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Check, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Simulated API calls
const api = {
  register: async (data: any) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true };
  },
  verifyEmail: async (email: string, otp: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true };
  },
  resendVerification: async (email: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true };
  },
  login: async (data: any) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true };
  },
};

export default function Component() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
    fullName: '',
    phoneNumber: '',
    country: '',
    state: '',
    businessName: '',
    businessEmail: '',
    businessPhone: '',
    businessAddress: '',
    logo: null as File | null,
  });
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 4) {
        const nextInput = document.querySelector(
          `input[name="otp-${index + 1}"]`
        ) as HTMLInputElement;
        nextInput?.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await api.login({
          email: formData.email,
          password: formData.password,
        });
        if (res.success) {
          router.push('/dashboard');
        }
      } else {
        if (step === 1) {
          const res = await api.register(formData);
          if (res.success) setStep(2);
        } else if (step === 2) {
          const res = await api.verifyEmail(formData.email, otp.join(''));
          if (res.success) setStep(3);
        } else if (step === 3) {
          setStep(4);
        } else if (step === 4) {
          router.push('/dashboard');
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const slideAnimation = {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#4338ca] p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${mode}-${step}`}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={slideAnimation}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <Card className="w-full">
            <CardHeader className="space-y-1 flex items-center">
              <div className="w-12 h-12 mb-4">
                <svg viewBox="0 0 24 24" fill="#4338ca" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" />
                </svg>
              </div>
              <CardTitle className="text-2xl">
                {mode === 'login'
                  ? 'Login'
                  : step === 1
                    ? 'Sign up'
                    : step === 2
                      ? 'Verify Email'
                      : step === 3
                        ? 'Basic Information'
                        : 'Business Information'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'login' ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          checked={formData.rememberMe}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, rememberMe: checked as boolean })
                          }
                        />
                        <Label htmlFor="remember">Remember me</Label>
                      </div>
                      <Link href="/forgot-password" className="text-sm text-[#4338ca]">
                        Forgot password?
                      </Link>
                    </div>
                  </>
                ) : step === 1 ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter password"
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
                        placeholder="Re-enter password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({ ...formData, confirmPassword: e.target.value })
                        }
                        required
                      />
                    </div>
                  </>
                ) : step === 2 ? (
                  <div className="space-y-4">
                    <p className="text-center text-sm text-muted-foreground">
                      Enter OTP sent to {formData.email}
                    </p>
                    <div className="flex justify-center gap-2">
                      {otp.map((digit, index) => (
                        <Input
                          key={index}
                          name={`otp-${index}`}
                          type="text"
                          maxLength={1}
                          className="w-12 h-12 text-center text-lg"
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          required
                        />
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="link"
                      className="w-full"
                      onClick={() => api.resendVerification(formData.email)}
                    >
                      Resend OTP
                    </Button>
                  </div>
                ) : step === 3 ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full name</Label>
                      <Input
                        id="fullName"
                        placeholder="Enter full name"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone number</Label>
                      <Input
                        id="phoneNumber"
                        placeholder="Enter phone number"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Select
                          value={formData.country}
                          onValueChange={(value) => setFormData({ ...formData, country: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="ca">Canada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Select
                          value={formData.state}
                          onValueChange={(value) => setFormData({ ...formData, state: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ny">New York</SelectItem>
                            <SelectItem value="ca">California</SelectItem>
                            <SelectItem value="tx">Texas</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business name</Label>
                      <Input
                        id="businessName"
                        placeholder="Enter business name"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessEmail">Business Email</Label>
                      <Input
                        id="businessEmail"
                        type="email"
                        placeholder="Enter business email"
                        value={formData.businessEmail}
                        onChange={(e) =>
                          setFormData({ ...formData, businessEmail: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessPhone">Business phone number</Label>
                      <Input
                        id="businessPhone"
                        placeholder="Enter business number"
                        value={formData.businessPhone}
                        onChange={(e) =>
                          setFormData({ ...formData, businessPhone: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessAddress">Business Address</Label>
                      <Input
                        id="businessAddress"
                        placeholder="Enter business address"
                        value={formData.businessAddress}
                        onChange={(e) =>
                          setFormData({ ...formData, businessAddress: e.target.value })
                        }
                        required
                      />
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  className="w-full bg-[#4338ca] hover:bg-[#3730a3]"
                  disabled={loading}
                >
                  {loading
                    ? 'Please wait...'
                    : mode === 'login'
                      ? 'Login'
                      : step === 1
                        ? 'Sign up'
                        : step === 2
                          ? 'Verify'
                          : 'Next'}
                </Button>

                <div className="text-center text-sm">
                  {mode === 'login' ? (
                    <p>
                      Don&apos;t have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setMode('register')}
                        className="text-[#4338ca] hover:underline"
                      >
                        Sign up
                      </button>
                    </p>
                  ) : (
                    <p>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setMode('login')}
                        className="text-[#4338ca] hover:underline"
                      >
                        Login
                      </button>
                    </p>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
