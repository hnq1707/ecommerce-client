'use client';

import { useCartStore } from '@/app/hook/useCartStore';
import Image from 'next/image';
import { useEffect } from 'react';

const CartModal = () => {
  const { cart, counter, removeItem, loadCart } = useCartStore();

  useEffect(() => {
    loadCart(); // Load giỏ hàng từ localStorage khi mở modal
  }, []);

  const handleCheckout = () => {
    alert('Chức năng checkout chưa hỗ trợ với localStorage!');
  };

  return (
    <div className="w-max absolute p-4 rounded-md shadow-lg bg-white top-12 right-0 flex flex-col gap-6 z-20">
      {cart.length === 0 ? (
        <div className="text-gray-500">Cart is Empty</div>
      ) : (
        <>
          <h2 className="text-xl">Shopping Cart</h2>
          {/* LIST */}
          <div className="flex flex-col gap-6 max-h-72 overflow-y-auto">
            {cart.map((item) => (
              <div className="flex gap-4 items-center" key={item.id}>
                <Image
                  src="/phone.png"
                  alt={item.productId}
                  width={72}
                  height={96}
                  className="object-cover rounded-md"
                />
                <div className="flex flex-col w-full">
                  {/* TITLE */}
                  <div className="flex justify-between">
                    <h3 className="font-semibold">{item.productId}</h3>
                    <span className="text-sm">${item.quantity * 20}</span>
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
              <span>Subtotal</span>
              <span>${cart.reduce((acc, item) => acc + item.quantity * 20, 0)}</span>
            </div>
            <p className="text-gray-500 text-sm mt-2 mb-4">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="flex justify-between text-sm">
              <button className="rounded-md py-3 px-4 ring-1 ring-gray-300">View Cart</button>
              <button className="rounded-md py-3 px-4 bg-black text-white" onClick={handleCheckout}>
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartModal;
