'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';
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
      <div className="mt-12 flex gap-x-8 gap-y-16 justify-evenly flex-wrap">
        {[...Array(8)].map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-12 flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg border border-red-200">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-xl font-semibold text-red-700 mb-2">Không thể tải sản phẩm</h3>
        <p className="text-center text-red-600 mb-4">{error}</p>
        <Button
          variant="outline"
          onClick={() => getProducts(categoryId, typeId, sort, (page ?? 1) - 1)}
          className="gap-2"
        >
          <Loader2 className="h-4 w-4 animate-spin" />
          Thử lại
        </Button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="mt-12 flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
        <ShoppingBag className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy sản phẩm</h3>
        <p className="text-center text-gray-600 mb-4">Vui lòng thử lại với bộ lọc khác</p>
        <Button variant="outline" onClick={() => router.push('/list')}>
          Xem tất cả sản phẩm
        </Button>
      </div>
    );
  }
  if (filteredProducts.length === 0) {
    return (
      <div className="mt-12 flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
        <ShoppingBag className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy sản phẩm</h3>
        <p className="text-center text-gray-600 mb-4">Vui lòng thử lại với bộ lọc khác</p>
        <Button variant="outline" onClick={() => router.push('/list')}>
          Xem tất cả sản phẩm
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-12 flex flex-col">
      <div className="flex gap-x-8 gap-y-16 justify-evenly flex-wrap">
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
        <div className="mt-16 flex justify-center">
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
  const primaryImage = '/product.jpeg';

  return (
    <div className="w-full sm:w-[45%] lg:w-[22%] flex flex-col gap-4 bg-white shadow-md rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl">
      <Link href={`/${product.slug}`} className="w-full group">
        <div className="relative w-full h-64 overflow-hidden">
          <Image
            src={primaryImage || '/placeholder.svg'}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 22vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      </Link>

      <div className="flex flex-col gap-2 px-4 pb-4">
        <Link href={`/${product.slug}`} className="group">
          <h3 className="font-medium text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              size={16}
              className={
                index < Math.round(product.rating)
                  ? 'text-yellow-500 fill-yellow-500'
                  : 'text-gray-300'
              }
            />
          ))}
          <span className="text-sm text-gray-500 ml-1">({product.rating})</span>
        </div>

        <span className="font-bold text-xl text-blue-600">${product.price.toLocaleString()}</span>

        <div className="grid grid-cols-2 gap-2 mt-2">
          <Button
            variant="outline"
            className="rounded-full py-2 px-4 text-sm font-medium transition-colors"
            onClick={(e) => {
              e.preventDefault();
              onAddToCart(product);
            }}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Thêm vào giỏ
          </Button>

          <Button
            className="rounded-full py-2 px-4 text-sm font-medium  transition-colors"
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
  <div className="w-full sm:w-[45%] lg:w-[22%] flex flex-col gap-4 bg-white shadow-md rounded-xl overflow-hidden">
    <Skeleton className="w-full h-64" />
    <div className="flex flex-col gap-3 px-4 pb-4">
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-7 w-20" />
      <div className="grid grid-cols-2 gap-2 mt-2">
        <Skeleton className="h-10 w-full rounded-full" />
        <Skeleton className="h-10 w-full rounded-full" />
      </div>
    </div>
  </div>
);

export default ProductList;
