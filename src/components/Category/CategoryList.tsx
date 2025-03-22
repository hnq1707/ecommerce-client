'use client';

import { useEffect } from 'react';
import useCategories from '@/lib/redux/features/category/useCategoryStore';
import Image from 'next/image';
import Link from 'next/link';
import { Category } from '@/lib/type/Category';

const CategoryList = () => {
  const { categories, loading, error, getCategories } = useCategories();

  useEffect(() => {
    getCategories();
  }, []);

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

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="px-4 overflow-x-scroll scrollbar-hide">
      <div className="flex gap-4 md:gap-8">
        {categories.map((item: Category) => {
          // Tìm hình ảnh có code trùng với code của category
          const image = ImageList.find((img) => img.code === item.code);
          return (
            <Link
              href={`/list?categoryId=${item.id}`}
              className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4 xl:w-1/6"
              key={item.id}
            >
              <div className="relative bg-slate-100 w-full h-96">
                <Image
                  src={image?.url || '/product.jpeg'}
                  alt={item.name}
                  fill
                  sizes="20vw"
                  className="object-cover"
                />
              </div>
              <h1 className="mt-8 font-light text-xl tracking-wide">{item.name}</h1>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryList;
