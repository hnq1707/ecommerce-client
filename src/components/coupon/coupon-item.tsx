'use client';

import { Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type Coupon, formatDiscount, formatMinimumPurchase } from '@/lib/utils/coupon-service';
interface CouponItemProps {
  coupon: Coupon;
  onSelect: (coupon: Coupon) => void;
}

export function CouponItem({ coupon, onSelect }: CouponItemProps) {
  return (
    <div
      className="flex items-center justify-between p-3 border rounded-md hover:bg-muted cursor-pointer"
      onClick={() => onSelect(coupon)}
    >
      <div className="flex items-center gap-2">
        <Tag className="h-5 w-5 text-primary" />
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium">{coupon.code}</p>
            <Badge variant="outline" className="text-xs">
              {formatDiscount(coupon)}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{coupon.description}</p>
          {formatMinimumPurchase(coupon) && (
            <p className="text-xs text-muted-foreground">{formatMinimumPurchase(coupon)}</p>
          )}
        </div>
      </div>
      <Button variant="ghost" size="sm" className="ml-auto" type="button">
        Áp dụng
      </Button>
    </div>
  );
}
