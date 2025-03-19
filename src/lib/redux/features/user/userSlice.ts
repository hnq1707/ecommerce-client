/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '@/lib/type/User';
import api from '@/lib/utils/api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
const API_BASE_URL = '/users';

export type UpdateUserRequest = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  imageUrl: string;
};

// Fetch all users
export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get(API_BASE_URL);
    return response.data.result;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Fetch user by ID
export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_BASE_URL}/${userId}`);
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Update user
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (
    { userId, userData }: { userId: string; userData: UpdateUserRequest },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.put(`${API_BASE_URL}/${userId}`, userData);
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Delete user
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      await api.delete(`${API_BASE_URL}/${userId}`);
      return userId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [] as User[],
    user: null as User | null,
    loading: false,
    error: null as string | null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch User By ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
export const { setUser, clearUser } = userSlice.actions;
