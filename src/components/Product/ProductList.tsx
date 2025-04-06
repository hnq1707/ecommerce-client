'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useProducts from '@/lib/redux/features/product/useProductStore';
import { useCartStore } from '@/lib/redux/features/cart/useCartStore';
import Pagination from './Pagination';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import type { Product } from '@/lib/type/Product';

interface ProductListProps {
  categoryId?: string;
  typeId?: string;
  sort?: string;
  page?: number;
}

const ProductList: React.FC<ProductListProps> = ({ categoryId, typeId, sort, page }) => {
  const router = useRouter();
  const { products, getProducts, loading, error, totalPages } = useProducts();
  const { addItem } = useCartStore();
  const searchParams = useSearchParams();
  const nameFilter = searchParams.get('name') || '';
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      return;
    }
    getProducts(categoryId, typeId, sort, (page ?? 1) - 1);
  }, [categoryId, typeId, sort, page, initialized]);

  const handleBuyNow = (product: Product) => {
    const cartItem = {
      ...product,
      productVariants: product.productVariants[0],
      resources: [product.resources[0]],
      quantity: 1,
    };
    addItem(cartItem, 1);
    router.push('/checkout');
  };

  const filteredProducts = nameFilter
    ? products.filter((product) => product.name.toLowerCase().includes(nameFilter.toLowerCase()))
    : products;

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center p-8 rounded-lg bg-red-50/50 border border-red-100"
      >
        <AlertCircle className="h-10 w-10 text-red-400 mb-3" />
        <h3 className="text-lg font-medium text-red-700 mb-1">Không thể tải sản phẩm</h3>
        <p className="text-center text-red-600 mb-4 text-sm">{error}</p>
        <Button
          variant="outline"
          onClick={() => getProducts(categoryId, typeId, sort, (page ?? 1) - 1)}
          className="gap-2 rounded-full"
        >
          <Loader2 className="h-4 w-4 animate-spin" />
          Thử lại
        </Button>
      </motion.div>
    );
  }

  if (products.length === 0 || filteredProducts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center p-8 rounded-lg bg-gray-50/50 border border-gray-100"
      >
        <ShoppingBag className="h-10 w-10 text-gray-300 mb-3" />
        <h3 className="text-lg font-medium text-gray-700 mb-1">Không tìm thấy sản phẩm</h3>
        <p className="text-center text-gray-500 mb-4 text-sm">Vui lòng thử lại với bộ lọc khác</p>
        <Button variant="outline" onClick={() => router.push('/list')} className="rounded-full">
          Xem tất cả sản phẩm
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <AnimatePresence>
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <ProductCard product={product} onBuyNow={() => handleBuyNow(product)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 flex justify-center"
        >
          <Pagination totalPages={totalPages} />
        </motion.div>
      )}
    </div>
  );
};

export default ProductList;
