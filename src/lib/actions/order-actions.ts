/* eslint-disable @typescript-eslint/no-explicit-any */

'use server';

import { revalidatePath } from 'next/cache';
import api from '../utils/api';

// Định nghĩa các kiểu dữ liệu
interface OrderItemRequest {
  productId: string;
  productVariantId: string;
  quantity: number;
}

interface OrderRequest {
  addressId: string;
  totalAmount: number;
  orderDate: string;
  discount: number;
  expectedDeliveryDate: string;
  paymentMethod: string;
  orderItemRequests: OrderItemRequest[];
}

interface OrderResponse {
  orderId: string;
  paymentMethod: string;
  credentials?: {
    client_secret: string;
  };
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}



export async function createOrder(orderRequest: OrderRequest): Promise<ApiResponse<OrderResponse>> {
  try {
    const { data } = await api.post<OrderResponse>('/api/orders', orderRequest);
    return { success: true, data };
  } catch (error: any) {
    console.error('Lỗi khi tạo đơn hàng:', error);
    return { success: false, error: error.response?.data?.message || 'Không thể tạo đơn hàng' };
  }
}

// Server Action để lấy thông tin đơn hàng
export async function getOrderDetails(): Promise<ApiResponse<any>> {
  try {
    const { data } = await api.get('/api/orders/user');
    return { success: true, data };
  } catch (error: any) {
    console.error('Lỗi khi lấy thông tin đơn hàng:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Không thể lấy thông tin đơn hàng',
    };
  }
}

// Server Action để cập nhật trạng thái thanh toán
export async function updatePaymentStatus(
  orderId: string,
  paymentIntentId: string,
  status: string,
): Promise<ApiResponse<any>> {
  try {
    const { data } = await api.put('/api/orders/payment-status', { paymentIntentId, status });

    // Cập nhật cache
    revalidatePath(`/orders/${orderId}`);
    revalidatePath(`/orders/${orderId}/confirmation`);

    return { success: true, data };
  } catch (error: any) {
    console.error('Lỗi khi cập nhật trạng thái thanh toán:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Không thể cập nhật trạng thái thanh toán',
    };
  }
}