/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useAuth } from '@/lib/redux/features/auth/useAuth';
import type { VerifyRequest } from '@/lib/redux/features/auth/authTypes';
import { useSelector } from 'react-redux';
import type { RootState } from '@/lib/redux/store';
import { Check, Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';

export default function VerifyEmail() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const router = useRouter();
  const { verify, renewVerification } = useAuth();
  const { toast } = useToast();

  const isVerified = useSelector((state: RootState) => state.auth.verify);

  useEffect(() => {
    if (isVerified) {
      setVerificationSuccess(true);
      toast({
        title: 'Xác minh thành công!',
        description: 'Email của bạn đã được xác minh. Đang chuyển hướng...',
        variant: 'default',
        duration: 3000,
      });

      // Chờ 2 giây trước khi chuyển hướng để người dùng thấy thông báo thành công
      const redirectTimer = setTimeout(() => {
        router.push('/login');
      }, 2000);

      return () => clearTimeout(redirectTimer);
    }
  }, [isVerified, router, toast]);

  useEffect(() => {
    // Lấy email từ sessionStorage
    const storedEmail = sessionStorage.getItem('email');
    if (!storedEmail) {
      router.push('/signup');
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  // Đếm ngược thời gian gửi lại mã
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown((prev) => prev - 1), 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const handleSubmit = async () => {
    if (otp.length < 6) {
      setError('Vui lòng nhập đầy đủ mã xác minh 6 số.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data: VerifyRequest = { email: email as string, code: otp };
      await verify(data);
    } catch (err) {
      setError('Mã xác minh không đúng hoặc đã hết hạn.');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || resendDisabled) return;

    setResendDisabled(true);
    setResendCountdown(60); // Đặt thời gian chờ 60 giây
    setError('');

    try {
      await renewVerification({ email });
      toast({
        title: 'Đã gửi lại mã xác minh',
        description: `Vui lòng kiểm tra hộp thư ${email} để nhận mã xác minh mới.`,
        variant: 'default',
      });
    } catch (err: any) {
      setError('Không thể gửi lại mã, vui lòng thử lại sau.');
      console.log(err);
      setResendDisabled(false);
      setResendCountdown(0);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="max-w-md mx-auto p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800 mt-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Toaster />

      {verificationSuccess ? (
        <motion.div
          className="flex flex-col items-center justify-center py-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">Xác Minh Thành Công!</h2>
          <p className="text-gray-600 dark:text-gray-300 text-center">
            Email của bạn đã được xác minh. Đang chuyển hướng...
          </p>
        </motion.div>
      ) : (
        <>
          <motion.div variants={itemVariants} className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
          </motion.div>

          <motion.h2 variants={itemVariants} className="text-2xl font-bold text-center">
            Xác Minh Địa Chỉ Email
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-sm text-gray-600 dark:text-gray-300 my-4 text-center"
          >
            Mã xác minh đã được gửi đến <span className="font-semibold">{email}</span>
          </motion.p>

          <motion.div variants={itemVariants} className="flex justify-center mb-6">
            <InputOTP
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
              value={otp}
              onChange={(value) => {
                setOtp(value);
                if (error && value.length === 6) setError('');
              }}
              className="flex justify-center gap-2"
            >
              <InputOTPGroup>
                {[...Array(6)].map((_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="transition-all duration-200 border-2 focus:ring-2 focus:ring-primary/50 focus:border-primary w-12 h-12 text-lg"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </motion.div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mb-4 text-center bg-red-50 dark:bg-red-900/20 p-2 rounded-md"
            >
              {error}
            </motion.p>
          )}

          <motion.div variants={itemVariants}>
            <Button
              className="w-full h-12 text-base font-medium transition-all duration-300 hover:scale-[1.02]"
              onClick={handleSubmit}
              type="submit"
              disabled={loading || otp.length < 6}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
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
                  Đang xác minh...
                </div>
              ) : (
                'Xác Minh Ngay'
              )}
            </Button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex justify-between items-center mt-6 text-sm"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={handleResend}
              disabled={resendDisabled}
              className="flex items-center gap-1 transition-all hover:bg-primary/5"
            >
              {resendDisabled ? (
                <span className="flex items-center">
                  <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                  {resendCountdown}s
                </span>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Gửi lại mã
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-1 transition-all hover:bg-primary/5"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Quay lại
            </Button>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-xs text-gray-500 dark:text-gray-400 mt-6 text-center"
          >
            Nếu bạn không nhận được mã, vui lòng kiểm tra thư mục spam hoặc gửi lại mã.
          </motion.p>
        </>
      )}
    </motion.div>
  );
}
