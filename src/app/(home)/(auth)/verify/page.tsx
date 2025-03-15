/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useAuth } from '@/lib/redux/features/auth/useAuth';
import { VerifyRequest } from '@/lib/redux/features/auth/authTypes';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';

export default function VerifyEmail() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const router = useRouter();
  const { verify, renewVerification } = useAuth();

  const isVerified = useSelector((state: RootState) => state.auth.verify);

  useEffect(() => {
    if (isVerified) {
      router.push('/login');
    }
  }, [isVerified, router]);
  useEffect(() => {
    // Lấy email từ sessionStorage
    const storedEmail = sessionStorage.getItem('email');
    if (!storedEmail) {
      router.push('/signup');
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  const handleSubmit = async () => {
    if (otp.length < 6) {
      setError('Vui lòng nhập đầy đủ mã xác minh.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data: VerifyRequest = { email: email as string, code: otp };
      await verify(data);
    } catch (err) {
      setError('Mã xác minh không đúng hoặc có lỗi xảy ra.');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;

    setResendDisabled(true);
    setError('');

    try {
      await renewVerification({ email });
      alert(`Mã xác minh đã được gửi lại.Vui lòng kiểm tra ${email} để nhận mã xác minh mới.`);
    } catch (err: any) {
      setError('Không thể gửi lại mã, vui lòng thử sau.');
      console.log(err);
    } finally {
      setResendDisabled(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 text-center">
      <h2 className="text-2xl font-bold">VERIFY YOUR EMAIL ADDRESS</h2>
      <p className="text-sm text-gray-600 my-4">
        A verification code has been sent to <span className="font-semibold">{email}</span>
      </p>

      <div className="flex justify-center gap-2 mb-4">
        <InputOTP
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
          value={otp}
          onChange={setOtp}
          className="flex justify-center gap-2"
        >
          <InputOTPGroup>
            {[...Array(6)].map((_, index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <Button className="w-full" onClick={handleSubmit} type="submit" disabled={loading}>
        {loading ? (
          <>
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
            Verifying ...
          </>
        ) : (
          'Verify Now'
        )}
      </Button>

      <div className="flex justify-between text-sm mt-4">
        <Button onClick={handleResend} disabled={resendDisabled}>
          {resendDisabled ? 'Please wait...' : 'Resend code'}
        </Button>
        <Button onClick={() => router.back()}>Go back</Button>
      </div>
    </div>
  );
}
