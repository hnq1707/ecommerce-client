// app/payment/[orderId]/page.tsx
import { PaymentForm } from '@/components/payment/payment-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thanh Toán',
  description: 'Hoàn tất thanh toán của bạn',
};
interface PageProps {
  // Next.js 15 expects params là một Promise
  params: Promise<{ orderId: string }>;
}

export default async function PaymentPage({ params }: PageProps) {
  // phải await params vì nó là Promise
  const { orderId } = await params;
  return (
    <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
      <div className="mx-auto">
        <h1 className="text-3xl font-bold mb-8">Hoàn Tất Thanh Toán</h1>
        <PaymentForm orderId={orderId} />
      </div>
    </div>
  );
}
