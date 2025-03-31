/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './api';

// Định nghĩa interface cho Coupon
export interface Coupon {
  id: number;
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  minimumPurchaseAmount?: number;
  maximumDiscountAmount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit?: number;
  usageCount?: number;
  couponType?: 'GENERAL' | 'PRODUCT' | 'CATEGORY' | 'USER';
  productIds?: number[];
  categoryIds?: number[];
  userIds?: number[];
}

// Định nghĩa interface cho DiscountResponse
export interface DiscountResponse {
  valid: boolean;
  message: string;
  discountAmount: number;
}

export async function getCoupons(): Promise<Coupon[]> {
  const response = await api.get('/api/coupons');
  return response.data.result;
}

// Lấy danh sách coupon đang active
export async function getActiveCoupons(): Promise<Coupon[]> {
  const response = await api.get('/api/coupons/active');
  return response.data.result;
}

// Lấy thông tin chi tiết về coupon
export async function getCouponByCode(code: string): Promise<Coupon> {
  const response = await api.get(`/api/coupons/code/${code}`);
  return response.data.result;
}

export async function getCouponById(id: number): Promise<Coupon> {
  const response = await api.get(`/api/coupons/${id}`);
  return response.data.result;
}

// Kiểm tra và tính toán giảm giá
export async function validateCoupon(code: string, orderAmount: number): Promise<DiscountResponse> {
  const response = await api.post('/api/coupons/validate', {
    couponCode: code,
    orderAmount,
  });
  return response.data.result;
}

// Đánh dấu coupon đã được sử dụng
export async function applyCoupon(code: string): Promise<void> {
  try {
    const response = await api.post('/api/coupons/apply?code=' + code);
    return response.data.result;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Không thể áp dụng mã giảm giá');
  }
}

// Tạo coupon mới sử dụng api thay vì fetch
export async function createCoupon(coupon: Omit<Coupon, 'id'>): Promise<Coupon> {
  try {
    const response = await api.post('/api/coupons', coupon);
    return response.data.result;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Không thể tạo mã giảm giá');
  }
}

// Cập nhật coupon sử dụng api thay vì fetch
export async function updateCoupon(id: number, coupon: Coupon): Promise<Coupon> {
  try {
    const response = await api.put(`/api/coupons/${id}`, coupon);
    return response.data.result;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Không thể cập nhật mã giảm giá');
  }
}

// Xóa coupon sử dụng api thay vì fetch
export async function deleteCoupon(id: number): Promise<void> {
  try {
    await api.delete(`/api/coupons/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Không thể xóa mã giảm giá');
  }
}

// Thay đổi trạng thái coupon
export async function toggleCouponStatus(id: number, isActive: boolean): Promise<Coupon> {
  const coupon = await getCouponById(id);
  coupon.isActive = isActive;
  return updateCoupon(id, coupon);
}

// Format discount value for display
export function formatDiscount(coupon: Coupon): string {
  if (coupon.discountType === 'PERCENTAGE') {
    return `${coupon.discountValue}%`;
  } else {
    return `${coupon.discountValue.toLocaleString('vi-VN')}đ`;
  }
}

// Format minimum purchase amount for display
export function formatMinimumPurchase(coupon: Coupon): string | null {
  if (coupon.minimumPurchaseAmount) {
    return `Đơn tối thiểu ${coupon.minimumPurchaseAmount.toLocaleString('vi-VN')}đ`;
  }
  return null;
}
