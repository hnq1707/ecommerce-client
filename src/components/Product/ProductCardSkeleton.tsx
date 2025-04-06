'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

const ProductCardSkeleton = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="flex flex-col bg-white rounded-xl overflow-hidden shadow-sm"
  >
    <Skeleton className="w-full aspect-square" />
    <div className="flex flex-col p-4 gap-2">
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-3 w-3 rounded-full" />
        ))}
        <Skeleton className="h-3 w-8 ml-1" />
      </div>
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-6 w-20 mt-1" />
      <div className="grid grid-cols-2 gap-2 mt-2">
        <Skeleton className="h-9 w-full rounded-full" />
        <Skeleton className="h-9 w-full rounded-full" />
      </div>
    </div>
  </motion.div>
);

export default ProductCardSkeleton;
