/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import {
  getProductReviews,
  getProductReviewStats,
  canUserReviewProduct,
  
} from '@/lib/utils/review-service';
import type { Review, ReviewStats } from '@/lib/types/Review';

interface UseReviewsProps {
  productId: string;
}

interface UseReviewsReturn {
  reviews: Review[];
  reviewStats: ReviewStats;
  loading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  canReview: boolean;
  selectedOrderId: string | null;
  userOrders: { id: string; date: string }[];
  fetchReviews: (pageNum?: number, reset?: boolean) => Promise<void>;
  handleLoadMore: () => void;
  refreshReviews: () => Promise<void>;
}

export function useReviews({ productId }: UseReviewsProps): UseReviewsReturn {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats>({
    productId: '',
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: {
      fiveStarCount: 0,
      fourStarCount: 0,
      threeStarCount: 0,
      twoStarCount: 0,
      oneStarCount: 0,
      oneStarPercent: 0,
      twoStarPercent: 0,
      threeStarPercent: 0,
      fourStarPercent: 0,
      fiveStarPercent: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [userOrders, setUserOrders] = useState<{ id: string; date: string }[]>([]);

  // Lấy thống kê đánh giá
  const fetchReviewStats = useCallback(async () => {
    try {
      const stats = await getProductReviewStats(productId);
      setReviewStats(stats);
    } catch (error) {
      console.error('Lỗi khi lấy thống kê đánh giá:', error);
    }
  }, [productId]);

  // Lấy danh sách đánh giá
  const fetchReviews = useCallback(
    async (pageNum = 0, reset = false) => {
      try {
        setLoading(true);
        setError(null);

        const response = await getProductReviews(productId, pageNum);

        if (reset) {
          setReviews(response.content);
        } else {
          setReviews((prev) => [...prev, ...response.content]);
        }

        setHasMore(pageNum < response.totalPages - 1);

        // Nếu là trang đầu tiên, cập nhật thống kê đánh giá
        if (pageNum === 0) {
          await fetchReviewStats();
        }
      } catch (error) {
        setError('Không thể tải đánh giá sản phẩm');
        toast({
          title: 'Lỗi',
          description: 'Không thể tải đánh giá sản phẩm',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    },
    [productId, toast],
  );

 

  // Xử lý tải thêm đánh giá
  const handleLoadMore = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchReviews(nextPage);
  }, []);

  // Làm mới danh sách đánh giá
  const refreshReviews = useCallback(async () => {
    setPage(0);
    await fetchReviews(0, true);
  }, []);

  // Tải đánh giá khi component được mount
  useEffect(() => {
    fetchReviews();
  }, []);

  return {
    reviews,
    reviewStats,
    loading,
    error,
    page,
    hasMore,
    canReview,
    selectedOrderId,
    userOrders,
    fetchReviews,
    handleLoadMore,
    refreshReviews,
  };
}
