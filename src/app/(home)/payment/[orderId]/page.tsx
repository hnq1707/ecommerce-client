import type { Metadata } from "next"
import { PaymentForm } from "@/components/payment/payment-form"

export const metadata: Metadata = {
  title: "Thanh Toán",
  description: "Hoàn tất thanh toán của bạn",
}

export default function PaymentPage({ params }: { params: { orderId: string } }) {
  return (
    <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
      <div className="mx-auto">
        <h1 className="text-3xl font-bold mb-8">Hoàn Tất Thanh Toán</h1>
        <PaymentForm orderId={params.orderId} />
      </div>
    </div>
  );
}

