/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { createReview } from '@/lib/utils/review-service';
import type { ReviewRequest } from '@/lib/type/Review';
import { motion, AnimatePresence } from 'framer-motion';

const formSchema = z.object({
  rating: z.number().min(1, 'Vui lòng chọn số sao').max(5),
  comment: z
    .string()
    .min(10, 'Đánh giá phải có ít nhất 10 ký tự')
    .max(500, 'Đánh giá không được vượt quá 500 ký tự'),
});

interface ReviewFormProps {
  productId: string;
  orderId: string;
  onSuccess: () => void;
}

export default function ReviewForm({ productId, orderId, onSuccess }: ReviewFormProps) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  const watchedRating = form.watch('rating');

  // Xử lý khi hover vào sao
  const handleStarHover = useCallback((star: number) => {
    setHoveredRating(star);
  }, []);

  // Xử lý khi rời chuột khỏi sao
  const handleStarLeave = useCallback(() => {
    setHoveredRating(0);
  }, []);

  // Xử lý khi chọn sao
  const handleStarClick = useCallback(
    (star: number) => {
      form.setValue('rating', star);
    },
    [form],
  );

  // Lấy label cho rating
  const getRatingLabel = useCallback((rating: number): string => {
    switch (rating) {
      case 1:
        return 'Rất tệ';
      case 2:
        return 'Tệ';
      case 3:
        return 'Bình thường';
      case 4:
        return 'Tốt';
      case 5:
        return 'Rất tốt';
      default:
        return 'Chọn đánh giá';
    }
  }, []);

  // Xử lý submit form
  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      try {
        setIsSubmitting(true);

        const reviewRequest: ReviewRequest = {
          productId,
          orderId,
          rating: values.rating,
          comment: values.comment,
        };

        await createReview(reviewRequest);

        toast({
          title: 'Đánh giá thành công',
          description: 'Cảm ơn bạn đã đánh giá sản phẩm!',
          duration: 3000,
        });

        form.reset();
        onSuccess();
      } catch (error) {
        toast({
          title: 'Đánh giá thất bại',
          description: 'Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.',
          variant: 'destructive',
          duration: 3000,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [productId, orderId, toast, form, onSuccess],
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-medium mb-4">Đánh giá sản phẩm</h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Đánh giá của bạn</FormLabel>
                <FormControl>
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          type="button"
                          className="focus:outline-none"
                          onClick={() => handleStarClick(star)}
                          onMouseEnter={() => handleStarHover(star)}
                          onMouseLeave={handleStarLeave}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Star
                            className={`h-8 w-8 transition-all ${
                              star <= (hoveredRating || field.value)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </motion.button>
                      ))}
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.span
                        key={watchedRating}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className={`text-sm ${
                          watchedRating > 0 ? 'font-medium text-gray-700' : 'text-gray-500'
                        }`}
                      >
                        {getRatingLabel(watchedRating)}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nhận xét của bạn</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                    className="resize-none h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <div className="text-xs text-gray-500 mt-1 text-right">
                  <span className={field.value.length > 400 ? 'text-amber-600' : ''}>
                    {field.value.length}
                  </span>
                  /500 ký tự
                </div>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
            variant={watchedRating > 0 ? 'default' : 'outline'}
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
