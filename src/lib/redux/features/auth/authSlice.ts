/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/lib/utils/api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  AuthenticateRequest,
  AuthResponse,
  AuthState,
  CheckUserResponse,
  LogoutRequest,
  OAuthRegistrationRequest,
  RegisterRequest,
  RegisterResponse,
  RenewVerificationRequest,
  VerifyRequest,

} from './authTypes';

const API_URL = '/api/auth';

// Định nghĩa các kiểu dữ liệu cho request và response

const initialState: AuthState = {
  user: null,
  token: null,
  authenticated: false,
  verify: false,
  loading: false,
  error: null,
};

// Định nghĩa các async thunks với kiểu dữ liệu chính xác
export const registerUser = createAsyncThunk<RegisterResponse, RegisterRequest>(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post<RegisterResponse>(`${API_URL}/register`, userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const authenticateUser = createAsyncThunk<AuthResponse, AuthenticateRequest>(
  'auth/authenticate',
  async (authData, { rejectWithValue }) => {
    try {
      const response = await api.post<AuthResponse>(`${API_URL}/token`, authData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const logoutUser = createAsyncThunk<void, LogoutRequest>(
  'auth/logout',
  async (requestData, { rejectWithValue }) => {
    try {
      await api.post(`${API_URL}/logout`, requestData);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

// Xác minh mã (Verify Code)
export const verifyCode = createAsyncThunk<void, VerifyRequest>(
  'auth/verifyCode',
  async (verifyData, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/verify`, verifyData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

// Kiểm tra người dùng (Check User)
export const checkUser = createAsyncThunk<CheckUserResponse, OAuthRegistrationRequest>(
  'auth/checkUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post<CheckUserResponse>(`${API_URL}/check-user`, userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

// Gửi lại mã xác minh (Renew Verification Code)
export const renewVerificationCode = createAsyncThunk<void, RenewVerificationRequest>(
  'auth/renewVerificationCode',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post<void>(`${API_URL}/renew`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

// Tạo slice cho auth
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.result;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(authenticateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.result.accessToken;
        state.authenticated = action.payload.result.authenticated;
        state.user = {
          id: action.payload.result.id,
          firstName: '',
          lastName: '',
          imageUrl: '',
          phoneNumber: '',
          email: action.payload.result.email,
          roles: [],
          addressList: [],
        };
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.authenticated = false;
      })
      .addCase(verifyCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyCode.fulfilled, (state) => {
        state.loading = false;
        state.verify = true;
      })
      .addCase(verifyCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(checkUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.result;
      })
      .addCase(checkUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(renewVerificationCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(renewVerificationCode.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(renewVerificationCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default authSlice.reducer;
