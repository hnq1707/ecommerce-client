'use client';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import {
  createOrder,
  updatePaymentStatus,
  cancelOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus, // Import thunk updateOrderStatus
  clearCurrentOrder,
  clearOrderDetails,
  resetPaymentStatus,
} from '@/lib/redux/features/order/orderSlice';
import { OrderRequest } from '@/lib/redux/features/order/orderSlice';
import { Order } from '@/lib/types/Order';

export const useOrder = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Lấy state từ Redux
  const orders = useSelector((state: RootState) => state.order.orders);
  const currentOrder = useSelector((state: RootState) => state.order.currentOrder);
  const orderDetails = useSelector((state: RootState) => state.order.orderDetails);
  const loading = useSelector((state: RootState) => state.order.loading);
  const error = useSelector((state: RootState) => state.order.error);
  const paymentStatus = useSelector((state: RootState) => state.order.paymentStatus);
  const paymentError = useSelector((state: RootState) => state.order.paymentError);

  // Action creators
  const placeOrder = (orderRequest: OrderRequest) => dispatch(createOrder(orderRequest));
  const updatePayment = (orderId: string, paymentIntentId: string, status: string) =>
    dispatch(updatePaymentStatus({ orderId, paymentIntentId, status }));
  const cancelUserOrder = (orderId: string) => dispatch(cancelOrder(orderId));
  const fetchUserOrders = (page?: number, size?: number, sortBy?: string) =>
    dispatch(getUserOrders({ page, size, sortBy }));
  const fetchAllOrders = (page?: number, size?: number, sortBy?: string) =>
    dispatch(getAllOrders({ page, size, sortBy }));
  // Thêm hàm updateOrderStatus
  const updateStatus = (id: string, status: Order['orderStatus']) =>
    dispatch(updateOrderStatus({ id, status }));
  const clearCurrent = () => dispatch(clearCurrentOrder());
  const clearDetails = () => dispatch(clearOrderDetails());
  const resetPayment = () => dispatch(resetPaymentStatus());

  return {
    orders,
    currentOrder,
    orderDetails,
    loading,
    error,
    paymentStatus,
    paymentError,
    placeOrder,
    updatePayment,
    cancelUserOrder,
    fetchUserOrders,
    fetchAllOrders,
    updateStatus,
    clearCurrent,
    clearDetails,
    resetPayment,
  };
};
