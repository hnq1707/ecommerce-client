import type { Metadata } from 'next';
import CheckoutForm from '@/components/checkout/checkout-form';

export const metadata: Metadata = {
  title: 'Thanh Toán',
  description: 'Hoàn tất đơn hàng của bạn',
};

export default function CheckoutPage() {
  return (
    <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
      <div className="mx-auto">
        <h1 className="text-3xl font-bold mb-8">Thanh Toán</h1>
        <CheckoutForm />
      </div>
    </div>
  );
}
