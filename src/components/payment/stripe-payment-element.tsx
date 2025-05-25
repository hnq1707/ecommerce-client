'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useDispatch, useSelector } from 'react-redux';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { updatePaymentStatus, selectPaymentStatus, selectPaymentError } from '@/lib/redux/features/order/orderSlice';
import { AppDispatch } from '@/lib/redux/store';

interface StripePaymentElementProps {
  orderId: string;
  amount: number;
}

export function StripePaymentElement({ orderId, amount }: StripePaymentElementProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch<AppDispatch>();

  // Redux state
  const paymentStatus = useSelector(selectPaymentStatus);
  const paymentError = useSelector(selectPaymentError);

  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; content: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js chưa được tải.
      // Đảm bảo vô hiệu hóa việc gửi biểu mẫu cho đến khi Stripe.js đã được tải.
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Đảm bảo thay đổi điều này thành trang hoàn tất thanh toán của bạn
          return_url: `${window.location.origin}/orders/${orderId}/confirmation`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setMessage({
          type: 'error',
          content: error.message || 'Đã xảy ra lỗi không mong muốn.',
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        dispatch(
          updatePaymentStatus({
            orderId: orderId,
            paymentIntentId: paymentIntent.id,
            status: 'succeeded',
          }),
        );

        setMessage({
          type: 'success',
          content: 'Thanh toán thành công! Đang chuyển hướng đến trang xác nhận đơn hàng...',
        });

        // Chuyển hướng đến trang xác nhận đơn hàng
        setTimeout(() => {
          router.push(`/orders/${orderId}/confirmation`);
        }, 2000);
      } else {
        setMessage({
          type: 'error',
          content: 'Trạng thái thanh toán: ' + (paymentIntent?.status || 'không xác định'),
        });
      }
    } catch (err) {
      console.error('Lỗi thanh toán:', err);
      setMessage({
        type: 'error',
        content: 'Đã xảy ra lỗi không mong muốn trong quá trình xử lý thanh toán.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-6">
        {message && (
          <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
            {message.type === 'error' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
            <AlertTitle>{message.type === 'error' ? 'Thanh Toán Thất Bại' : 'Thanh Toán Thành Công'}</AlertTitle>
            <AlertDescription>{message.content}</AlertDescription>
          </Alert>
        )}

        {paymentError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Lỗi Cập Nhật Trạng Thái</AlertTitle>
            <AlertDescription>{paymentError}</AlertDescription>
          </Alert>
        )}

        <PaymentElement />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tổng Đơn Hàng</span>
            <span className="font-medium">${amount.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="pt-6">
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isProcessing || !stripe || !elements || paymentStatus === 'loading'}
        >
          {isProcessing || paymentStatus === 'loading' ? 'Đang xử lý...' : `Thanh Toán $${amount.toFixed(2)}`}
        </Button>
      </CardFooter>
    </form>
  );
}

