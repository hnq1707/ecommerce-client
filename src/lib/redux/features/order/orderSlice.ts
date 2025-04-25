/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/lib/redux/store';
import api from '@/lib/utils/api';
import { Order } from '@/lib/types/Order';

// Định nghĩa các kiểu dữ liệu
interface OrderItemRequest {
  productId: string;
  productVariantId: string;
  quantity: number;
}

export interface OrderRequest {
  userId: string;
  addressId: string;
  totalAmount: number;
  totalPrice: number;
  orderDate: Date;
  discount: number;
  expectedDeliveryDate: Date;
  paymentMethod: string;
  orderItemRequests: OrderItemRequest[];
}

interface OrderResponse {
  orderId: string;
  paymentMethod: string;
  credentials?: {
    client_secret: string;
  };
}

interface ApiResponse<T> {
  code: number;
  message: string;
  result?: T;
}
interface PaginatedResponse<T> {
  code: number;
  message: string;
  result: {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
  };
}

interface OrderState {
  orders: Order[];
  currentOrder: OrderResponse | null;
  orderDetails: Order | null;
  loading: boolean;
  error: string | null;
  paymentStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  paymentError: string | null;

  // Thêm các trường phân trang
  totalPages: number; // Tổng số trang
  totalElements: number; // Tổng số đơn hàng
  currentPage: number; // Trang hiện tại
}
const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  orderDetails: null,
  loading: false,
  error: null,
  paymentStatus: 'idle',
  paymentError: null,

  // Giá trị mặc định cho phân trang
  totalPages: 0,
  totalElements: 0,
  currentPage: 0,
};

// Thunk để tạo đơn hàng
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderRequest: OrderRequest, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<OrderResponse>>(`/api/order`, orderRequest);
      const data = response.data;
      if (data.code !== 201) {
        return rejectWithValue(data.message || 'Không thể tạo đơn hàng');
      }
      return data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Đã xảy ra lỗi');
    }
  },
);

export const getOrderDetails = createAsyncThunk(
  'order/getOrderDetails',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/order/${orderId}`);
      const data = response.data;
      if (data.code !== 1000) {
        return rejectWithValue(data.message || 'Không thể lấy thông tin đơn hàng');
      }

      return data.result || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi lấy thông tin đơn hàng');
    }
  },
);

export const updatePaymentStatus = createAsyncThunk(
  'order/updatePaymentStatus',
  async (
    {
      orderId,
      paymentIntentId,
      status,
    }: { orderId: string; paymentIntentId: string; status: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post('/api/order/update-payment', {
        paymentIntent: paymentIntentId,
        status,
      });

      return { orderId, status: 'success' };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Không thể cập nhật trạng thái thanh toán',
      );
    }
  },
);

// Thunk để hủy đơn hàng
export const cancelOrder = createAsyncThunk(
  'order/cancelOrder',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/order/cancel/${orderId}`);
      console.log(response);
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể hủy đơn hàng');
    }
  },
);

