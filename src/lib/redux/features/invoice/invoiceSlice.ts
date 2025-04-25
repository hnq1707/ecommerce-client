/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '@/lib/utils/api';
import { Invoice } from '@/lib/types/Invoice';

interface InvoiceState {
  invoices: Invoice[];
  selectedInvoice: Invoice | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

// Thunk để lấy danh sách hóa đơn với bộ lọc: 'all', 'paid' hoặc 'unpaid'
export const fetchInvoices = createAsyncThunk(
  'invoices/fetchAll',
  async ({
    page = 0,
    size = 10,
    filter = 'all',
  }: {
    page?: number;
    size?: number;
    filter?: 'all' | 'paid' | 'unpaid';
  }) => {
    let endpoint = '/api/invoices';
    if (filter === 'paid') {
      endpoint = '/api/invoices/paid';
    } else if (filter === 'unpaid') {
      endpoint = '/api/invoices/unpaid';
    }
    const response = await api.get(`${endpoint}?page=${page}&size=${size}`);
    return response.data.result;
  },
);
export const createInvoice = createAsyncThunk(
  'invoices/create',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await api.post<Invoice>('/api/invoices', null, { params: { orderId } });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to create invoice');
    }
  },
);

// Thunk để lấy chi tiết hóa đơn theo ID
export const fetchInvoiceById = createAsyncThunk('invoices/fetchById', async (id: string) => {
  const response = await api.get<Invoice>(`/api/invoices/${id}`);
  return response.data;
});

const initialState: InvoiceState = {
  invoices: [],
  selectedInvoice: null,
  loading: false,
  error: null,
  currentPage: 0,
  totalPages: 0,
  totalItems: 0,
};

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload.content;
        state.currentPage = action.payload.pageable.pageNumber;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch invoices';
      })
      .addCase(fetchInvoiceById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedInvoice = action.payload;
      })
      .addCase(fetchInvoiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch invoice';
      })
      .addCase(createInvoice.pending, (state) => {
        state.loading = true;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices.push(action.payload);
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default invoiceSlice.reducer;
