import { Skeleton } from '@/components/ui/skeleton';

interface ProductListSkeletonProps {
  count?: number;
}

const ProductListSkeleton = ({ count = 8 }: ProductListSkeletonProps) => {
  return (
    <div className="mt-8 flex gap-x-8 gap-y-16 justify-evenly flex-wrap">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="w-full sm:w-[45%] lg:w-[22%] flex flex-col gap-4 bg-white shadow-md rounded-xl overflow-hidden"
        >
          {/* Image skeleton */}
          <Skeleton className="w-full h-64" />

          {/* Content skeleton */}
          <div className="flex flex-col gap-3 px-4 pb-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-7 w-20" />

            {/* Button skeletons */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Skeleton className="h-10 w-full rounded-full" />
              <Skeleton className="h-10 w-full rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductListSkeleton;
