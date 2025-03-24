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
        className="py-12 md:py-16 px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-32 bg-white"
        aria-labelledby="featured-products-heading"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-10">
          <div>
            <h2
              id="featured-products-heading"
              className="text-xl md:text-2xl font-medium flex items-center gap-2"
            >
              <Sparkles className="h-5 w-5 text-amber-400" />
              Featured Products
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              Discover our handpicked selection of top products
            </p>
          </div>
          <Link
            href="/list"
            className="hidden md:flex items-center text-primary hover:underline transition-colors mt-4 md:mt-0 text-sm"
          >
            View all products
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Link>
        </div>

        <Suspense fallback={<ProductListSkeleton count={4} />}>
          <ProductList />
        </Suspense>

        <div className="mt-8 flex justify-center md:hidden">
          <Button asChild variant="outline" className="rounded-full text-sm">
            <Link href="/list" className="flex items-center gap-1">
              View all products
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Categories Section with background */}
      <section className="py-12 md:py-16 bg-gray-50" aria-labelledby="categories-heading">
        <div className="px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-10">
            <div>
              <h2
                id="categories-heading"
                className="text-xl md:text-2xl font-medium flex items-center gap-2"
              >
                <Tag className="h-5 w-5 text-primary" />
                Shop by Category
              </h2>
              <p className="text-gray-500 mt-1 text-sm">
                Browse our wide range of product categories
              </p>
            </div>
          </div>
        </div>

        <Suspense fallback={<CategoryListSkeleton />}>
          <CategoryList />
        </Suspense>
      </section>

      {/* New Arrivals Section */}
      <section
        className="py-12 md:py-16 px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-32 bg-white"
        aria-labelledby="new-products-heading"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-10">
          <div>
            <h2
              id="new-products-heading"
              className="text-xl md:text-2xl font-medium flex items-center gap-2"
            >
              <Clock className="h-5 w-5 text-green-500" />
              New Arrivals
            </h2>
            <p className="text-gray-500 mt-1 text-sm">The latest additions to our collection</p>
          </div>
          <Link
            href="/list?sort=updatedAt%2Casc"
            className="hidden md:flex items-center text-primary hover:underline transition-colors mt-4 md:mt-0 text-sm"
          >
            View all new arrivals
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Link>
        </div>

        <Suspense fallback={<ProductListSkeleton count={4} />}>
          <ProductList sort="updatedAt%2Casc" />
        </Suspense>

        <div className="mt-8 flex justify-center md:hidden">
          <Button asChild variant="outline" className="rounded-full text-sm">
            <Link href="/list?sort=updatedAt%2Casc" className="flex items-center gap-1">
              View all new arrivals
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Newsletter or Promotion Section */}
      <section className="py-12 md:py-16 px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-32 bg-gray-50">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-xl md:text-2xl font-medium mb-3">Join Our Newsletter</h2>
          <p className="text-gray-600 mb-6 text-sm">
            Stay updated with our latest products and exclusive offers
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
            />
            <Button className="rounded-full bg-primary hover:bg-primary/90 text-sm">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
