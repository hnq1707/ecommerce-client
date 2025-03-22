'use client';

import type React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import type { Product } from '@/lib/type/Product';
import PermissionGuard from '@/components/auth/permission-guard';

interface ProductListProps {
  products: Product[];
  selectedProducts: string[];
  onSelectProduct: (productId: string) => void;
  onSelectAll: () => void;
  onViewProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
  formatCurrency: (amount: number) => string;
  getTotalStock: (product: Product) => number;
  getStatusBadge: (product: Product) => React.ReactNode;
  canEdit?: (product: Product) => boolean;
  canDelete?: (product: Product) => boolean;
}

export function ProductList({
  products,
  selectedProducts,
  onSelectProduct,
  onSelectAll,
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
  formatCurrency,
  getTotalStock,
  getStatusBadge,
  canEdit = () => true,
  canDelete = () => true,
}: ProductListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={products.length > 0 && selectedProducts.length === products.length}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead>Sản phẩm</TableHead>
            <TableHead className="hidden md:table-cell">Slug</TableHead>
            <TableHead className="text-right">Giá bán</TableHead>
            <TableHead className="text-center hidden md:table-cell">Tồn kho</TableHead>
            <TableHead className="hidden md:table-cell">Danh mục</TableHead>
            <TableHead className="text-center">Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Checkbox
                  checked={selectedProducts.includes(product.id)}
                  onCheckedChange={() => onSelectProduct(product.id)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Image
                    src={product.thumbnail || '/placeholder.svg?height=50&width=50'}
                    alt={product.name}
                    className="h-10 w-10 rounded-md object-cover bg-gray-100"
                    width={50}
                    height={50}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-xs text-muted-foreground md:hidden">
                      {product.categoryName}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">{product.slug}</TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(product.price)}
              </TableCell>
              <TableCell className="text-center hidden md:table-cell">
                {getTotalStock(product)}
              </TableCell>
              <TableCell className="hidden md:table-cell">{product.categoryName}</TableCell>
              <TableCell className="text-center">{getStatusBadge(product)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewProduct(product)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Xem chi tiết
                    </DropdownMenuItem>

                    <PermissionGuard permission="products_edit">
                      {canEdit(product) && (
                        <DropdownMenuItem onClick={() => onEditProduct(product)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                      )}
                    </PermissionGuard>

                    <DropdownMenuSeparator />

                    <PermissionGuard permission="products_delete">
                      {canDelete(product) && (
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => onDeleteProduct(product)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      )}
                    </PermissionGuard>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
