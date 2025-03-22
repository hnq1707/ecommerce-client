'use client';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CategoryType } from '@/lib/type/Category';

interface Category {
  id: string;
  name: string;
  code: string;
  types: CategoryType[];
}

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  categories: Category[];
}

export function ProductFilters({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  statusFilter,
  onStatusFilterChange,
  categories,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Tìm kiếm sản phẩm..."
          className="pl-8"
          value={searchTerm ?? ''}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Lọc theo danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="in-stock">Còn hàng</SelectItem>
            <SelectItem value="low-stock">Sắp hết</SelectItem>
            <SelectItem value="out-of-stock">Hết hàng</SelectItem>
            <SelectItem value="new-arrival">Mới</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
