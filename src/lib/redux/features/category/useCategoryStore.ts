'use client';

import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCategories,
  fetchCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  
} from '@/lib/redux/features/category/categorySlice';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { Category } from '@/lib/type/Category';

const useCategories = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { categories, selectedCategory, loading, error } = useSelector(
    (state: RootState) => state.category,
  );

  // Lấy danh sách danh mục
  const getCategories = () => {
    dispatch(fetchCategories());
  };

  // Lấy danh mục theo ID
  const getCategoryById = (id: string) => {
    dispatch(fetchCategoryById(id));
  };

  // Thêm danh mục mới
  const addCategory = (category: Category) => {
    dispatch(createCategory(category));
  };

  // Cập nhật danh mục
  const modifyCategory = (id: string, category: Category) => {
    dispatch(updateCategory({ id, category }));
  };

  // Xóa danh mục
  const removeCategory = (id: string) => {
    dispatch(deleteCategory(id));
  };

  return {
    categories,
    selectedCategory,
    loading,
    error,
    getCategories,
    getCategoryById,
    addCategory,
    modifyCategory,
    removeCategory,
  };
};

export default useCategories;
