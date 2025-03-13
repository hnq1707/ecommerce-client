'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';
import useProducts from '@/lib/redux/features/product/useProductStore';
import { useCartStore } from '@/lib/redux/features/cart/useCartStore';
import { ShoppingBag, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CartItem } from '@/lib/type/CartItem';
import Pagination from './Pagination';

interface ProductListProps {
  categoryId?: string;
  typeId?: string;
  sort?: string;
  page?: number;
}

const ProductList: React.FC<ProductListProps> = ({ categoryId, typeId, sort ,page}) => {
  const router = useRouter();
  const { products, getProducts, loading, error, totalPages } = useProducts();
  // const [currentPage, setCurrentPage] = useState(page); 

  useEffect(() => {
    getProducts(categoryId, typeId, sort, page - 1);
  }, [categoryId, typeId, sort, page]);
  const { addItem } = useCartStore();
  const handleAddToCart = (product) => {
    const cartItem: CartItem = {
      ...product,
      productVariants: product.productVariants[0],
      resources: product.resources[0],
      quantity: 1,
    };
    addItem(cartItem, 1);
  };

  if (loading) return <p className="text-center text-lg">Đang tải sản phẩm...</p>;
  if (error) return <p className="text-center text-red-500">Lỗi: {error}</p>;

  return (
    <div className="mt-12 flex gap-x-8 gap-y-16 justify-evenly flex-wrap">
      {products.map((product) => {
        const primaryImage = '/product.jpeg';

        return (
          <div
            key={product.id}
            className="w-full sm:w-[45%] lg:w-[22%] flex flex-col gap-4 bg-white shadow-md rounded-lg p-4 transition-transform transform hover:scale-105"
          >
            <Link href={`/${product.slug}`} className="w-full">
              <div className="relative w-full h-80 rounded-lg overflow-hidden">
                <Image
                  src={primaryImage}
                  alt={product.name}
                  fill
                  sizes="25vw"
                  className="absolute object-cover rounded-md"
                />
              </div>
            </Link>

            <div className="flex flex-col gap-2">
              <span className="font-medium text-lg">{product.name}</span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    size={16}
                    className={
                      index < product.rating ? 'text-yellow-500 fill-yellow-500' : 'text-white'
                    }
                  />
                ))}
                <span className="text-sm text-gray-500">({product.rating})</span>
              </div>
              <span className="font-semibold text-lg text-blue-600">${product.price}</span>
            </div>

            <div className="flex gap-2 mt-2">
              <Button
                className="mt-2 rounded-2xl text-white w-full py-2 px-4 text-sm font-semibold hover:bg-white hover:text-black"
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart(product);
                }}
              >
                <ShoppingBag />
                Add to Cart
              </Button>

              <Button
                className="mt-2 rounded-2xl text-white w-full py-2 px-4 text-sm font-semibold hover:bg-white hover:text-black"
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart(product);
                  router.push(`/checkout/${product.id}`);
                }}
              >
                Buy Now
              </Button>
            </div>
          </div>
        );
      })}

      {/* ✅ Pagination tự thay đổi số trang */}
      <Pagination totalPages={totalPages} />
    </div>
  );
};

export default ProductList;
