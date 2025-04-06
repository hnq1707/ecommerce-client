'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

const CategoryListSkeleton = () => {
  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-32">
      <div className="text-center mb-8">
        <Skeleton className="h-10 w-64 mx-auto mb-4" />
        <Skeleton className="h-5 w-full max-w-md mx-auto" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {/* Footwear */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Skeleton className="w-full aspect-square rounded-lg" />
        </motion.div>

        {/* Jacket (taller) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="row-span-2"
        >
          <Skeleton className="w-full h-full rounded-lg" style={{ minHeight: '400px' }} />
        </motion.div>

        {/* Accessories */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Skeleton className="w-full aspect-square rounded-lg" />
        </motion.div>

        {/* Headwear */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Skeleton className="w-full aspect-square rounded-lg" />
        </motion.div>

        {/* Bags */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Skeleton className="w-full aspect-square rounded-lg" />
        </motion.div>
      </div>
    </div>
  );
};

export default CategoryListSkeleton;
