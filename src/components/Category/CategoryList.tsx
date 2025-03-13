'use client';

import { useEffect } from 'react';
import  useCategories  from '@/lib/redux/features/category/useCategoryStore';
import Image from 'next/image';
import Link from 'next/link';
import { Category } from '@/lib/type/Category';

const CategoryList = () => {
  const { categories, loading, error, getCategories } = useCategories();

  useEffect(() => {
    getCategories();
  }, []);

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="px-4 overflow-x-scroll scrollbar-hide">
      <div className="flex gap-4 md:gap-8">
        {categories.map((item : Category) => (
          <Link
            href={`/list?categoryId=${item.id}`}
            className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4 xl:w-1/6"
            key={item.id}
          >
            <div className="relative bg-slate-100 w-full h-96">
              <Image
                src='/product.jpeg'
                alt={item.name}
                fill
                sizes="20vw"
                className="object-cover"
              />
            </div>
            <h1 className="mt-8 font-light text-xl tracking-wide">{item.name}</h1>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
