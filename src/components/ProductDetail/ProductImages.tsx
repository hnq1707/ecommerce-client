'use client';
import Image from 'next/image';
import { Resource } from '@/lib/redux/features/product/productSlice';

const ProductImages = ({ items = [] }: { items?: Resource[] }) => {
  // Kiểm tra nếu items có dữ liệu và lấy ảnh chính
  const primaryImage =
    items.length > 0 ? items.find((resource) => resource.isPrimary)?.url || items[0]?.url : '';

  // Lấy danh sách ảnh phụ
  const secondaryImages =
    items.length > 0
      ? items.filter((resource) => !resource.isPrimary).map((resource) => resource.url)
      : [];

  return (
    <div className="flex flex-col gap-4">
      {/* Ảnh chính */}
      <div className="relative aspect-square w-full">
        {primaryImage ? (
          <Image src={primaryImage} alt="Product Image" fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            No Image Available
          </div>
        )}
      </div>

      {/* Ảnh phụ */}
      {secondaryImages.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {secondaryImages.map((url, i) => (
            <div key={i} className="relative aspect-square">
              <Image src={url} alt={`Product Image ${i + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImages;
