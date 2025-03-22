import Carousel from '@/components/Carousel';
import CategoryList from '@/components/Category/CategoryList';
import ProductList from '@/components/Product/ProductList';
import { Suspense } from 'react';
import { ArrowRight, Sparkles, Tag, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProductListSkeleton from '@/components/Product/ProductListSkeleton';
import CategoryListSkeleton from '@/components/Category/CategoryListSkeleton';

export default async function Home() {

  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <section aria-label="Hero Carousel">
        <Carousel />
      </section>

      {/* Featured Products Section */}
      <section
        className="py-16 md:py-20 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 bg-white"
        aria-labelledby="featured-products-heading"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12">
          <div>
            <h2
              id="featured-products-heading"
              className="text-2xl md:text-3xl font-bold flex items-center gap-2"
            >
              <Sparkles className="h-6 w-6 text-amber-500" />
              Featured Products
            </h2>
            <p className="text-gray-500 mt-2">Discover our handpicked selection of top products</p>
          </div>
          <Link
            href="/list"
            className="hidden md:flex items-center text-blue-600 hover:text-blue-800 transition-colors mt-4 md:mt-0"
          >
            View all products
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <Suspense fallback={<ProductListSkeleton count={4} />}>
          <ProductList />
        </Suspense>

        <div className="mt-8 flex justify-center md:hidden">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/list" className="flex items-center gap-1">
              View all products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Categories Section with background */}
      <section className="py-16 md:py-20 bg-gray-50" aria-labelledby="categories-heading">
        <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12">
            <div>
              <h2
                id="categories-heading"
                className="text-2xl md:text-3xl font-bold flex items-center gap-2"
              >
                <Tag className="h-6 w-6 text-blue-500" />
                Shop by Category
              </h2>
              <p className="text-gray-500 mt-2">Browse our wide range of product categories</p>
            </div>
          </div>
        </div>

        <Suspense fallback={<CategoryListSkeleton />}>
          <CategoryList />
        </Suspense>
      </section>

      {/* New Arrivals Section */}
      <section
        className="py-16 md:py-20 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 bg-white"
        aria-labelledby="new-products-heading"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12">
          <div>
            <h2
              id="new-products-heading"
              className="text-2xl md:text-3xl font-bold flex items-center gap-2"
            >
              <Clock className="h-6 w-6 text-green-500" />
              New Arrivals
            </h2>
            <p className="text-gray-500 mt-2">The latest additions to our collection</p>
          </div>
          <Link
            href="/list?sort=updatedAt%2Casc"
            className="hidden md:flex items-center text-blue-600 hover:text-blue-800 transition-colors mt-4 md:mt-0"
          >
            View all new arrivals
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <Suspense fallback={<ProductListSkeleton count={4} />}>
          <ProductList sort="updatedAt%2Casc" />
        </Suspense>

        <div className="mt-8 flex justify-center md:hidden">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/list?sort=updatedAt%2Casc" className="flex items-center gap-1">
              View all new arrivals
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Newsletter or Promotion Section */}
      <section className="py-16 md:py-20 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 bg-blue-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Join Our Newsletter</h2>
          <p className="text-gray-600 mb-8">
            Stay updated with our latest products and exclusive offers
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button className="rounded-full bg-blue-600 hover:bg-blue-700">Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
