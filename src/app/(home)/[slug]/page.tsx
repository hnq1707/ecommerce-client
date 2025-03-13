'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import CustomizeProducts from '@/components/ProductDetail/CustomizeProduct';
import ProductImages from '@/components/ProductDetail/ProductImages';
import useProducts from '@/lib/redux/features/product/useProductStore';

const SinglePage = () => {
  const { slug } = useParams();
  const { selectedProduct, loading, error, getProductBySlug } = useProducts();

  useEffect(() => {
    getProductBySlug(slug as string);
  }, []);
  const product = Array.isArray(selectedProduct) ? selectedProduct[0] : selectedProduct;
  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    );
  }

  if (error) return <div className="text-red-500">Error: {error}</div>;

  if (!selectedProduct) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16">
      {/* IMG */}
      <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
        <ProductImages items={product.resources} />
      </div>
      {/* TEXTS */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <h1 className="text-4xl font-medium">{product.name}</h1>
        <p className="text-gray-500">{product.description}</p>
        <div className="h-[2px] bg-gray-100" />
        <h2 className="font-medium text-2xl">${product.price}</h2>
        <div className="h-[2px] bg-gray-100" />

        <CustomizeProducts product={product} />
      </div>
    </div>
  );
};

export default SinglePage;