// Thunk để lấy danh sách đơn hàng của người dùng
export const getUserOrders = createAsyncThunk(
  'order/getUserOrders',
  async (
    { page = 0, size = 8, sortBy = 'newest' }: { page?: number; size?: number; sortBy?: string },
    { rejectWithValue },
  ) => {
    try {
      // Định nghĩa mapping từ sortBy (frontend) sang query parameter cho backend
      const sortMapping: Record<string, string> = {
        newest: 'orderDate,desc',
        oldest: 'orderDate,asc',
        'price-high': 'totalAmount,desc',
        'price-low': 'totalAmount,asc',
      };

      const sortQuery = sortMapping[sortBy] || sortMapping['newest'];

      const response = await api.get<PaginatedResponse<Order>>(
        `/api/order/users?page=${page}&size=${size}&sort=${sortQuery}`,
      );
      const data = response.data;
      if (data.code !== 1000) {
        return rejectWithValue(data.message || 'Không thể lấy danh sách đơn hàng');
      }
      return data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy danh sách đơn hàng');
    }
  },
);
export const getAllOrders = createAsyncThunk(
  'order/getAllOrders',
  async (
    { page = 0, size = 8, sortBy = 'newest' }: { page?: number; size?: number; sortBy?: string },
    { rejectWithValue },
  ) => {
    try {
      // Mapping sắp xếp từ frontend sang query parameter cho backend
      const sortMapping: Record<string, string> = {
        newest: 'orderDate,desc',
        oldest: 'orderDate,asc',
        'price-high': 'totalAmount,desc',
        'price-low': 'totalAmount,asc',
      };
      const sortQuery = sortMapping[sortBy] || sortMapping['newest'];

      // Gọi API với endpoint dành cho quản trị viên (ví dụ: /api/order/all)
      const response = await api.get<PaginatedResponse<Order>>(
        `/api/order?page=${page}&size=${size}&sort=${sortQuery}`,
      );
      const data = response.data;
      if (data.code !== 1000) {
        return rejectWithValue(data.message || 'Không thể lấy danh sách đơn hàng');
      }
      return data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy danh sách đơn hàng');
    }
  },
  
);
export const updateOrderStatus = createAsyncThunk(
  'order/updateOrderStatus',
  async ({ id, status }: { id: string; status: Order['orderStatus'] }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/order/update-status/${id}`, status);
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Không thể cập nhật trạng thái đơn hàng',
      );
    }
  },
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearOrderDetails: (state) => {
      state.orderDetails = null;
    },
    resetPaymentStatus: (state) => {
      state.paymentStatus = 'idle';
      state.paymentError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Xử lý createOrder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<OrderResponse | undefined>) => {
        state.loading = false;
        if (action.payload) {
          state.currentOrder = action.payload;
        } else {
          state.error = 'Order creation failed';
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Xử lý getOrderDetails
      .addCase(getOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action: PayloadAction<Order | undefined>) => {
        state.loading = false;
        state.orderDetails = action.payload || null;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Xử lý updatePaymentStatus
      .addCase(updatePaymentStatus.pending, (state) => {
        state.paymentStatus = 'loading';
        state.paymentError = null;
      })
      .addCase(updatePaymentStatus.fulfilled, (state) => {
        state.paymentStatus = 'succeeded';
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        state.paymentStatus = 'failed';
        state.paymentError = action.payload as string;
      })

      // Xử lý cancelOrder
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.orders = state.orders.map((order) =>
          order.id === action.payload ? { ...order, orderStatus: 'CANCELLED' } : order,
        );
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Xử lý getUserOrders
      .addCase(getUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getUserOrders.fulfilled,
        (state, action: PayloadAction<PaginatedResponse<Order>['result']>) => {
          state.loading = false;
          state.orders = action.payload.content;
          state.totalPages = action.payload.totalPages;
          state.totalElements = action.payload.totalElements;
          state.currentPage = action.payload.number;
        },
      )
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllOrders.fulfilled,
        (state, action: PayloadAction<PaginatedResponse<Order>['result']>) => {
          state.loading = false;
          state.orders = action.payload.content;
          state.totalPages = action.payload.totalPages;
          state.totalElements = action.payload.totalElements;
          state.currentPage = action.payload.number;
        },
      )
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentOrder, clearOrderDetails, resetPaymentStatus } = orderSlice.actions;

export const selectOrders = (state: RootState) => state.order.orders;
export const selectTotalPages = (state: RootState) => state.order.totalPages;
export const selectTotalElements = (state: RootState) => state.order.totalElements;
export const selectCurrentPage = (state: RootState) => state.order.currentPage;
export const selectCurrentOrder = (state: RootState) => state.order.currentOrder;
export const selectOrderDetails = (state: RootState) => state.order.orderDetails;
export const selectOrderLoading = (state: RootState) => state.order.loading;
export const selectOrderError = (state: RootState) => state.order.error;
export const selectPaymentStatus = (state: RootState) => state.order.paymentStatus;
export const selectPaymentError = (state: RootState) => state.order.paymentError;

export default orderSlice.reducer;
