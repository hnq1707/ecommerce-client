'use client';

import useCategoryStore from '@/lib/redux/features/category/useCategoryStore';
import type { CategoryType } from '@/lib/type/Category';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FilterIcon, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const Filter = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  // Lấy dữ liệu từ Redux Store
  const {
    categories = [],
    selectedCategory,
    getCategories,
    getCategoryById,
    loading: categoriesLoading,
  } = useCategoryStore();

  const [categoryId, setCategoryId] = useState(searchParams.get('categoryId') || '');
  const [typeId, setTypeId] = useState(searchParams.get('typeId') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '');
  const [categoryTypes, setCategoryTypes] = useState<CategoryType[]>([]);
  const [activeFilters, setActiveFilters] = useState<number>(0);
  const [isMobile, setIsMobile] = useState(false);

  // Kiểm tra kích thước màn hình
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Lấy danh sách categories khi component mount
  useEffect(() => {
    getCategories();
  }, []); // Không có function trong dependency array

  // Lấy danh sách categoryTypes khi categoryId thay đổi
  useEffect(() => {
    if (categoryId && categoryId !== 'all') {
      getCategoryById(categoryId);
    }
  }, [categoryId]);

  useEffect(() => {
    if (selectedCategory?.categoryTypes) {
      setCategoryTypes(selectedCategory.categoryTypes);
    } else {
      setCategoryTypes([]);
    }
  }, [selectedCategory]);

  // Đếm số bộ lọc đang áp dụng
  useEffect(() => {
    let count = 0;
    if (categoryId && categoryId !== 'all') count++;
    if (typeId && typeId !== 'all') count++;
    if (sort && sort !== 'default') count++;
    setActiveFilters(count);
  }, [categoryId, typeId, sort]);

  const applyFilter = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value === 'all' || value === 'default') {
      params.delete(name);
    } else if (name === 'sort' && value) {
      const [direction, field] = value.split(' ');
      params.set(name, `${field},${direction}`);
    } else if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    // Luôn reset về trang 1 khi thay đổi bộ lọc
    params.set('page', '1');
    replace(`${pathname}?${params.toString()}`);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryId(value);
    setTypeId('all'); // Reset typeId khi thay đổi category
    applyFilter('categoryId', value);
    applyFilter('typeId', 'all');
  };

  const handleTypeChange = (value: string) => {
    setTypeId(value);
    applyFilter('typeId', value);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    applyFilter('sort', value);
  };

  const clearAllFilters = () => {
    setCategoryId('all');
    setTypeId('all');
    setSort('default');
    replace(pathname);
  };

  // Các tùy chọn sắp xếp
  const sortOptions = [
    { value: 'default', label: 'Mặc định' },
    { value: 'asc price', label: 'Giá: Thấp đến cao' },
    { value: 'desc price', label: 'Giá: Cao đến thấp' },
    { value: 'desc updatedAt', label: 'Mới nhất' },
    { value: 'asc updatedAt', label: 'Cũ nhất' },
  ];

  // Component bộ lọc cho desktop
  const DesktopFilter = () => (
    <div className="mt-12 flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <FilterIcon className="h-5 w-5 text-gray-500" />
          <span className="font-medium">Lọc:</span>
        </div>

        <Select value={categoryId || 'all'} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[180px] h-12 rounded-full bg-gray-100 border-none">
            <SelectValue placeholder="Danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            {categories?.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={typeId || 'all'}
          onValueChange={handleTypeChange}
          disabled={!categoryId || categoryId === 'all' || categoryTypes.length === 0}
        >
          <SelectTrigger
            className="w-[180px] h-12 rounded-full bg-gray-100 border-none"
            disabled={!categoryId || categoryId === 'all' || categoryTypes.length === 0}
          >
            <SelectValue placeholder="Loại sản phẩm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
            {categoryTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-gray-500" />
          <span className="font-medium">Sắp xếp:</span>
        </div>

        <Select value={sort || 'default'} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px] h-12 rounded-full bg-white border-gray-300">
            <SelectValue placeholder="Sắp xếp theo" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {activeFilters > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="h-12 rounded-full gap-2"
          >
            <X className="h-4 w-4" />
            Xóa bộ lọc
          </Button>
        )}
      </div>
    </div>
  );

  // Component bộ lọc cho mobile
  const MobileFilter = () => (
    <div className="mt-8 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {activeFilters > 0 && (
          <Badge className="bg-blue-600 text-white rounded-full h-6 w-6 p-0 flex items-center justify-center">
            {activeFilters}
          </Badge>
        )}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="h-12 rounded-full gap-2">
              <FilterIcon className="h-5 w-5" />
              Lọc
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Lọc sản phẩm</h3>
                {activeFilters > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="gap-1 text-blue-600"
                  >
                    <X className="h-4 w-4" />
                    Xóa tất cả
                  </Button>
                )}
              </div>

              <Separator className="mb-4" />

              <div className="space-y-6 flex-1 overflow-auto pb-20">
                <div className="space-y-2">
                  <label className="font-medium">Danh mục</label>
                  <Select value={categoryId || 'all'} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="w-full h-12 rounded-xl">
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả danh mục</SelectItem>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="font-medium">Loại sản phẩm</label>
                  <Select
                    value={typeId || 'all'}
                    onValueChange={handleTypeChange}
                    disabled={!categoryId || categoryId === 'all' || categoryTypes.length === 0}
                  >
                    <SelectTrigger className="w-full h-12 rounded-xl">
                      <SelectValue placeholder="Chọn loại sản phẩm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả loại</SelectItem>
                      {categoryTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="font-medium">Sắp xếp theo</label>
                  <Select value={sort || 'default'} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-full h-12 rounded-xl">
                      <SelectValue placeholder="Chọn cách sắp xếp" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t">
                <Button className="w-full h-12 rounded-xl">Áp dụng</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Select value={sort || 'default'} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[150px] h-12 rounded-full border-gray-300">
          <SelectValue placeholder="Sắp xếp" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  // Hiển thị trạng thái loading
  if (categoriesLoading) {
    return (
      <div className="mt-12 flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Đang tải bộ lọc...</span>
      </div>
    );
  }

  return isMobile ? <MobileFilter /> : <DesktopFilter />;
};

export default Filter;
