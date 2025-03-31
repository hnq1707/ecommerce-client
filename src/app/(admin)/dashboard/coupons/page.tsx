import type { Metadata } from 'next';
import { CouponManagement } from '@/components/coupon-management/coupon-mangement';

export const metadata: Metadata = {
  title: 'Quản lý mã giảm giá',
  description: 'Quản lý các mã giảm giá trong hệ thống',
};

export default function CouponsPage() {
  return (
    <div className="container mx-auto py-6">
      <CouponManagement />
    </div>
  );
}
