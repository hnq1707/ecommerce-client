import type React from 'react';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import type { Product } from '@/lib/type/Product';

interface ProductDetailViewProps {
  product: Product;
  formatCurrency: (amount: number) => string;
  getTotalStock: (product: Product) => number;
  getStatusBadge: (product: Product) => React.ReactNode;
  getResourceIcon: (type: string) => React.ReactNode;
}

export function ProductDetailView({
  product,
  formatCurrency,
  getTotalStock,
  getStatusBadge,
  getResourceIcon,
}: ProductDetailViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
      <div className="space-y-4">
        <div className="aspect-square relative rounded-lg overflow-hidden border">
          <Image
            src={product.thumbnail || '/placeholder.svg?height=400&width=400'}
            alt={product.name}
            className="object-cover"
            fill
          />
        </div>

        <div className="grid grid-cols-4 gap-2">
          {product.resources
            .filter((r) => r.type === 'image')
            .slice(0, 4)
            .map((resource, index) => (
              <div key={index} className="aspect-square relative rounded-md overflow-hidden border">
                <Image
                  src={resource.url || '/placeholder.svg?height=100&width=100'}
                  alt={resource.name}
                  className="object-cover"
                  fill
                />
              </div>
            ))}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold">{product.name}</h3>
          <p className="text-muted-foreground">{product.slug}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">{formatCurrency(product.price)}</div>
          {getStatusBadge(product)}
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold">Mô tả sản phẩm</h4>
          <p className="text-sm">{product.description || 'Không có mô tả'}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold">Thương hiệu</h4>
            <p>{product.brand || 'Không có'}</p>
          </div>
          <div>
            <h4 className="font-semibold">Danh mục</h4>
            <p>{product.categoryName}</p>
          </div>
          <div>
            <h4 className="font-semibold">Đánh giá</h4>
            <div className="flex items-center">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              <span className="ml-1 text-sm">({product.rating})</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold">Tổng tồn kho</h4>
            <p>{getTotalStock(product)} sản phẩm</p>
          </div>
        </div>

        {product.productVariants.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold">Biến thể sản phẩm</h4>
            <div className="max-h-40 overflow-y-auto border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Màu sắc</TableHead>
                    <TableHead>Kích thước</TableHead>
                    <TableHead className="text-right">Số lượng</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {product.productVariants.map((variant, index) => (
                    <TableRow key={index}>
                      <TableCell>{variant.color || '—'}</TableCell>
                      <TableCell>{variant.size || '—'}</TableCell>
                      <TableCell className="text-right">{variant.stockQuantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {product.resources.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold">Tài nguyên</h4>
            <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
              {product.resources.map((resource, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                  {getResourceIcon(resource.type)}
                  <span className="text-sm truncate flex-1">{resource.name}</span>
                  {resource.isPrimary && (
                    <Badge variant="outline" className="text-xs ml-auto">
                      Chính
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
