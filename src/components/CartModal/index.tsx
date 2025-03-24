'use client';

import { useCartStore } from '@/lib/redux/features/cart/useCartStore';
import Image from 'next/image';
import { Button } from '../ui/button';
import type { CartItem } from '@/lib/type/CartItem';
import { useRouter } from 'next/navigation';
import { Minus, Plus, ShoppingBag, ShoppingCart, Trash2, X } from 'lucide-react';
import { useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Link from 'next/link';

interface CartModalProps {
  onClose?: () => void;
}

const CartModal = ({ onClose }: CartModalProps) => {
  const { cartItems, totalQuantity, totalPrice, removeItem, changeQuantity, clear } =
    useCartStore();
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  const handleCheckout = () => {
    if (onClose) onClose();
    router.push('/checkout');
  };

  const handleViewCart = () => {
    if (onClose) onClose();
    router.push('/cart');
  };

  const handleContinueShopping = () => {
    if (onClose) onClose();
    router.push('/list');
  };

  // Format price with 2 decimal places and $ sign
  const formatCurrency = (amount: number) => {
    amount = amount * 23000;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Handle quantity change
  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      changeQuantity(itemId, newQuantity);
    }
  };

  return (
    <div
      className="w-[350px] md:w-[400px] absolute rounded-xl shadow-2xl bg-white top-14 right-0 z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200"
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
    >
      {/* Header */}
      <div className="p-4 bg-gray-50 flex justify-between items-center border-b">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Your Cart
          {totalQuantity > 0 && <Badge className="ml-1 bg-blue-600">{totalQuantity}</Badge>}
        </h2>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full"
            aria-label="Close cart"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Empty Cart State */}
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 h-64">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <ShoppingBag className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-500 mb-6 text-center">Your cart is empty</p>
          <Button onClick={handleContinueShopping} className="rounded-full px-6">
            Continue Shopping
          </Button>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="max-h-[350px] overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {cartItems.map((item: CartItem) => (
              <div className="flex gap-3 py-3 border-b border-gray-100 last:border-0" key={item.id}>
                <div className="relative h-20 w-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-50">
                  <Image
                    src="/default-product.png"
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <Link
                      href={`/${item.slug}`}
                      className="font-medium text-sm line-clamp-2 hover:text-blue-600 transition-colors"
                      onClick={onClose}
                    >
                      {item.name}
                    </Link>
                    <span className="text-sm font-semibold ml-2 whitespace-nowrap">
                      {formatCurrency(item.price)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center h-8 border rounded-full overflow-hidden">
                      <button
                        className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <button
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="p-4 bg-gray-50 border-t">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">{formatCurrency(totalPrice)}</span>
            </div>

            <p className="text-gray-500 text-xs mb-4">Shipping and taxes calculated at checkout</p>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="rounded-full" onClick={handleViewCart}>
                View Cart
              </Button>

              <Button
                className="rounded-full bg-blue-600 hover:bg-blue-700"
                onClick={handleCheckout}
              >
                Checkout
              </Button>
            </div>

            <div className="mt-3 flex justify-center">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-gray-500 hover:text-red-600"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Clear Cart
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear your cart?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove all items from your cart. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button
                        onMouseDown={() => {
                          console.log('Clear Cart clicked (mousedown)');
                          clear();
                        }}
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 text-white rounded-md"
                      >
                        Clear Cart
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartModal;
