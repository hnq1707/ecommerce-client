'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CouponInput } from './coupon-input';
import { AppliedCoupon } from './appiled-coupon';
import { AvailableCoupons } from './available-coupon';
import {
  type Coupon,
  getActiveCoupons,
  validateCoupon,
  getCouponByCode,
  applyCoupon,
} from '@/lib/utils/coupon-service';

interface CouponSelectorProps {
  orderAmount: number;
  onApplyCoupon: (coupon: Coupon, discountAmount: number) => void;
  onRemoveCoupon: () => void;
  appliedCoupon: Coupon | null;
}

export function CouponSelector({
  orderAmount,
  onApplyCoupon,
  onRemoveCoupon,
  appliedCoupon,
}: CouponSelectorProps) {
  const { toast } = useToast();
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [activeCoupons, setActiveCoupons] = useState<Coupon[]>([]);
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(false);

  // Fetch active coupons when component mounts
  useEffect(() => {
    fetchActiveCoupons();
  }, []);

  const fetchActiveCoupons = async () => {
    try {
      setIsLoadingCoupons(true);
      const coupons = await getActiveCoupons();
      setActiveCoupons(coupons);
    } catch (error) {
      console.error('Error fetching active coupons:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể lấy danh sách mã giảm giá',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingCoupons(false);
    }
  };

  const handleValidateCoupon = async (code: string) => {
    if (!code.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập mã giảm giá',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsApplyingCoupon(true);

      // Kiểm tra và tính toán giảm giá
      const validationResult = await validateCoupon(code, orderAmount);

      if (validationResult.valid) {
        // Lấy thông tin chi tiết về coupon
        const couponData = await getCouponByCode(code);

        // Gọi callback để cập nhật state ở component cha
        onApplyCoupon(couponData, validationResult.discountAmount);

        toast({
          title: 'Thành công',
          description: `Đã áp dụng mã giảm giá: ${validationResult.message}`,
          variant: 'default',
        });

        // Đánh dấu coupon đã được sử dụng
        console.log(code)
        await applyCoupon(code);
      } else {
        toast({
          title: 'Lỗi',
          description: validationResult.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error validating coupon:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể áp dụng mã giảm giá. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Mã Giảm Giá</CardTitle>
        <CardDescription>Nhập mã giảm giá hoặc chọn từ danh sách có sẵn</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {appliedCoupon ? (
          <AppliedCoupon coupon={appliedCoupon} onRemove={onRemoveCoupon} />
        ) : (
          <>
            <CouponInput onApply={handleValidateCoupon} isLoading={isApplyingCoupon} />

            <AvailableCoupons
              coupons={activeCoupons}
              isLoading={isLoadingCoupons}
              onSelectCoupon={(coupon) => handleValidateCoupon(coupon.code)}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
