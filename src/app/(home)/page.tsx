import Carousel from '@/components/Carousel';
import CategoryList from '@/components/Category/CategoryList';
import ProductList from '@/components/Product/ProductList';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';
// app/page.js
export default async function Home() {
  return (
    <div>
      <Carousel />
      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-2xl">Featured Products</h1>
        <Suspense fallback={<Skeleton />}>
          <ProductList />
        </Suspense>
      </div>
      <div className="mt-24">
        <h1 className="text-2xl px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 mb-12">Categories</h1>
        <Suspense fallback={<Skeleton />}>
          <CategoryList />
        </Suspense>
      </div>
      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-2xl">New Products</h1>
        <Suspense fallback={<Skeleton />}>
          <ProductList sort="updatedAt%2Casc" />
        </Suspense>
      </div>
    </div>
  );
}
