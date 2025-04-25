import { ProductVariant } from './ProductVariant';
import { Resource } from './Resource';

export type CartItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  brand: string;
  rating: number;
  categoryId: string;
  thumbnail: string;
  slug: string;
  categoryName: string;
  categoryTypeId: string;
  categoryTypeName: string;
  productVariants: ProductVariant;
  resources: Resource[];
  newArrival: boolean;
  quantity: number;
};
