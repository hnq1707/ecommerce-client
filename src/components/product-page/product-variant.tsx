'use client';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ProductVariant } from '@/lib/types/ProductVariant';

interface ProductVariantsProps {
  variants: ProductVariant[];
  onVariantsChange: (variants: ProductVariant[]) => void;
  productId: string;
}

export function ProductVariants({ variants, onVariantsChange, productId }: ProductVariantsProps) {
  // Xử lý thêm biến thể mới
  const handleAddVariant = () => {
    onVariantsChange([
      ...variants,
      {
        id: crypto.randomUUID().toString(),
        color: '',
        size: '',
        stockQuantity: 0,
        productId,
      },
    ]);
  };

  // Xử lý xóa biến thể
  const handleDeleteVariant = (index: number) => {
    const updatedVariants = [...variants];
    updatedVariants.splice(index, 1);
    onVariantsChange(updatedVariants);
  };

  // Xử lý cập nhật biến thể
  const handleUpdateVariant = (
    index: number,
    field: keyof ProductVariant,
    value: string | number,
  ) => {
    const updatedVariants = [...variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: field === 'stockQuantity' ? Number(value) : value,
    };
    onVariantsChange(updatedVariants);
  };

  return (
    <div className="space-y-4">
      {variants.map((variant, index) => (
        <div key={index} className="flex items-center gap-4 p-4 border rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
            <div className="grid gap-2">
              <Label htmlFor={`variant-color-${index}`}>Màu sắc</Label>
              <Input
                id={`variant-color-${index}`}
                value={variant.color ?? ''}
                onChange={(e) => handleUpdateVariant(index, 'color', e.target.value)}
                placeholder="Màu sắc"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`variant-size-${index}`}>Kích thước</Label>
              <Input
                id={`variant-size-${index}`}
                value={variant.size ?? ''}
                onChange={(e) => handleUpdateVariant(index, 'size', e.target.value)}
                placeholder="Kích thước"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`variant-stock-${index}`}>Số lượng</Label>
              <Input
                id={`variant-stock-${index}`}
                type="number"
                value={variant.stockQuantity ?? ''}
                onChange={(e) => handleUpdateVariant(index, 'stockQuantity', e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => handleDeleteVariant(index)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}

      <Button variant="outline" onClick={handleAddVariant}>
        <Plus className="mr-2 h-4 w-4" />
        Thêm biến thể
      </Button>
    </div>
  );
}
