import { useDispatch, useSelector } from 'react-redux';
import { addToCart, clearCart, removeFromCart } from './cartSlice';
import { RootState } from '../../store';
import { CartItem } from '@/lib/type/CartItem';

export const useCartStore = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart);

  const addItem = (item: CartItem, quantity: number) => {
    dispatch(addToCart({ ...item, quantity }));
  };

  const removeItem = (id: string) => dispatch(removeFromCart({ id }));
  const clear = () => dispatch(clearCart());

  return { ...cart, addItem, removeItem, clear };
};
