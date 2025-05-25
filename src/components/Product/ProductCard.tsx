'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, Check, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Product } from '@/lib/types/Product';
import { useCartStore } from '@/lib/redux/features/cart/useCartStore';
import type { CartItem } from '@/lib/types/CartItem';
import { cn } from '@/lib/utils/utils';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ProductCardProps {
  product: Product;
  onBuyNow?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addItem } = useCartStore();

  const router = useRouter();
  const [showVariantDialog, setShowVariantDialog] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState('1');
  const [availableVariants, setAvailableVariants] = useState<{
    colors: string[];
    sizes: string[];
  }>({ colors: [], sizes: [] });
  const [stockWarning, setStockWarning] = useState('');
  const [addSuccess, setAddSuccess] = useState(false);

  // Lấy danh sách màu sắc và kích thước có sẵn
  useEffect(() => {
    if (product.productVariants && product.productVariants.length > 0) {
      const colors = [...new Set(product.productVariants.map((v) => v.color))];
      const sizes = [...new Set(product.productVariants.map((v) => v.size))];

      setAvailableVariants({ colors, sizes });

      // Đặt giá trị mặc định cho màu và kích thước
      if (colors.length > 0 && !selectedColor) {
        setSelectedColor(colors[0]);
      }

      if (sizes.length > 0 && !selectedSize) {
        setSelectedSize(sizes[0]);
      }
    }
  }, [product.productVariants, showVariantDialog]);

  // Kiểm tra số lượng tồn kho khi thay đổi màu hoặc kích thước
  useEffect(() => {
    if (selectedColor && selectedSize) {
      const variant = product.productVariants.find(
        (v) => v.color === selectedColor && v.size === selectedSize,
      );

      if (variant) {
        if (variant.stockQuantity <= 0) {
          setStockWarning('Sản phẩm đã hết hàng');
        } else if (variant.stockQuantity < 5) {
          setStockWarning(`Chỉ còn ${variant.stockQuantity} sản phẩm`);
        } else {
          setStockWarning('');
        }

        // Giới hạn số lượng có thể chọn
        const maxQuantity = Math.min(5, variant.stockQuantity);
        if (Number(selectedQuantity) > maxQuantity) {
          setSelectedQuantity(maxQuantity.toString());
        }
      }
    }
  }, [selectedColor, selectedSize, product.productVariants, selectedQuantity]);

  // Reset trạng thái khi đóng dialog
  useEffect(() => {
    if (!showVariantDialog) {
      setAddSuccess(false);
    }
  }, [showVariantDialog]);

  const formatCurrency = (amount: number) => {
    amount = amount * 23000;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowVariantDialog(true);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
  };

  const getSelectedVariant = () => {
    return product.productVariants.find(
      (v) => v.color === selectedColor && v.size === selectedSize,
    );
  };

  const handleAddToCartWithVariant = () => {
    const variant = getSelectedVariant();

    if (!variant) {
      setStockWarning('Vui lòng chọn phiên bản sản phẩm');
      return;
    }

    if (variant.stockQuantity <= 0) {
      setStockWarning('Sản phẩm đã hết hàng');
      return;
    }

    const quantity = Number.parseInt(selectedQuantity);
    if (quantity > variant.stockQuantity) {
      setStockWarning(`Chỉ còn ${variant.stockQuantity} sản phẩm`);
      return;
    }

    setIsAddingToCart(true);

    const cartItem: CartItem = {
      ...product,
      productVariants: variant,
      resources: [product.resources[0]],
      quantity: quantity,
    };

    addItem(cartItem, quantity);

    // Hiển thị thông báo thành công
    setTimeout(() => {
      setIsAddingToCart(false);
      setAddSuccess(true);

      // Đóng dialog sau khi hiển thị thông báo thành công
      setTimeout(() => {
        setShowVariantDialog(false);
        setStockWarning('');
      }, 1000);
    }, 600);
  };

  // // Tạo mảng các số lượng có thể chọn dựa trên tồn kho
  // const getQuantityOptions = () => {
  //   const variant = getSelectedVariant();
  //   if (!variant) return [1, 2, 3, 4, 5];

  //   const maxQuantity = Math.min(5, variant.stockQuantity);
  //   return Array.from({ length: maxQuantity }, (_, i) => i + 1);
  // };

  // Chuyển mã màu sang tên màu tiếng Việt
  const getColorName = (colorCode: string) => {
    const colorMap: Record<string, string> = {
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

    return colorMap[colorCode.toLowerCase()] || colorCode;
  };

  // Kiểm tra xem variant có sẵn không
  const isVariantAvailable = (color: string, size: string) => {
    const variant = product.productVariants.find((v) => v.color === color && v.size === size);
    return variant && variant.stockQuantity > 0;
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
      className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/${product.slug}`} className="relative w-full aspect-square overflow-hidden">
        <motion.div
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.4 }}
          className="w-full h-full"
        >
          <Image
            src={product.thumbnail || '/placeholder.svg'}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
          />
        </motion.div>

        {/* Favorite Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleFavorite}
          className={cn(
            'absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm z-10',
            isFavorite ? 'text-red-500' : 'text-gray-400',
          )}
        >
          <Heart className={cn('w-4 h-4', isFavorite && 'fill-current')} />
        </motion.button>

        {/* Quick Add Button (Visible on hover) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-4 left-0 right-0 flex justify-center"
        >
          <Button
            onClick={handleAddToCart}
            className="bg-white text-black hover:bg-white/90 rounded-full shadow-md px-4 py-2 text-sm"
          >
            Thêm nhanh
          </Button>
        </motion.div>
      </Link>

      <div className="flex flex-col p-4">
        <div className="flex items-center gap-1 mb-1">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              size={14}
              className={
                index < Math.round(product.rating)
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-gray-200'
              }
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
        </div>

        <Link href={`/${product.slug}`} className="group-hover:text-primary transition-colors">
          <h3 className="font-medium text-base line-clamp-2 h-12">{product.name}</h3>
        </Link>

        <span className="font-medium text-lg text-primary mt-1">
          {formatCurrency(product.price)}
        </span>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-xs font-normal h-9"
            onClick={(e) => {
              e.preventDefault();
              router.push(`/${product.slug}`);
            }}
          >
            Xem chi tiết
          </Button>

          <Button
            className="rounded-full text-xs font-normal h-9"
            onClick={(e) => {
              e.preventDefault();
              setShowVariantDialog(true);
            }}
          >
            Thêm vào giỏ
          </Button>
        </div>
      </div>

      {/* Dialog chọn variant */}
      <Dialog open={showVariantDialog} onOpenChange={setShowVariantDialog}>
        <DialogContent className="sm:max-w-[450px] rounded-xl p-0 overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>Tùy chọn sản phẩm {product.name}</DialogTitle>
          </DialogHeader>

          <div className="relative">
            {/* Ảnh sản phẩm phía trên */}
            <div className="relative w-full h-48 bg-gray-100">
              <Image
                src={ product.thumbnail || '/placeholder.svg'}
                alt={product.name}
                fill
                className="object-contain p-4"
              />

              {/* Nút đóng */}
              <button
                onClick={() => setShowVariantDialog(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Thông tin sản phẩm */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
              <h3 className="font-medium text-lg">{product.name}</h3>
              <div className="flex items-center justify-between mt-1">
                <span className="font-bold text-xl">{formatCurrency(product.price)}</span>
                {stockWarning && (
                  <Badge variant="outline" className="bg-red-500/20 text-white border-red-400">
                    {stockWarning}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="space-y-5">
              {/* Chọn màu sắc */}
              {availableVariants.colors.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">Màu sắc</Label>
                    <span className="text-sm text-gray-500">
                      {selectedColor ? getColorName(selectedColor) : 'Chọn màu'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {availableVariants.colors.map((color) => {
                      const isAvailable = availableVariants.sizes.some((size) =>
                        isVariantAvailable(color, size),
                      );
                      return (
                        <button
                          key={color}
                          onClick={() => isAvailable && setSelectedColor(color)}
                          className={cn(
                            'relative w-10 h-10 rounded-full border-2 transition-all duration-200 flex items-center justify-center',
                            selectedColor === color
                              ? 'border-primary scale-110'
                              : 'border-gray-200',
                            !isAvailable && 'opacity-40 cursor-not-allowed',
                          )}
                          disabled={!isAvailable}
                          title={
                            isAvailable ? getColorName(color) : `${getColorName(color)} - Hết hàng`
                          }
                        >
                          <div
                            className="w-8 h-8 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          {selectedColor === color && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/20">
                              <Check className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Chọn kích thước */}
              {availableVariants.sizes.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">Kích thước</Label>
                    <span className="text-sm text-gray-500">
                      {selectedSize ? selectedSize.toUpperCase() : 'Chọn kích thước'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {availableVariants.sizes.map((size) => {
                      const isAvailable = selectedColor
                        ? isVariantAvailable(selectedColor, size)
                        : false;
                      return (
                        <button
                          key={size}
                          onClick={() => isAvailable && setSelectedSize(size)}
                          className={cn(
                            'h-10 min-w-[40px] px-3 rounded-md border-2 transition-all duration-200 font-medium',
                            selectedSize === size
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-gray-200 bg-white text-gray-700',
                            !isAvailable && 'opacity-40 cursor-not-allowed',
                          )}
                          disabled={!isAvailable}
                          title={
                            isAvailable ? size.toUpperCase() : `${size.toUpperCase()} - Hết hàng`
                          }
                        >
                          {size.toUpperCase()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Chọn số lượng */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Số lượng</Label>
                  <span className="text-sm text-gray-500">{selectedQuantity} sản phẩm</span>
                </div>

                <div className="flex border rounded-lg overflow-hidden">
                  <button
                    onClick={() => {
                      const current = Number.parseInt(selectedQuantity);
                      if (current > 1) {
                        setSelectedQuantity((current - 1).toString());
                      }
                    }}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors"
                    disabled={selectedQuantity === '1'}
                  >
                    -
                  </button>
                  <div className="flex-1 flex items-center justify-center font-medium">
                    {selectedQuantity}
                  </div>
                  <button
                    onClick={() => {
                      const current = Number.parseInt(selectedQuantity);
                      const max = Math.min(5, getSelectedVariant()?.stockQuantity || 5);
                      if (current < max) {
                        setSelectedQuantity((current + 1).toString());
                      }
                    }}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors"
                    disabled={
                      Number.parseInt(selectedQuantity) >=
                      Math.min(5, getSelectedVariant()?.stockQuantity || 5)
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <Separator className="my-5" />

            {/* Tổng cộng */}
            <div className="flex items-center justify-between mb-5">
              <div className="text-sm text-gray-600">Tổng cộng:</div>
              <div className="font-bold text-xl text-primary">
                {formatCurrency(product.price * Number.parseInt(selectedQuantity))}
              </div>
            </div>

            {/* Nút thêm vào giỏ */}
            <AnimatePresence mode="wait">
              {addSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-green-50 text-green-700 p-3 rounded-lg flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  <span>Đã thêm vào giỏ hàng!</span>
                </motion.div>
              ) : (
                <motion.button
                  key="add-button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCartWithVariant}
                  disabled={
                    isAddingToCart ||
                    !selectedColor ||
                    !selectedSize ||
                    stockWarning === 'Sản phẩm đã hết hàng'
                  }
                  className={cn(
                    'w-full h-12 rounded-xl flex items-center justify-center gap-2 font-medium transition-all',
                    isAddingToCart ||
                      !selectedColor ||
                      !selectedSize ||
                      stockWarning === 'Sản phẩm đã hết hàng'
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary/90',
                  )}
                >
                  {isAddingToCart ? (
                    <>
                      <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Đang thêm...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>Thêm vào giỏ hàng</span>
                    </>
                  )}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ProductCard;
