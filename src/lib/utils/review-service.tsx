/* eslint-disable @typescript-eslint/no-require-imports */
import api from './api';
import type { ReviewRequest, ReviewResponse, ReviewStats } from '@/lib/types/Review';

// Interface cho response của API phân trang
interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

/**
 * Lấy tất cả đánh giá của một sản phẩm
 */
export async function getProductReviews(
  productId: string,
  page = 0,
  size = 10,
  sortBy = 'createdAt',
  direction = 'desc',
): Promise<PaginatedResponse<ReviewResponse>> {
  const response = await api.get<PaginatedResponse<ReviewResponse>>(
    `/api/reviews/product/${productId}`,
    { params: { page, size, sortBy, direction } },
  );
  return response.data;
}

/**
 * Lấy thống kê đánh giá của sản phẩm
 */
export async function getProductReviewStats(productId: string): Promise<ReviewStats> {
  const response = await api.get<ReviewStats>(`/api/reviews/product/${productId}/stats`);
  return response.data;
}

/**
 * Lấy tất cả đánh giá của người dùng hiện tại
 */
export async function getUserReviews(
  page = 0,
  size = 10,
  sortBy = 'createdAt',
  direction = 'desc',
): Promise<PaginatedResponse<ReviewResponse>> {
  const response = await api.get<PaginatedResponse<ReviewResponse>>(`/api/reviews/user`, {
    params: { page, size, sortBy, direction },
  });
  return response.data;
}

/**
 * Tạo đánh giá mới
 */
export async function createReview(reviewRequest: ReviewRequest): Promise<ReviewResponse> {
  const response = await api.post<ReviewResponse>(`/api/reviews`, reviewRequest);
  return response.data;
}

/**
 * Cập nhật đánh giá
 */
export async function updateReview(
  reviewId: string,
  reviewRequest: ReviewRequest,
): Promise<ReviewResponse> {
  const response = await api.put<ReviewResponse>(`/api/reviews/${reviewId}`, reviewRequest);
  return response.data;
}

/**
 * Xóa đánh giá
 */
export async function deleteReview(reviewId: string): Promise<void> {
  await api.delete(`/reviews/${reviewId}`);
}

/**
 * Kiểm tra xem người dùng có thể đánh giá sản phẩm không
 */
export async function canUserReviewProduct(productId: string, orderId: string): Promise<boolean> {
  const response = await api.get<boolean>(`/api/reviews/can-review`, {
    params: { productId, orderId },
  });
  return response.data;
}


