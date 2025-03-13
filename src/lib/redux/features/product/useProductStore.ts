'use client';

import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  fetchProductById,
  createProduct,
  updateProduct,
  fetchProductBySlug
  
} from '@/lib/redux/features/product/productSlice';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { Product } from '@/lib/type/Product';

const useProducts = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { products, selectedProduct, currentPage, totalPages, totalItems, loading, error } =
    useSelector((state: RootState) => state.product);


  const getProducts = (categoryId?: string, typeId?: string, sort?: string, page?: number) => {
    dispatch(fetchProducts({ categoryId, typeId, sort, page }));
  };

  const getProductById = (id: string) => {
    dispatch(fetchProductById(id));
  };
  const getProductBySlug = (slug: string) => {
    dispatch(fetchProductBySlug(slug));
  };

  // Hàm tạo sản phẩm mới
  const addProduct = (product: Product) => {
    dispatch(createProduct(product));
  };

  // Hàm cập nhật sản phẩm
  const modifyProduct = (id: string, product: Product) => {
    dispatch(updateProduct({ id, product }));
  };

  return {
    products,
    selectedProduct,
    currentPage,
    totalPages,
    totalItems,
    loading,
    error,
    getProducts,
    getProductById,
    getProductBySlug,
    addProduct,
    modifyProduct,
  };
};

export default useProducts;
