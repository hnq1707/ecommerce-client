'use client';

import { useState, useEffect } from 'react';
import Add from './Add';
import { Product } from '@/lib/type/Product';
import { ProductVariant } from '@/lib/type/ProductVariant';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertCircle } from 'lucide-react';

interface CustomizeProductsProps {
  product: Product;
}

const CustomizeProducts = ({ product }: CustomizeProductsProps) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);

  // Extract unique colors and sizes
  const colors = Array.from(new Set(product.productVariants.map((v) => v.color)));
  const sizes = Array.from(new Set(product.productVariants.map((v) => v.size)));

  // Update selected variant when color or size changes
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

  // Update available sizes when color changes
  useEffect(() => {
    if (selectedColor) {
      const availableSizesForColor = product.productVariants
        .filter((v) => v.color === selectedColor)
        .map((v) => v.size);
      setAvailableSizes(availableSizesForColor);

      // If current selected size is not available for this color, reset it
      if (selectedSize && !availableSizesForColor.includes(selectedSize)) {
        setSelectedSize(null);
      }
    } else {
      setAvailableSizes([]);
      setSelectedSize(null);
    }
  }, [selectedColor, product.productVariants, selectedSize]);

  // Check if a variant is available (in stock)
  const isVariantAvailable = (color: string, size: string) => {
    return product.productVariants.some(
      (v) => v.color === color && v.size === size && v.stockQuantity > 0,
    );
  };

  // Check if a color has any available sizes
  const isColorAvailable = (color: string) => {
    return sizes.some((size) => isVariantAvailable(color, size));
  };

  // Get color name from hex code (simplified version)
  const getColorName = (hexColor: string) => {
    const colorMap: Record<string, string> = {
      '#000000': 'Black',
      '#FFFFFF': 'White',
      '#FF0000': 'Red',
      '#00FF00': 'Green',
      '#0000FF': 'Blue',
      '#FFFF00': 'Yellow',
      '#FFC0CB': 'Pink',
      '#800080': 'Purple',
      '#FFA500': 'Orange',
      '#A52A2A': 'Brown',
      '#808080': 'Gray',
    };

    return colorMap[hexColor.toUpperCase()] || hexColor;
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Color selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Color</h4>
          {selectedColor && (
            <Badge variant="outline" className="font-normal">
              {getColorName(selectedColor)}
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <TooltipProvider>
            {colors.map((color) => {
              const isAvailable = isColorAvailable(color);
              const isSelected = selectedColor === color;

              return (
                <Tooltip key={color}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className={`w-10 h-10 rounded-full relative transition-all duration-200 ${
                        isSelected
                          ? 'ring-2 ring-offset-2 ring-blue-600'
                          : 'ring-1 ring-gray-300 hover:ring-gray-400'
                      } ${!isAvailable ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}
                      style={{ backgroundColor: color }}
                      onClick={() => isAvailable && setSelectedColor(color)}
                      disabled={!isAvailable}
                      aria-label={`Color: ${getColorName(color)}${
                        !isAvailable ? ' (Out of stock)' : ''
                      }`}
                      aria-pressed={isSelected}
                    >
                      {!isAvailable && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <AlertCircle className="h-5 w-5 text-white drop-shadow-md" />
                        </span>
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {getColorName(color)}
                      {!isAvailable ? ' (Out of stock)' : ''}
                    </p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </div>
      </div>

      <Separator />

      {/* Size selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Size</h4>
          {selectedSize && (
            <Badge variant="outline" className="font-normal">
              {selectedSize}
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {sizes.map((size) => {
            const isDisabled =
              !selectedColor ||
              !availableSizes.includes(size) ||
              !isVariantAvailable(selectedColor, size);
            const isSelected = selectedSize === size;

            return (
              <button
                key={size}
                type="button"
                className={`h-10 min-w-[40px] px-3 rounded-md transition-all duration-200 ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-800 border border-gray-300 hover:border-gray-400'
                } ${isDisabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}
                onClick={() => !isDisabled && setSelectedSize(size)}
                disabled={isDisabled}
                aria-label={`Size: ${size}${isDisabled ? ' (Not available)' : ''}`}
                aria-pressed={isSelected}
              >
                {size}
              </button>
            );
          })}
        </div>

        {selectedColor && availableSizes.length === 0 && (
          <p className="text-red-600 text-sm">No sizes available for this color</p>
        )}

        {!selectedColor && <p className="text-gray-500 text-sm">Please select a color first</p>}
      </div>

      <Separator />

      {/* Add to cart section */}
      <Add
        product={product}
        variant={selectedVariant}
        stockQuantity={selectedVariant?.stockQuantity}
      />
    </div>
  );
};

export default CustomizeProducts;
