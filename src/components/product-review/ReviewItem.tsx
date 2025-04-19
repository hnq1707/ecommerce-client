/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { memo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Review } from '@/lib/type/Review';
import { Star, ThumbsUp, Flag } from 'lucide-react';
import { vi } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

interface ReviewItemProps {
  review: Review;
  isHighlighted?: boolean;
}

function ReviewItem({ review, isHighlighted = false }: ReviewItemProps) {
  // Lấy chữ cái đầu của tên người dùng cho avatar fallback
  /**
   * Lấy tối đa 2 ký tự đầu của tên,
   * an toàn với name = undefined hoặc chuỗi rỗng
   */
  const getInitials = (name: string = ''): string => {
    // loại bỏ khoảng trắng 2 đầu, tách theo 1+ khoảng trắng
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '';

    // lấy ký tự đầu của mỗi phần, ghép lại, cắt tối đa 2, uppercase
    return parts
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  // Format thời gian tương đối
  const getRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date;
    } catch (error) {
      return 'không rõ thời gian';
    }
  };

  return (
    <motion.div
      initial={isHighlighted ? { opacity: 0, y: -20 } : false}
      animate={isHighlighted ? { opacity: 1, y: 0 } : {}}
      className={`py-6 border-b last:border-b-0 ${
        isHighlighted ? 'bg-blue-50 -mx-4 px-4 rounded-lg' : ''
      }`}
    >
      <div className="flex gap-4">
        <Avatar className="h-10 w-10 border">
          <AvatarImage src={review.userAvatar || '/placeholder.svg'} alt={review.userName} />
          <AvatarFallback>{getInitials(review.userName)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <h4 className="font-medium">{review.userName}</h4>
            <div className="flex items-center">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-2">
                {getRelativeTime(review.createdAt).toString()}
              </span>
            </div>
          </div>

          <p className="text-gray-700 text-sm whitespace-pre-line">{review.comment}</p>

          <div className="flex items-center gap-2 pt-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-gray-500 hover:text-gray-700"
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    <span className="text-xs">Hữu ích (0)</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Đánh dấu đánh giá này là hữu ích</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-gray-500 hover:text-gray-700"
                  >
                    <Flag className="h-4 w-4 mr-1" />
                    <span className="text-xs">Báo cáo</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Báo cáo đánh giá không phù hợp</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Sử dụng memo để tránh re-render không cần thiết
export default memo(ReviewItem);
