'use client';

import useCategoryStore from '@/lib/redux/features/category/useCategoryStore';
import { CategoryType } from '@/lib/type/Category';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const Filter = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  // Lấy dữ liệu từ Redux Store
  const { categories = [], selectedCategory, getCategories, getCategoryById } = useCategoryStore();

  const [categoryId, setCategoryId] = useState('');
  const [categoryTypes, setCategoryTypes] = useState<CategoryType[]>([]); // ✅ State riêng cho categoryTypes

  // Lấy danh sách categories khi component mount
  useEffect(() => {
    getCategories();
  }, []);

  // Lấy danh sách categoryTypes khi categoryId thay đổi
  useEffect(() => {
    const fetchCategoryTypes = async () => {
      if (categoryId) {
        await getCategoryById(categoryId); // Chờ lấy category
      }
    };

    fetchCategoryTypes();
  }, [categoryId]);

  useEffect(() => {
    if (selectedCategory?.categoryTypes) {
      setCategoryTypes(selectedCategory.categoryTypes);
    } else {
      setCategoryTypes([]);
    }
  }, [selectedCategory]);
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryId(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    const params = new URLSearchParams(searchParams);

    if (name === 'sort' && value) {
      const [direction, field] = value.split(' ');
      params.set(name, `${field},${direction}`); 
    } else if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mt-12 flex justify-between">
      <div className="flex gap-6 flex-wrap">
        {/* Lọc theo Category */}
        <select
          name="categoryId"
          className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]"
          onChange={(e) => {
            handleCategoryChange(e);
            handleFilterChange(e);
          }}
          value={categoryId}
        >
          <option value="">All Categories</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Lọc theo Type dựa trên categoryId đã chọn */}
        <select
          name="typeId"
          className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]"
          onChange={handleFilterChange}
          disabled={!categoryId}
        >
          <option value="">All Types</option>
          {categoryTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      {/* Sort By */}
      <div>
        <select
          name="sort"
          className="py-2 px-4 rounded-2xl text-xs font-medium bg-white ring-1 ring-gray-400"
          onChange={handleFilterChange}
        >
          <option value="">Sort By</option>
          <option value="asc price">Price (low to high)</option>
          <option value="desc price">Price (high to low)</option>
          <option value="asc updatedAt">Newest</option>
          <option value="desc updatedAt">Oldest</option>
        </select>
      </div>
    </div>
  );
};

export default Filter;
