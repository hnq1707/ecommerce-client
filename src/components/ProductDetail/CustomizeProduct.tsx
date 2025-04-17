'use client';

import { useState, useEffect } from 'react';
import Add from './Add';
import type { Product } from '@/lib/type/Product';
import type { ProductVariant } from '@/lib/type/ProductVariant';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertCircle, Check, HelpCircle, Ruler } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface CustomizeProductsProps {
  product: Product;
}

const CustomizeProducts = ({ product }: CustomizeProductsProps) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

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

  // Auto-select first available color and size on component mount
  useEffect(() => {
    if (colors.length > 0 && !selectedColor) {
      // Find first color that has available sizes
      const firstAvailableColor = colors.find((color) =>
        product.productVariants.some((v) => v.color === color && v.stockQuantity > 0),
      );

      if (firstAvailableColor) {
        setSelectedColor(firstAvailableColor);
      }
    }
  }, [colors, product.productVariants]);

  // Auto-select first available size when color is selected
  useEffect(() => {
    if (availableSizes.length > 0 && !selectedSize) {
      // Find first size that is in stock for the selected color
      const firstAvailableSize = availableSizes.find((size) =>
        isVariantAvailable(selectedColor!, size),
      );

      if (firstAvailableSize) {
        setSelectedSize(firstAvailableSize);
      }
    }
  }, [availableSizes, selectedColor]);

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
      '#000000': 'Đen',
      '#FFFFFF': 'Trắng',
      '#FF0000': 'Đỏ',
      '#00FF00': 'Xanh lá',
      '#0000FF': 'Xanh dương',
      '#FFFF00': 'Vàng',
      '#FFC0CB': 'Hồng',
      '#800080': 'Tím',
      '#FFA500': 'Cam',
      '#A52A2A': 'Nâu',
      '#808080': 'Xám',
      red: 'Đỏ',
      blue: 'Xanh dương',
      green: 'Xanh lá',
      black: 'Đen',
      white: 'Trắng',
      yellow: 'Vàng',
      purple: 'Tím',
      pink: 'Hồng',
      orange: 'Cam',
      gray: 'Xám',
      brown: 'Nâu',
    };

    return colorMap[hexColor.toLowerCase()] || hexColor;
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Color selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-base">Màu sắc</h4>
          {selectedColor && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Badge variant="outline" className="font-normal bg-gray-50">
                <span
                  className="inline-block w-3 h-3 rounded-full mr-1.5"
                  style={{ backgroundColor: selectedColor }}
                ></span>
                {getColorName(selectedColor)}
              </Badge>
            </motion.div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <TooltipProvider>
            <AnimatePresence>
              {colors.map((color, index) => {
                const isAvailable = isColorAvailable(color);
                const isSelected = selectedColor === color;

                return (
                  <motion.div
                    key={color}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className={`w-12 h-12 rounded-full relative transition-all duration-200 ${
                            isSelected
                              ? 'ring-2 ring-offset-2 ring-primary scale-110'
                              : 'ring-1 ring-gray-300 hover:ring-gray-400'
                          } ${!isAvailable ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}
                          style={{ backgroundColor: color }}
                          onClick={() => isAvailable && setSelectedColor(color)}
                          disabled={!isAvailable}
                          aria-label={`Màu: ${getColorName(color)}${
                            !isAvailable ? ' (Hết hàng)' : ''
                          }`}
                          aria-pressed={isSelected}
                        >
                          {isSelected && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full"
                            >
                              <Check className="h-6 w-6 text-white drop-shadow-md" />
                            </motion.div>
                          )}

                          {!isAvailable && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <AlertCircle className="h-5 w-5 text-white drop-shadow-md" />
                            </span>
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-gray-800 text-white border-none">
                        <p>
                          {getColorName(color)}
                          {!isAvailable ? ' (Hết hàng)' : ''}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </TooltipProvider>
        </div>
      </div>

      <Separator className="my-1" />

      {/* Size selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-base">Kích thước</h4>
            <Dialog open={showSizeGuide} onOpenChange={setShowSizeGuide}>
              <DialogTrigger asChild>
                <button
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="Xem hướng dẫn kích thước"
                >
                  <Ruler className="h-4 w-4" />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Hướng dẫn kích thước</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border px-4 py-2 text-left">Kích thước</th>
                          <th className="border px-4 py-2 text-left">Chiều cao (cm)</th>
                          <th className="border px-4 py-2 text-left">Cân nặng (kg)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border px-4 py-2">S</td>
                          <td className="border px-4 py-2">150-165</td>
                          <td className="border px-4 py-2">45-55</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2">M</td>
                          <td className="border px-4 py-2">165-175</td>
                          <td className="border px-4 py-2">55-65</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2">L</td>
                          <td className="border px-4 py-2">175-185</td>
                          <td className="border px-4 py-2">65-75</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2">XL</td>
                          <td className="border px-4 py-2">185-195</td>
                          <td className="border px-4 py-2">75-85</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-sm text-gray-500">
                    Lưu ý: Bảng kích thước chỉ mang tính tham khảo. Kích thước thực tế có thể thay
                    đổi tùy theo kiểu dáng sản phẩm.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {selectedSize && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Badge variant="outline" className="font-normal bg-gray-50">
                {selectedSize}
              </Badge>
            </motion.div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <AnimatePresence>
            {sizes.map((size, index) => {
              const isDisabled =
                !selectedColor ||
                !availableSizes.includes(size) ||
                !isVariantAvailable(selectedColor, size);
              const isSelected = selectedSize === size;

              return (
                <motion.button
                  key={size}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  type="button"
                  className={`h-12 min-w-[48px] px-4 rounded-lg transition-all duration-200 font-medium ${
                    isSelected
                      ? 'bg-primary text-white shadow-md scale-105'
                      : 'bg-white text-gray-800 border border-gray-300 hover:border-gray-400'
                  } ${isDisabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}
                  onClick={() => !isDisabled && setSelectedSize(size)}
                  disabled={isDisabled}
                  aria-label={`Kích thước: ${size}${isDisabled ? ' (Không có sẵn)' : ''}`}
                  aria-pressed={isSelected}
                  whileTap={{ scale: isDisabled ? 1 : 0.95 }}
                >
                  {size}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {selectedColor && availableSizes.length === 0 && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-600 text-sm flex items-center gap-1.5"
          >
            <AlertCircle className="h-4 w-4" />
            Không có kích thước nào cho màu này
          </motion.p>
        )}

        {!selectedColor && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-500 text-sm flex items-center gap-1.5"
          >
            <HelpCircle className="h-4 w-4" />
            Vui lòng chọn màu sắc trước
          </motion.p>
        )}
      </div>

      <Separator className="my-1" />

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
