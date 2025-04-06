'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Trash2, X } from 'lucide-react';
import { useCartStore } from '@/lib/redux/features/cart/useCartStore';
import { Button } from '@/components/ui/button';
import type { CartItem } from '@/lib/type/CartItem';

const CartModal = () => {
  const { cartItems, removeItem, changeQuantity } = useCartStore();
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  const handleRemove = (id: string) => {
    setIsRemoving(id);
    setTimeout(() => {
      removeItem(id);
      setIsRemoving(null);
    }, 300);
  };

  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    if (newQuantity > 0) {
      changeQuantity(item.id, newQuantity);
    }
  };

  const formatCurrency = (amount: number) => {
    amount = amount * 23000;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="w-[350px] md:w-[400px] bg-white rounded-lg shadow-xl overflow-hidden border">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-medium">Giỏ hàng ({cartItems.length})</h3>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="max-h-[300px] overflow-y-auto p-4 space-y-4">
        {cartItems.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p>Giỏ hàng của bạn đang trống</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 1 }}
              animate={{
                opacity: isRemoving === item.id ? 0 : 1,
                height: isRemoving === item.id ? 0 : 'auto',
                marginBottom: isRemoving === item.id ? 0 : undefined,
              }}
              transition={{ duration: 0.3 }}
              className="flex gap-3 pb-4 border-b last:border-0 last:pb-0"
            >
              <div className="w-20 h-20 relative rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                <Image
                  src={item.thumbnail || '/placeholder.svg'}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                    onClick={() => handleRemove(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-primary font-medium text-sm mt-1">
                  {formatCurrency(item.price)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0 rounded-md"
                    onClick={() => handleQuantityChange(item, item.quantity - 1)}
                  >
                    -
                  </Button>
                  <span className="text-sm w-6 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0 rounded-md"
                    onClick={() => handleQuantityChange(item, item.quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="p-4 border-t bg-gray-50">
        <div className="flex justify-between mb-4">
          <span className="font-medium">Tổng cộng:</span>
          <span className="font-bold text-primary">{formatCurrency(totalPrice)}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button asChild variant="outline" className="w-full">
            <Link href="/cart">Xoa gio hang</Link>
          </Button>
          <Button asChild className="w-full">
            <Link href="/checkout">Thanh toán</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
