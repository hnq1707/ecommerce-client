/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { cn } from '@/lib/utils/utils';
import type React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import GitHubLogin from './github-login';
import GoogleLogin from './google-login';

export function SignupForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    };

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Họ là bắt buộc';
      isValid = false;
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'Họ phải có ít nhất 2 ký tự';
      isValid = false;
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Tên là bắt buộc';
      isValid = false;
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Tên phải có ít nhất 2 ký tự';
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Vui lòng nhập địa chỉ email hợp lệ';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường và một số';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Đăng ký thất bại');
      sessionStorage.setItem('email', formData.email);
      console.log('Redirecting to /verify...');
      router.push('/verify');
    } catch (err) {
      setError((err as any).message);
    } finally {
      setLoading(false);
    }
  };

  // Tính toán độ mạnh của mật khẩu
  const calculatePasswordStrength = (password: string) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const passwordStrength = calculatePasswordStrength(formData.password);
  const passwordStrengthText = ['Rất yếu', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'][
    passwordStrength
  ];
  const passwordStrengthColor = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-green-600',
  ][passwordStrength];

  return (
    <div className={cn('flex flex-col gap-6 w-full max-w-md mx-auto', className)} {...props}>
      <Card className="border-none shadow-lg">
        <CardHeader className="space-y-1 text-center pb-2">
          <CardTitle className="text-2xl font-bold">Tạo tài khoản</CardTitle>
          <CardDescription className="text-muted-foreground">
            Đăng ký để bắt đầu sử dụng dịch vụ
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="flex flex-col gap-3 mb-4">
            <GitHubLogin />
            <GoogleLogin />
          </div>

          <div className="relative my-4">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
              Hoặc đăng ký bằng email
            </span>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  Họ
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Nguyễn"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={cn(
                    'h-10 transition-all',
                    errors.firstName ? 'border-red-500 focus-visible:ring-red-500' : '',
                  )}
                />
                {errors.firstName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs flex items-center gap-1"
                  >
                    <AlertCircle className="h-3 w-3" /> {errors.firstName}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Tên
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Văn A"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={cn(
                    'h-10 transition-all',
                    errors.lastName ? 'border-red-500 focus-visible:ring-red-500' : '',
                  )}
                />
                {errors.lastName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs flex items-center gap-1"
                  >
                    <AlertCircle className="h-3 w-3" /> {errors.lastName}
                  </motion.p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
                className={cn(
                  'h-10 transition-all',
                  errors.email ? 'border-red-500 focus-visible:ring-red-500' : '',
                )}
              />
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs flex items-center gap-1"
                >
                  <AlertCircle className="h-3 w-3" /> {errors.email}
                </motion.p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Mật khẩu
                </Label>
                {formData.password && (
                  <span className="text-xs text-muted-foreground">
                    Độ mạnh:{' '}
                    <span
                      className={`font-medium ${
                        passwordStrength >= 3 ? 'text-green-600' : 'text-orange-500'
                      }`}
                    >
                      {passwordStrengthText}
                    </span>
                  </span>
                )}
              </div>

              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className={cn(
                    'h-10 pr-10 transition-all',
                    errors.password ? 'border-red-500 focus-visible:ring-red-500' : '',
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {formData.password && (
                <div className="h-1 w-full grid grid-cols-5 gap-1 mt-1">
                  {[0, 1, 2, 3, 4].map((index) => (
                    <div
                      key={index}
                      className={cn(
                        'h-full rounded-full transition-colors',
                        index < passwordStrength ? passwordStrengthColor : 'bg-gray-200',
                      )}
                    />
                  ))}
                </div>
              )}

              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs flex items-center gap-1"
                >
                  <AlertCircle className="h-3 w-3" /> {errors.password}
                </motion.p>
              )}

              <p className="text-xs text-muted-foreground mt-1">
                Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-md bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2"
              >
                <AlertCircle className="h-4 w-4" /> {error}
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full h-10 font-medium transition-all"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                    ></path>
                  </svg>
                  Đang đăng ký...
                </div>
              ) : (
                'Đăng ký'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center pt-0">
          <p className="text-sm text-muted-foreground">
            Đã có tài khoản?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Đăng nhập
            </Link>
          </p>
        </CardFooter>
      </Card>
      <p className="text-center text-xs text-muted-foreground px-6">
        Bằng cách đăng ký, bạn đồng ý với{' '}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Điều khoản dịch vụ
        </a>{' '}
        và{' '}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Chính sách bảo mật
        </a>{' '}
        của chúng tôi.
      </p>
    </div>
  );
}
