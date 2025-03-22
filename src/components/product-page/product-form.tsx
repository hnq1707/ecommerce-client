'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Product } from '@/lib/type/Product';
import { CategoryType } from '@/lib/type/Category';

interface Category {
  id: string;
  name: string;
  code: string;
  types: CategoryType[];
}

interface ProductFormBasicProps {
  product: Product;
  onProductChange: (product: Partial<Product>) => void;
  categories: Category[];
  generateSlug: (name: string) => string;
}

export function ProductFormBasic({
  product,
  onProductChange,
  categories,
  generateSlug,
}: ProductFormBasicProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Tên sản phẩm */}
      <div className="grid gap-2">
        <Label htmlFor="name">
          Tên sản phẩm <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          value={product.name ?? ''}
          onChange={(e) => {
            const name = e.target.value;
            onProductChange({
              name,
              slug: generateSlug(name),
            });
          }}
          placeholder="Nhập tên sản phẩm"
          required
        />
      </div>

      {/* Slug */}
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="slug">
            Slug <span className="text-red-500">*</span>
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2"
                  onClick={() => onProductChange({ slug: generateSlug(product.name) })}
                >
                  <SlidersHorizontal className="h-3 w-3 mr-1" />
                  Tự động
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Slug được tạo tự động từ tên sản phẩm</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="slug"
          value={product.slug ?? ''}
          onChange={(e) => onProductChange({ slug: e.target.value })}
          placeholder="VD: san-pham-001"
          required
        />
      </div>

      {/* Giá bán */}
      <div className="grid gap-2">
        <Label htmlFor="price">
          Giá bán <span className="text-red-500">*</span>
        </Label>
        <Input
          id="price"
          type="number"
          value={product.price ?? ''}
          onChange={(e) => onProductChange({ price: Number(e.target.value) })}
          placeholder="0"
          required
        />
      </div>

      {/* Thương hiệu */}
      <div className="grid gap-2">
        <Label htmlFor="brand">Thương hiệu</Label>
        <Input
          id="brand"
          value={product.brand ?? ''}
          onChange={(e) => onProductChange({ brand: e.target.value })}
          placeholder="Nhập thương hiệu"
        />
      </div>

      {/* Đánh giá */}
      <div className="grid gap-2">
        <Label htmlFor="rating">Đánh giá (0-5)</Label>
        <Input
          id="rating"
          type="number"
          min="0"
          max="5"
          step="0.1"
          value={product.rating ?? ''}
          onChange={(e) => onProductChange({ rating: Number(e.target.value) })}
          placeholder="0"
        />
      </div>

      {/* Danh mục */}
      <div className="grid gap-2">
        <Label htmlFor="categoryName">
          Danh mục <span className="text-red-500">*</span>
        </Label>
        <Select
          value={product.categoryId}
          onValueChange={(value) => {
            const selectedCategory = categories.find((cat) => cat.id === value);
            onProductChange({
              categoryId: value,
              categoryName: selectedCategory ? selectedCategory.name : '',
              categoryTypeId: '',
              categoryTypeName: '',
            });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn danh mục" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category Type */}
      <div className="grid gap-2">
        <Label htmlFor="categoryTypeId">Loại danh mục</Label>
        <Select
          value={product.categoryTypeId}
          onValueChange={(value) => {
            const selectedCategory = categories.find((cat) => cat.id === product.categoryId);
            const selectedType = selectedCategory?.types.find((type) => type.id === value);
            onProductChange({
              categoryTypeId: value,
              categoryTypeName: selectedType ? selectedType.name : '',
            });
          }}
          disabled={!product.categoryId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn loại danh mục" />
          </SelectTrigger>
          <SelectContent>
            {product.categoryId &&
              categories
                .find((cat) => cat.id === product.categoryId)
                ?.types.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category Type Name */}
      <div className="grid gap-2">
        <Label htmlFor="categoryTypeName">Category Type Name</Label>
        <Input
          id="categoryTypeName"
          value={product.categoryTypeName ?? ''}
          onChange={(e) => onProductChange({ categoryTypeName: e.target.value })}
          placeholder="Nhập Category Type Name"
        />
      </div>

      {/* Thumbnail */}
      <div className="grid gap-2">
        <Label htmlFor="thumbnail">Thumbnail URL</Label>
        <Input
          id="thumbnail"
          value={product.thumbnail ?? ''}
          onChange={(e) => onProductChange({ thumbnail: e.target.value })}
          placeholder="URL hình ảnh"
        />
      </div>

      {/* Trạng thái sản phẩm */}
      <div className="grid gap-2">
        <Label htmlFor="newArrival">Trạng thái sản phẩm</Label>
        <Select
          value={product.newArrival ? 'new' : 'old'}
          onValueChange={(value) => onProductChange({ newArrival: value === 'new' })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">Sản phẩm mới</SelectItem>
            <SelectItem value="old">Sản phẩm thường</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Mô tả sản phẩm */}
      <div className="grid gap-2 col-span-1 md:col-span-2">
        <Label htmlFor="description">Mô tả sản phẩm</Label>
        <Textarea
          id="description"
          placeholder="Nhập mô tả sản phẩm"
          rows={4}
          value={product.description}
          onChange={(e) => onProductChange({ description: e.target.value })}
        />
      </div>
    </div>
  );
}
