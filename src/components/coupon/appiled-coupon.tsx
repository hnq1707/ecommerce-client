'use client';

import { X, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type Coupon, formatDiscount } from '@/lib/utils/coupon-service';

interface AppliedCouponProps {
  coupon: Coupon;
  onRemove: () => void;
}

export function AppliedCoupon({ coupon, onRemove }: AppliedCouponProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-muted rounded-md">
      <div className="flex items-center gap-2">
        <Tag className="h-5 w-5 text-primary" />
        <div>
          <p className="font-medium">{coupon.code}</p>
          <p className="text-sm text-muted-foreground">
            {formatDiscount(coupon)}
            {coupon.description && ` - ${coupon.description}`}
          </p>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={onRemove} type="button">
        <X className="h-4 w-4" />
        <span className="sr-only">Xóa mã giảm giá</span>
      </Button>
    </div>
  );
}
