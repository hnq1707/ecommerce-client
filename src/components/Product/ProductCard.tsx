'use client';

import type React from 'react';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Product } from '@/lib/type/Product';
import { useCartStore } from '@/lib/redux/features/cart/useCartStore';
import type { CartItem } from '@/lib/type/CartItem';
import { cn } from '@/lib/utils/utils';

interface ProductCardProps {
  product: Product;
  onBuyNow?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onBuyNow }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addItem } = useCartStore();

  const formatCurrency = (amount: number) => {
    amount = amount * 23000;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAddingToCart(true);

    const cartItem: CartItem = {
      ...product,
      productVariants: product.productVariants[0],
      resources: [product.resources[0]],
      quantity: 1,
    };

    addItem(cartItem, 1);

    setTimeout(() => {
      setIsAddingToCart(false);
    }, 600);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();

    const cartItem: CartItem = {
      ...product,
      productVariants: product.productVariants[0],
      resources: [product.resources[0]],
      quantity: 1,
    };

    addItem(cartItem, 1);

    if (onBuyNow) onBuyNow();
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
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
            Quick Add
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
            className="rounded-full text-xs font-normal h-9 relative overflow-hidden"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            <motion.div
              initial={false}
              animate={{
                y: isAddingToCart ? -30 : 0,
                opacity: isAddingToCart ? 0 : 1,
              }}
              transition={{ duration: 0.2 }}
              className="flex items-center absolute inset-0 justify-center"
            >
              <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
              Thêm vào giỏ
            </motion.div>

            <motion.div
              initial={false}
              animate={{
                y: isAddingToCart ? 0 : 30,
                opacity: isAddingToCart ? 1 : 0,
              }}
              transition={{ duration: 0.2 }}
              className="flex items-center absolute inset-0 justify-center text-primary"
            >
              Đã thêm ✓
            </motion.div>
          </Button>

          <Button className="rounded-full text-xs font-normal h-9" onClick={handleBuyNow}>
            Mua ngay
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
