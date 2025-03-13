'use client';

import { useState, useEffect } from 'react';
import Add from './Add';
import { Product } from '@/lib/type/Product';
import { ProductVariant } from '@/lib/type/ProductVariant';

const CustomizeProducts = ({ product }: { product: Product }) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  const colors = Array.from(new Set(product.productVariants.map((v) => v.color)));
  const sizes = Array.from(new Set(product.productVariants.map((v) => v.size)));
  useEffect(() => {
    if (selectedColor && selectedSize) {
      const variant = product.productVariants.find(
        (v) => v.color === selectedColor && v.size === selectedSize,
      );
      setSelectedVariant(variant ?? null);
    } else {
      setSelectedVariant(null);
    }
  }, [selectedColor, selectedSize, product.productVariants]);

  const isVariantAvailable = (color: string, size: string) => {
    return product.productVariants.some(
      (v) => v.color === color && v.size === size && v.stockQuantity > 0,
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Chọn màu sắc */}
      <div className="flex flex-col gap-4">
        <h4 className="font-medium">Choose a Color</h4>
        <ul className="flex items-center gap-3">
          {colors.map((color) => {
            const isDisabled = !sizes.some((size) => isVariantAvailable(color, size));
            return (
              <li
                key={color}
                className={`w-8 h-8 rounded-full ring-1 ring-gray-300 cursor-pointer relative ${
                  selectedColor === color ? 'ring-2 ring-black' : ''
                }`}
                style={{
                  backgroundColor: color,
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  opacity: isDisabled ? 0.5 : 1,
                }}
                onClick={() => !isDisabled && setSelectedColor(color)}
              />
            );
          })}
        </ul>
      </div>

      {/* Chọn kích thước */}
      <div className="flex flex-col gap-4">
        <h4 className="font-medium">Choose a Size</h4>
        <ul className="flex items-center gap-3">
          {sizes.map((size) => {
            const isDisabled = !selectedColor || !isVariantAvailable(selectedColor, size);
            return (
              <li
                key={size}
                className={`ring-1 ring-lama text-lama rounded-md py-1 px-4 text-sm ${
                  selectedSize === size ? 'bg-pink-500 text-white' : 'bg-white'
                }`}
                style={{
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  opacity: isDisabled ? 0.5 : 1,
                }}
                onClick={() => !isDisabled && setSelectedSize(size)}
              >
                {size}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Nút thêm vào giỏ hàng */}
      <Add
        product={product}
        variant={selectedVariant}
        stockQuantity={selectedVariant?.stockQuantity}
      />
    </div>
  );
};

export default CustomizeProducts;
