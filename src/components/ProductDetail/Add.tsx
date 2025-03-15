'use client';

import { useState } from 'react';
import { CartItem } from '@/lib/type/CartItem';
import { ProductVariant } from '@/lib/type/ProductVariant';
import { useCartStore } from '@/lib/redux/features/cart/useCartStore';

import { Button } from '../ui/button';
import { Product } from '@/lib/type/Product';

const Add = ({
  product,
  variant,
  stockQuantity,
}: {
  product: Product;
  variant: ProductVariant | null;
  stockQuantity: number | undefined;
}) => {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  const handleQuantity = (type: 'i' | 'd') => {
    setQuantity((prev) => {
      if (type === 'd' && prev > 1) return prev - 1;
      if (type === 'i' && prev < (stockQuantity ?? 0)) return prev + 1;
      return prev;
    });
  };

  const handleAddToCart = () => {
    if ((stockQuantity ?? 0) < 1) return;

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
      productVariants: variant ?? ({} as ProductVariant),
      resources: product.resources,
      description: product.description,
      newArrival: product.newArrival,
      rating: product.rating,
      quantity,
    };
    addItem(cartItem, quantity);
  };

  return (
    <div className="flex flex-col gap-4">
      <h4 className="font-medium">Choose a Quantity</h4>
      <div className="flex justify-between items-center">
        {/* Bộ chọn số lượng */}
        <div className="bg-gray-100 py-2 px-4 rounded-3xl flex items-center justify-between w-32">
          <button
            className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-20"
            onClick={() => handleQuantity('d')}
            disabled={quantity === 1}
          >
            -
          </button>
          {quantity}
          <button
            className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-20"
            onClick={() => handleQuantity('i')}
            disabled={quantity >= (stockQuantity ?? 0)}
          >
            +
          </button>
        </div>

        {/* Nút thêm vào giỏ hàng */}
        <Button
          onClick={handleAddToCart}
          disabled={(stockQuantity ?? 0) < 1}
          className="w-36 text-sm rounded-3xl py-2 px-4 hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:bg-gray-300 disabled:ring-0 disabled:text-gray-500"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default Add;
