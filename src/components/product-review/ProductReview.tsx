import { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Star, Filter, SortAsc, SortDesc } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useReviews } from '@/hooks/use-review';
import ReviewItem from './ReviewItem';
import ReviewForm from './ReviewForm';
import ReviewSkeleton from './ReviewSkeleton';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [newReviewId, setNewReviewId] = useState<string | null>(null);

  // Sử dụng custom hook để quản lý state và data fetching
  const { reviews, reviewStats, loading, hasMore, handleLoadMore, refreshReviews } = useReviews({
    productId,
  });

  // Lọc đánh giá theo số sao
  const filteredReviews = useMemo(() => {
    if (filterRating === null) return reviews;
    return reviews.filter((review) => review.rating === filterRating);
  }, [reviews, filterRating]);

  // Sắp xếp đánh giá theo thời gian
  const sortedReviews = useMemo(() => {
    return [...filteredReviews].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [filteredReviews, sortDirection]);

  // Loại bỏ review trùng id
  const uniqueSortedReviews = useMemo(() => {
    return Array.from(new Map(sortedReviews.map((r) => [r.id, r])).values());
  }, [sortedReviews]);

  // Xử lý sau khi đánh giá thành công
  const handleReviewSuccess = useCallback(async () => {
    setShowReviewForm(false);
    await refreshReviews();
    if (uniqueSortedReviews.length > 0) {
      setNewReviewId(uniqueSortedReviews[0].id);
      setTimeout(() => setNewReviewId(null), 5000);
    }
  }, [refreshReviews, uniqueSortedReviews]);

  const handleFilterChange = useCallback((rating: number | null) => {
    setFilterRating(rating);
  }, []);

  const handleSortChange = useCallback(() => {
    setSortDirection((prev) => (prev === 'desc' ? 'asc' : 'desc'));
  }, []);

  // Hàm helper để lấy số lượng đánh giá theo số sao
  const getStarCount = (rating: number) => {
    if (!reviewStats.ratingDistribution) return 0;

    switch (rating) {
      case 5:
        return reviewStats.ratingDistribution.fiveStarCount || 0;
      case 4:
        return reviewStats.ratingDistribution.fourStarCount || 0;
      case 3:
        return reviewStats.ratingDistribution.threeStarCount || 0;
      case 2:
        return reviewStats.ratingDistribution.twoStarCount || 0;
      case 1:
        return reviewStats.ratingDistribution.oneStarCount || 0;
      default:
        return 0;
    }
  };

  // Hàm helper để lấy phần trăm đánh giá theo số sao
  const getStarPercent = (rating: number) => {
    if (!reviewStats.ratingDistribution) return 0;

    switch (rating) {
      case 5:
        return reviewStats.ratingDistribution.fiveStarPercent || 0;
      case 4:
        return reviewStats.ratingDistribution.fourStarPercent || 0;
      case 3:
        return reviewStats.ratingDistribution.threeStarPercent || 0;
      case 2:
        return reviewStats.ratingDistribution.twoStarPercent || 0;
      case 1:
        return reviewStats.ratingDistribution.oneStarPercent || 0;
      default:
        return 0;
    }
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="mt-10 space-y-8">
        <h2 className="text-2xl font-semibold">Đánh giá sản phẩm</h2>
        <div className="space-y-4">
          <ReviewSkeleton />
          <ReviewSkeleton />
          <ReviewSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 space-y-8">
      <h2 className="text-2xl font-semibold">Đánh giá sản phẩm</h2>

      <Tabs defaultValue="reviews">
        <TabsList className="mb-6">
          <TabsTrigger value="reviews">Tất cả đánh giá</TabsTrigger>
          <TabsTrigger value="stats">Thống kê đánh giá</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-6">
          {/* Nút đánh giá sản phẩm và bộ lọc */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-lg font-medium">
              {reviewStats.totalReviews} đánh giá từ khách hàng
            </h3>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              {/* Bộ lọc đánh giá */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <Filter className="h-4 w-4 mr-2" />
                    {filterRating ? `${filterRating} sao` : 'Tất cả'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleFilterChange(null)}>
                    Tất cả đánh giá
                  </DropdownMenuItem>
                  {[5, 4, 3, 2, 1].map((r) => (
                    <DropdownMenuItem key={r} onClick={() => handleFilterChange(r)}>
                      {r} sao
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sắp xếp đánh giá */}
              <Button variant="outline" size="sm" className="h-9" onClick={handleSortChange}>
                {sortDirection === 'desc' ? (
                  <SortDesc className="h-4 w-4 mr-2" />
                ) : (
                  <SortAsc className="h-4 w-4 mr-2" />
                )}
                {sortDirection === 'desc' ? 'Mới nhất' : 'Cũ nhất'}
              </Button>

              {/* Nút đánh giá: ai cũng có thể đánh giá */}
              <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
                <DialogTitle>Đánh giá sản phẩm</DialogTitle>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-9">
                    Viết đánh giá
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <ReviewForm productId={productId} orderId="" onSuccess={handleReviewSuccess} />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Separator />

          {/* Danh sách đánh giá */}
          <AnimatePresence>
            {uniqueSortedReviews.length > 0 ? (
              <motion.div
                className="space-y-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {uniqueSortedReviews.map((review, idx) => (
                  <ReviewItem
                    key={`${review.id}-${idx}`}
                    review={review}
                    isHighlighted={review.id === newReviewId}
                  />
                ))}

                {hasMore && (
                  <div className="pt-6 text-center">
                    <Button variant="outline" onClick={handleLoadMore} disabled={loading}>
                      {loading ? 'Đang tải...' : 'Xem thêm đánh giá'}
                    </Button>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                className="py-12 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-gray-500">
                  {filterRating
                    ? `Chưa có đánh giá ${filterRating} sao nào cho sản phẩm này`
                    : 'Chưa có đánh giá nào cho sản phẩm này'}
                </p>
                <Button variant="outline" className="mt-4" onClick={() => setShowReviewForm(true)}>
                  Hãy là người đầu tiên đánh giá
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Điểm đánh giá trung bình */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <motion.div
                className="text-5xl font-bold"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {reviewStats.averageRating.toFixed(1)}
                <span className="text-lg text-gray-500">/5</span>
              </motion.div>

              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 ${
                      star <= Math.round(reviewStats.averageRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              <p className="text-gray-500">Dựa trên {reviewStats.totalReviews} đánh giá</p>
            </div>

            {/* Phân bố đánh giá */}
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating, index) => {
                const count = getStarCount(rating);
                const percentage = getStarPercent(rating);

                return (
                  <motion.div
                    key={rating}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 min-w-[60px] justify-start"
                      onClick={() => {
                        handleFilterChange(rating === filterRating ? null : rating);
                      }}
                    >
                      <span>{rating}</span>
                      <Star className="h-4 w-4 ml-1 fill-yellow-400 text-yellow-400" />
                    </Button>
                    <Progress value={percentage} className="h-2 flex-1" />
                    <div className="w-12 text-right text-sm text-gray-500">{count}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
