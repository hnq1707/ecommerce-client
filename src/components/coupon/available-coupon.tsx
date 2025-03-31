'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CouponItem } from './coupon-item';
import type { Coupon } from '@/lib/utils/coupon-service';;

interface AvailableCouponsProps {
  coupons: Coupon[];
  isLoading: boolean;
  onSelectCoupon: (coupon: Coupon) => void;
}

export function AvailableCoupons({ coupons, isLoading, onSelectCoupon }: AvailableCouponsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="flex w-full justify-between p-0" type="button">
          <span className="text-sm font-medium">
            {coupons.length > 0
              ? `${coupons.length} mã giảm giá khả dụng`
              : 'Không có mã giảm giá khả dụng'}
          </span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        {isLoading ? (
          <div className="text-center py-2">Đang tải mã giảm giá...</div>
        ) : coupons.length > 0 ? (
          <div className="space-y-2">
            {coupons.map((coupon) => (
              <CouponItem key={coupon.id} coupon={coupon} onSelect={onSelectCoupon} />
            ))}
          </div>
        ) : (
          <div className="text-center py-2 text-muted-foreground">
            Không có mã giảm giá khả dụng
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
