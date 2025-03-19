'use client';

import { useState } from 'react';
import { CartItem } from '@/lib/type/CartItem';
import { ProductVariant } from '@/lib/type/ProductVariant';
import { useCartStore } from '@/lib/redux/features/cart/useCartStore';
import { Button } from '../ui/button';
import { Product } from '@/lib/type/Product';
import { Minus, Plus, ShoppingCart, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddProps {
  product: Product;
  variant: ProductVariant | null;
  stockQuantity: number | undefined;
}

const Add = ({ product, variant, stockQuantity }: AddProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCartStore();
  const { toast } = useToast();

  const handleQuantity = (type: 'i' | 'd') => {
    setQuantity((prev) => {
      if (type === 'd' && prev > 1) return prev - 1;
      if (type === 'i' && prev < (stockQuantity ?? 0)) return prev + 1;
      return prev;
    });
  };

  const handleAddToCart = () => {
    if ((stockQuantity ?? 0) < 1 || !variant) return;

    setIsAdding(true);

    // Create cart item
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      brand: product.brand,
      thumbnail: product.thumbnail,
      slug: product.slug,
      categoryId: product.categoryId,
      categoryName: product.categoryName,
      categoryTypeId: product.categoryTypeId,
      categoryTypeName: product.categoryTypeName,
      productVariants: variant,
      resources: product.resources,
      description: product.description,
      newArrival: product.newArrival,
      rating: product.rating,
      quantity,
    };

    // Add to cart with animation
    setTimeout(() => {
      addItem(cartItem, quantity);

      // Show success toast
      toast({
        title: 'Added to cart',
        description: `${quantity} × ${product.name} (${variant.color}, ${variant.size})`,
        duration: 3000,
      });

      setIsAdding(false);
    }, 500);
  };

  const isOutOfStock = (stockQuantity ?? 0) < 1;
  const isVariantSelected = !!variant;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Choose a Quantity</h4>
        {stockQuantity !== undefined && stockQuantity > 0 && (
          <span className="text-sm text-gray-500">
            {stockQuantity} {stockQuantity === 1 ? 'item' : 'items'} available
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        {/* Quantity selector */}
        <div className="flex items-center h-12 border border-gray-200 rounded-full overflow-hidden bg-white">
          <button
            type="button"
            className="w-12 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleQuantity('d')}
            disabled={quantity <= 1 || isOutOfStock}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>

          <div className="w-12 h-full flex items-center justify-center font-medium">{quantity}</div>

          <button
            type="button"
            className="w-12 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleQuantity('i')}
            disabled={quantity >= (stockQuantity ?? 0) || isOutOfStock}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Add to cart button */}
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock || !isVariantSelected || isAdding}
          className="h-12 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-all flex-1"
        >
          {isAdding ? (
            <>
              <Check className="h-5 w-5 mr-2 animate-in zoom-in duration-300" />
              Added!
            </>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5 mr-2" />
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </>
          )}
        </Button>
      </div>

      {!isVariantSelected && !isOutOfStock && (
        <p className="text-amber-600 text-sm">Please select color and size first</p>
      )}

      {/* {isOutOfStock && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
          This product is currently out of stock. Please check back later or browse similar
          products.
        </div>
      )} */}
    </div>
  );
};

export default Add;
