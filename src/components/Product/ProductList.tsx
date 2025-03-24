'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import useProducts from '@/lib/redux/features/product/useProductStore';
import { useCartStore } from '@/lib/redux/features/cart/useCartStore';
import { ShoppingBag, Star, Loader2, AlertCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CartItem } from '@/lib/type/CartItem';
import Pagination from './Pagination';
import { Product } from '@/lib/type/Product';
import { Skeleton } from '@/components/ui/skeleton';

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

  const handleAddToCart = (product: Product) => {
    const cartItem: CartItem = {
      ...product,
      productVariants: product.productVariants[0],
      resources: [product.resources[0]],
      quantity: 1,
    };
    addItem(cartItem, 1);
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
      <div className="flex flex-col items-center justify-center p-8 rounded-lg bg-red-50/50 border border-red-100">
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
      </div>
    );
  }

  if (products.length === 0 || filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 rounded-lg bg-gray-50/50 border border-gray-100">
        <ShoppingBag className="h-10 w-10 text-gray-300 mb-3" />
        <h3 className="text-lg font-medium text-gray-700 mb-1">Không tìm thấy sản phẩm</h3>
        <p className="text-center text-gray-500 mb-4 text-sm">Vui lòng thử lại với bộ lọc khác</p>
        <Button variant="outline" onClick={() => router.push('/list')} className="rounded-full">
          Xem tất cả sản phẩm
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            onBuyNow={() => {
              handleAddToCart(product);
              router.push('/checkout');
            }}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      )}
    </div>
  );
};

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onBuyNow: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onBuyNow }) => {
  const formatCurrency = (amount: number) => {
    amount = amount * 23000;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <div className="group flex flex-col bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md">
      <Link href={`/${product.slug}`} className="relative w-full aspect-square overflow-hidden">
        <Image
          src={product.thumbnail || '/placeholder.svg'}
          alt={product.name}
          fill
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-col p-4">
        <div className="flex items-center gap-1 mb-1">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              size={14}
              className={
                index < Math.round(product.rating)
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-gray-200'
              }
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
        </div>

        <Link href={`/${product.slug}`} className="group-hover:text-primary transition-colors">
          <h3 className="font-medium text-base line-clamp-2 h-12">{product.name}</h3>
        </Link>

        <span className="font-medium text-lg text-primary mt-1">
          {formatCurrency(product.price)}
        </span>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-xs font-normal h-9"
            onClick={(e) => {
              e.preventDefault();
              onAddToCart(product);
            }}
          >
            <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
            Thêm vào giỏ
          </Button>

          <Button
            className="rounded-full text-xs font-normal h-9"
            onClick={(e) => {
              e.preventDefault();
              onBuyNow();
            }}
          >
            Mua ngay
          </Button>
        </div>
      </div>
    </div>
  );
};

const ProductCardSkeleton = () => (
  <div className="flex flex-col bg-white rounded-lg overflow-hidden">
    <Skeleton className="w-full aspect-square" />
    <div className="flex flex-col p-4 gap-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-6 w-20 mt-1" />
      <div className="grid grid-cols-2 gap-2 mt-2">
        <Skeleton className="h-9 w-full rounded-full" />
        <Skeleton className="h-9 w-full rounded-full" />
      </div>
    </div>
  </div>
);

export default ProductList;
