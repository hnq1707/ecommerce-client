import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/utils/api';
import { Product } from '@/lib/type/Product';

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async ({
    categoryId,
    typeId,
    sort,
    page,
  }: {
    categoryId?: string;
    typeId?: string;
    sort?: string;
    page?: number;
  }) => {
    const params = new URLSearchParams();

    if (categoryId) params.append('categoryId', categoryId);
    if (typeId) params.append('typeId', typeId);
    if (sort) params.append('sort', sort);
    if (page !== undefined) params.append('page', page.toString());

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await api.get(`/products${queryString}`);
    return response.data.result;
  },
);

export const fetchProductById = createAsyncThunk('products/fetchById', async (id: string) => {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
});

export const fetchProductBySlug = createAsyncThunk('products/fetchBySlug', async (slug: string) => {
  const response = await api.get(`/products?slug=${slug}`);
  return response.data.result.content.length > 0 ? response.data.result.content[0] : null;
});

export const createProduct = createAsyncThunk('products/create', async (product: Product) => {
  const response = await api.post<Product>('/products', product);
  return response.data;
});

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, product }: { id: string; product: Product }) => {
    const response = await api.put<Product>(`/products/${id}`, product);
    return response.data;
  },
);

// Slice
const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [] as Product[],
    selectedProduct: null as Product | null,
    loading: false,
    error: null as string | null,
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.content;
        state.currentPage = action.payload.pageable.pageNumber;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch product';
      })
      .addCase(fetchProductBySlug.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch product';
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.products = state.products.map((product) =>
          product.id === action.payload.id ? action.payload : product,
        );
      });
  },
});
export default productSlice.reducer;
