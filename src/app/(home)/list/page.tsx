'use client';
import Filter from '@/components/Product/Filter';
import ProductList from '@/components/Product/ProductList';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const ListPage = () => {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId') || '';
  const typeId = searchParams.get('typeId') || '';
  const sort = searchParams.get('sort') || '';
  const page = Number(searchParams.get('page')) || 1;
  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative">
      {/* CAMPAIGN */}
      <div className="hidden bg-pink-50 px-4 sm:flex justify-between h-64">
        <div className="w-2/3 flex flex-col items-center justify-center gap-8">
          <h1 className="text-4xl font-semibold leading-[48px] text-gray-700">
            Grab up to 50% off on
            <br /> Selected Products
          </h1>
          <button className="rounded-3xl bg-lama text-white w-max py-3 px-5 text-sm">
            Buy Now
          </button>
        </div>
        <div className="relative w-1/3">
          <Image
            src="https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt=""
            fill
            className="object-contain"
          />
        </div>
      </div>
      {/* FILTER */}
      <Filter />
      {/* PRODUCTS */}
      <h1 className="mt-12 text-xl font-semibold">For You!</h1>
      <Suspense fallback={<Skeleton />}>
        <ProductList categoryId={categoryId} typeId={typeId} sort={sort} page={page}/>
      </Suspense>
    </div>
  );
};

export default ListPage;
