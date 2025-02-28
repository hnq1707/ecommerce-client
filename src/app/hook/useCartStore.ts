import { create } from 'zustand';
import { useEffect, useState } from 'react';

type CartItem = {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
};

type CartState = {
  cart: CartItem[];
  counter: number;
  addItem: (productId: string, variantId?: string, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  loadCart: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  counter: 0,

  addItem: (productId, variantId, quantity = 1) => {
    set((state) => {
      const newCart = [
        ...state.cart,
        { id: Date.now().toString(), productId, variantId, quantity },
      ];
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(newCart));
      }
      return { cart: newCart, counter: newCart.length };
    });
  },

  removeItem: (itemId) => {
    set((state) => {
      const newCart = state.cart.filter((item) => item.id !== itemId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(newCart));
      }
      return { cart: newCart, counter: newCart.length };
    });
  },

  loadCart: () => {
    if (typeof window !== 'undefined') {
      const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      set({ cart: storedCart, counter: storedCart.length });
    }
  },

}));

export const useClientCart = () => {
  const { loadCart, counter } = useCartStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    loadCart();
  }, [loadCart]);

  if (!isClient) return { counter: 0 }; // Tránh lỗi hydration
  return { counter };
};
