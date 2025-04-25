import { ProductVariant } from './ProductVariant';
import { Resource } from './Resource';

export type Product = {
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
  productVariants: ProductVariant[];
  resources: Resource[];
  newArrival: boolean;
};
export type ProductRequest = {
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
  productVariants: {
    color: string;
    size: string;
    stockQuantity: number;
    productId: string;
  }[];
  resources: {
    name: string;
    url: string;
    type: string;
    isPrimary: boolean;
  }[];
  newArrival: boolean;
};
