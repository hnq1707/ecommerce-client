'use client';

import { useParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import CustomizeProducts from '@/components/ProductDetail/CustomizeProduct';
import ProductImages from '@/components/ProductDetail/ProductImages';
import useProducts from '@/lib/redux/features/product/useProductStore';
import ProductReviews from '@/components/product-review/ProductReview';
import { Star, ChevronRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

const SinglePage = () => {
  const { slug } = useParams();
  const { selectedProduct, loading, error, getProductBySlug } = useProducts();
  const formatCurrency = (amount: number) => {
    amount = amount * 23000;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  useEffect(() => {
    getProductBySlug(slug as string);
  }, []);

  const product = Array.isArray(selectedProduct) ? selectedProduct[0] : selectedProduct;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          <div className="w-full lg:w-1/2">
            <Skeleton className="aspect-square w-full rounded-lg" />
          </div>
          <div className="w-full lg:w-1/2 space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-8 w-1/3" />
            <div className="pt-4">
              <Skeleton className="h-40 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Đã xảy ra lỗi</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => getProductBySlug(slug as string)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );

  if (!selectedProduct) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          <div className="w-full lg:w-1/2">
            <Skeleton className="aspect-square w-full rounded-lg" />
          </div>
          <div className="w-full lg:w-1/2 space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-8 w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Trang chủ
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/list" className="hover:text-blue-600 transition-colors">
          Sản phẩm
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-gray-700 font-medium truncate max-w-[200px]">{product.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
        {/* IMG */}
        <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
          <ProductImages items={product.resources} />
        </div>

        {/* TEXTS */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-medium">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.floor(product.rating || 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {product.rating?.toFixed(1) || '0.0'} ({product.productVariants?.length || 0} đánh
                giá)
              </span>
            </div>
          </div>

          <p className="text-gray-600">{product.description}</p>

          <Separator className="my-2" />

          <div className="flex items-baseline gap-3">
            <h2 className="font-medium text-2xl text-blue-600">{formatCurrency(product.price)}</h2>
            {product.oldPrice && (
              <span className="text-gray-500 line-through text-lg">
                {formatCurrency(product.oldPrice)}
              </span>
            )}
          </div>

          <Separator className="my-2" />

          <CustomizeProducts product={product} />

          <Separator className="my-4" />

          {/* Thông tin thêm */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-lg mb-4">Thông tin sản phẩm</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-gray-500">Thương hiệu</p>
                <p className="font-medium">{product.brand}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500">Danh mục</p>
                <p className="font-medium">{product.categoryName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500">Loại</p>
                <p className="font-medium">{product.categoryTypeName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500">Mã sản phẩm</p>
                <p className="font-medium">{product.id}</p>
              </div>
            </div>
          </div>

          {/* Chính sách */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
            <div className="flex items-center gap-2 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Giao hàng miễn phí</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Đổi trả trong 30 ngày</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span>Bảo hành 12 tháng</span>
            </div>
          </div>
        </div>
      </div>

      {/* Đánh giá sản phẩm */}
      <div className="mt-16">
        <Suspense fallback={<Skeleton className="h-96 w-full rounded-lg" />}>
          <ProductReviews productId={product.id} />
        </Suspense>
      </div>
    </div>
  );
};

export default SinglePage;
