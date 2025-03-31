'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CouponInputProps {
  onApply: (code: string) => void;
  isLoading: boolean;
}

export function CouponInput({ onApply, isLoading }: CouponInputProps) {
  const [couponCode, setCouponCode] = useState('');

  const handleApply = () => {
    if (couponCode.trim()) {
      onApply(couponCode);
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Nhập mã giảm giá"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
      />
      <Button
        type="button"
        variant="outline"
        onClick={handleApply}
        disabled={isLoading || !couponCode.trim()}
      >
        {isLoading ? 'Đang áp dụng...' : 'Áp dụng'}
      </Button>
    </div>
  );
}
