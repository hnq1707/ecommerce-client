'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';

export default function VerifyEmail() {
  const [otp, setOtp] = useState('');
   const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();
  useEffect(() => {
    // Lấy email từ sessionStorage
    const storedEmail = sessionStorage.getItem('email');
    if (!storedEmail) {
      router.push('/signup'); // Nếu không có email, quay lại trang đăng ký
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  const handleSubmit = async () => {
    if (otp.length < 6) {
      setError('Vui lòng nhập đầy đủ mã xác minh.');
      return;
    }

    try {
        const code = otp;
      const res = await fetch('http://localhost:8080/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      if (res.ok) {
        router.push('/login');
      } else {
        setError('Mã xác minh không đúng. Vui lòng thử lại.');
      }
    } catch (err) {
      setError('Có lỗi xảy ra, vui lòng thử lại.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 text-center">
      <h2 className="text-2xl font-bold">VERIFY YOUR EMAIL ADDRESS</h2>
      <p className="text-sm text-gray-600 my-4">
        A verification code has been sent to <span className="font-semibold">****@email.com</span>
      </p>
      <div className="flex justify-center gap-2 mb-4">
        <InputOTP
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
          value={otp}
          onChange={setOtp}
          className="flex justify-center gap-2 mb-4"
        >
          <InputOTPGroup>
            {[...Array(6)].map((_, index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <Button className="w-full" onClick={handleSubmit}>
        Verify
      </Button>
      <div className="flex justify-between text-sm mt-4">
        <button className="text-blue-500">Resend code</button>
        <button className="text-blue-500">Change email</button>
      </div>
    </div>
  );
}
