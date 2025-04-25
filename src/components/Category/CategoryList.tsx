'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import useCategoryStore from '@/lib/redux/features/category/useCategoryStore';
import { Category } from '@/lib/types/Category';

const CategoryList = () => {
  const { categories, getCategories, loading } = useCategoryStore();

  useEffect(() => {
    getCategories();
  }, []);

  // Image mapping for categories
  const ImageList = [
    {
      id: 1,
      code: 'thoi-trang-nu',
      url: '/thoi-trang-nu.jpeg',
    },
    {
      id: 2,
      code: 'thoi-trang-nam',
      url: '/thoi-trang-nam.jpeg',
    },
    {
      id: 3,
      code: 'thoi-trang-cong-so',
      url: '/thoi-trang-cong-so.jpeg',
    },
    {
      id: 4,
      code: 'thoi-trang-the-thao-',
      url: '/thoi-trang-the-thao.jpeg',
    },
    {
      id: 5,
      code: 'do-lot-do-ngu',
      url: '/do-lot-do-ngu.jpeg',
    },
    {
      id: 6,
      code: 'phu-kien',
      url: '/phu-kien.jpg',
    },
    {
      id: 7,
      code: 'giay-dep',
      url: '/giay-dep.jpeg',
    },
  ];

  if (loading || !categories.length) {
    return null;
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Create a grid layout for categories
  const categoryGroups = [
    // First row - 2 items
    categories.slice(0, 2),
    // Second row - 3 items
    categories.slice(2, 5),
    // Third row - 2 items
    categories.slice(5, 7),
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-32 overflow-hidden"
    >
      <div className="grid gap-6">
        {/* First row - 2 items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categoryGroups[0]?.map((category) => {
            // Find matching image
            const image = ImageList.find((img) => img.code === category.code);
            return (
              <CategoryCard
                key={category.id}
                category={category}
                variants={item}
                size="large"
                imageUrl={image?.url || '/placeholder.svg'}
              />
            );
          })}
        </div>

        {/* Second row - 3 items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categoryGroups[1]?.map((category) => {
            // Find matching image
            const image = ImageList.find((img) => img.code === category.code);
            return (
              <CategoryCard
                key={category.id}
                category={category}
                variants={item}
                size="medium"
                imageUrl={image?.url || '/placeholder.svg'}
              />
            );
          })}
        </div>

        {/* Third row - 2 items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categoryGroups[2]?.map((category) => {
            // Find matching image
            const image = ImageList.find((img) => img.code === category.code);
            return (
              <CategoryCard
                key={category.id}
                category={category}
                variants={item}
                size="large"
                imageUrl={image?.url || '/placeholder.svg'}
              />
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

interface CategoryCardProps {
  category: Category;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variants: any;
  size: 'large' | 'medium' | 'small';
  imageUrl: string;
}

const CategoryCard = ({ category, variants, size, imageUrl }: CategoryCardProps) => {
  return (
    <motion.div
      variants={variants}
      whileHover={{ y: -5 }}
      className="relative overflow-hidden rounded-xl group"
    >
      <Link href={`/list?categoryId=${category.id}`} className="block">
        <div className={`relative ${size === 'large' ? 'aspect-[16/9]' : 'aspect-square'}`}>
          <Image
            src={imageUrl || '/placeholder.svg'}
            alt={category.name}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          <div className="absolute inset-0 flex items-center justify-center">
            <motion.h3
              className="text-white text-2xl md:text-3xl font-bold text-center px-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {category.name}
            </motion.h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryList;
