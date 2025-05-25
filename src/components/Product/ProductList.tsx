'use client';

import type React from 'react';
import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, AlertCircle, Loader2, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useProducts from '@/lib/redux/features/product/useProductStore';
import { useCartStore } from '@/lib/redux/features/cart/useCartStore';
import Pagination from './Pagination';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import type { Product } from '@/lib/types/Product';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';

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
  const [searchTerm, setSearchTerm] = useState(searchParams.get('keyword') || '');
  const [initialized, setInitialized] = useState(false);
  const [, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      return;
    }
    getProducts(categoryId, typeId, sort, (page ?? 1) - 1);
  }, [categoryId, typeId, sort, page, initialized]);

  // Cập nhật URL khi searchTerm thay đổi
  useEffect(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (debouncedSearchTerm) {
      current.set('keyword', debouncedSearchTerm);
    } else {
      current.delete('keyword');
    }
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.replace(`${window.location.pathname}${query}`, { scroll: false });
  }, [debouncedSearchTerm]);

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsSearching(true);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setIsSearching(false);
  };

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    const searchLower = searchTerm.toLowerCase();
    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.categoryName?.toLowerCase().includes(searchLower)
      );
    });
  }, [products, searchTerm]);

  const ResultsSummary = () => {
    if (!searchTerm) return null;
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm text-gray-600 mb-4"
      >
        Tìm thấy {filteredProducts.length} sản phẩm cho {searchTerm}
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="relative w-full max-w-md mx-auto">
          <Input
            disabled
            type="text"
            placeholder="Đang tải..."
            className="pl-10 rounded-full bg-gray-50"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-300" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
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

  return (
    <div className="flex flex-col space-y-6">
      {/* Search Section */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md py-4 border-b">
        <div className="max-w-md mx-auto relative">
          <Input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 pr-10 rounded-full shadow-sm hover:shadow-md transition-shadow"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          )}
        </div>
        <ResultsSummary />
      </div>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {filteredProducts.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center p-8 rounded-lg bg-gray-50/50 border border-gray-100"
          >
            <ShoppingBag className="h-10 w-10 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-700 mb-1">
              {searchTerm
                ? `Không tìm thấy sản phẩm nào cho "${searchTerm}"`
                : 'Không có sản phẩm nào'}
            </h3>
            <p className="text-center text-gray-500 mb-4 text-sm">
              {searchTerm
                ? 'Vui lòng thử với từ khóa khác hoặc xóa bộ lọc tìm kiếm'
                : 'Vui lòng thử lại với bộ lọc khác'}
            </p>
            {searchTerm && (
              <Button variant="outline" onClick={clearSearch} className="rounded-full">
                Xóa bộ lọc tìm kiếm
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ staggerChildren: 0.05 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <ProductCard
                    product={product}
                    onBuyNow={() => handleBuyNow(product)}
                  />
                </motion.div>
              ))}
            </div>

            {totalPages > 1 && !searchTerm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center mt-8"
              >
                <Pagination totalPages={totalPages} />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductList;