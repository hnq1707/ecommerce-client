'use client';

import { CartItem } from '@/lib/redux/features/cart/cartSlice';
import {useCartStore} from '@/lib/redux/features/cart/useCartStore'
import Image from 'next/image';
import { Button } from '../ui/button';

const CartModal = () => {
const { cartItems, totalQuantity, totalPrice, removeItem, clear } = useCartStore();  

  const handleCheckout = () => {
    alert('Chức năng checkout chưa hỗ trợ với localStorage!');
  };
  return (
    <div className="w-max absolute p-4 rounded-md shadow-lg bg-white top-12 right-0 flex flex-col gap-6 z-20">
      {cartItems.length === 0 ? (
        <div className="text-gray-500">Cart is Empty</div>
      ) : (
        <>
          <div className="flex flex-wrap justify-between items-center">
            <h2 className="text-xl font-semibold">Shopping Cart</h2>

            <Button onClick={clear}>Clear Cart</Button>
          </div>
          {/* LIST */}
          <div className="flex flex-col gap-6 max-h-72 overflow-y-auto">
            {cartItems.map((item: CartItem) => (
              <div className="flex gap-4 items-center" key={item.id}>
                <Image
                  src="/default-product.png"
                  alt={item.name}
                  width={72}
                  height={96}
                  className="object-cover rounded-md"
                />
                <div className="flex flex-col w-full">
                  {/* TITLE */}
                  <div className="flex justify-between">
                    <h3 className="font-semibold">{item.name}</h3>
                    <span className="text-sm">${item.price}</span>
                  </div>
                  {/* BOTTOM */}
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Qty: {item.quantity}</span>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* BOTTOM */}
          <div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{totalQuantity}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Subtotal</span>
              <span>{totalPrice.toFixed(2)}</span>
            </div>
            <p className="text-gray-500 text-sm mt-2 mb-4">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="flex justify-between text-sm">
              <Button className="rounded-md py-3 px-4 bg-white text-black hover:bg-black hover:text-white">
                View Cart
              </Button>
              <Button className="rounded-md py-3 px-4 hover:bg-white hover:text-black" onClick={handleCheckout}>
                Checkout
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartModal;
