/* eslint-disable react/no-unescaped-entities */
'use client';

import { Suspense } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import ProductList from '@/components/Product/ProductList';
import ProductListSkeleton from '@/components/Product/ProductListSkeleton';
import CategoryList from '@/components/Category/CategoryList';
import CategoryListSkeleton from '@/components/Category/CategoryListSkeleton';
import Carousel from '@/components/Carousel';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Băng chuyền chính */}
      <section aria-label="Băng chuyền chính">
        <Carousel />
      </section>

      {/* Phần Sản phẩm Mới */}
      <section
        className="py-16 md:py-24 px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-32 bg-white"
        aria-labelledby="new-arrivals-heading"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 id="new-arrivals-heading" className="text-3xl md:text-4xl font-bold mb-4">
            Sản phẩm mới
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Các sản phẩm mới nhất được thiết kế để nâng tầm lựa chọn của bạn trong khi vẫn giúp bạn
            trông thật nổi bật!
          </p>
        </motion.div>

        <Suspense fallback={<ProductListSkeleton count={4} />}>
          <ProductList sort="updatedAt%2Casc" />
        </Suspense>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 flex justify-center"
        >
          <Button asChild variant="outline" className="rounded-full px-6">
            <Link href="/list?sort=updatedAt%2Casc" className="flex items-center gap-2">
              Xem tất cả sản phẩm mới
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* Biểu ngữ Bộ sưu tập Nổi bật */}
      <section className="py-16 md:py-24 bg-gray-100">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 md:order-1"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Tìm phong cách hoàn hảo tại cửa hàng mới phong cách HNQ ở Tokyo
              </h2>
              <p className="text-gray-600 mb-6">
                Trải nghiệm phong cách thu mới nhất tại Tokyo, Nhật Bản. Hãy bước vào cửa hàng phong
                cách và sôi động của chúng tôi để khám phá không gian độc đáo và thời thượng.
              </p>
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Hãy đến và tận hưởng ưu đãi!</h3>
                <p className="text-4xl md:text-5xl font-bold text-primary">50%</p>
              </div>
              <Button asChild className="rounded-full px-6">
                <Link href="/list">Xem tất cả sản phẩm</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-1 md:order-2"
            >
              <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="/thoi-trang-cong-so.jpeg"
                  alt="Cửa hàng Tokyo"
                  sizes="100vw"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Phần Bộ sưu tập Nổi bật */}
      <section
        className="py-16 md:py-24 px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-32 bg-white"
        aria-labelledby="featured-collections-heading"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 id="featured-collections-heading" className="text-3xl md:text-4xl font-bold mb-4">
            Bộ sưu tập nổi bật
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Khám phá ngay! Xem bộ sưu tập của chúng tôi để nâng tầm phong cách thời trang.
          </p>
        </motion.div>

        <Suspense fallback={<CategoryListSkeleton />}>
          <CategoryList />
        </Suspense>
      </section>

      {/* Phần Đăng ký nhận bản tin */}
      <section className="py-16 md:py-24 px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-32 bg-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Đăng ký nhận bản tin</h2>
          <p className="text-gray-600 mb-8">Cập nhật các sản phẩm mới nhất và ưu đãi độc quyền</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Địa chỉ email của bạn"
              className="flex-1 px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
            />
            <Button className="rounded-full bg-primary hover:bg-primary/90 text-sm">Đăng ký</Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
