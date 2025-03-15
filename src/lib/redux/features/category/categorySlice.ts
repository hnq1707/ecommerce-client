import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '@/lib/utils/api';
import { Category } from '@/lib/type/Category';

// Thunks
export const fetchCategories = createAsyncThunk('categories/fetchAll', async () => {
  const response = await api.get<{ code: number; result: Category[] }>('/api/category');
  return response.data;
});

export const fetchCategoryById = createAsyncThunk('categories/fetchById', async (id: string) => {
  const response = await api.get<Category>(`/api/category/${id}`);
  return response.data;
});

export const createCategory = createAsyncThunk('categories/create', async (category: Category) => {
  const response = await api.post<Category>('/api/category', category);
  return response.data;
});

export const updateCategory = createAsyncThunk(
  'categories/update',
  async ({ id, category }: { id: string; category: Category }) => {
    const response = await api.put<Category>(`/api/category/${id}`, category);
    return response.data;
  },
);

export const deleteCategory = createAsyncThunk('categories/delete', async (id: string) => {
  await api.delete(`/api/category/${id}`);
  return id;
});

// Slice
const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [] as Category[],
    selectedCategory: null as Category | null,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.result ?? [];
      })

      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      })
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCategory = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch category';
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.categories = state.categories.map((category) =>
          category.id === action.payload.id ? action.payload : category,
        );
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((category) => category.id !== action.payload);
      });
  },
});

export default categorySlice.reducer;
