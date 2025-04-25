import { useDispatch, useSelector } from 'react-redux';
import { addToCart, clearCart, removeFromCart, updateQuantity } from './cartSlice';
import { RootState } from '../../store';
import { CartItem } from '@/lib/types/CartItem';

export const useCartStore = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart);

  const addItem = (item: CartItem, quantity: number) => {
    dispatch(addToCart({ ...item, quantity }));
  };

  const removeItem = (id: string) => dispatch(removeFromCart({ id }));

  const changeQuantity = (id: string, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const clear = () => dispatch(clearCart());

  return { ...cart, addItem, removeItem, changeQuantity, clear };
};
