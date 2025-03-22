/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '@/lib/utils/api';
import { Role } from '@/lib/type/Role';

// Định nghĩa kiểu dữ liệu cho Permission

// Thunk: Tạo mới Role
export const createRole = createAsyncThunk(
  'roles/createRole',
  async (roleData: Role, { rejectWithValue }) => {
    try {
      const response = await api.post('/roles', roleData);
      return response.data.result as Role;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Thunk: Lấy danh sách Role
export const fetchRoles = createAsyncThunk('roles/fetchRoles', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/roles');
    return response.data.result as Role[];
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Thunk: Xóa Role theo name
export const deleteRole = createAsyncThunk(
  'roles/deleteRole',
  async (roleName: string, { rejectWithValue }) => {
    try {
      await api.delete(`/roles/${roleName}`);
      return roleName;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);
export const updateRole = createAsyncThunk(
  'roles/updateRole',
  async ({ roleName, roleData }: { roleName: string; roleData: Role }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/roles/${roleName}`, roleData);
      return response.data.result as Role;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Định nghĩa state cho roles slice
interface RolesState {
  roles: Role[];
  loading: boolean;
  error: string | null;
}

const initialState: RolesState = {
  roles: [],
  loading: false,
  error: null,
};

const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    // Thêm reducers khác nếu cần
  },
  extraReducers: (builder) => {
    builder
      // Create Role
      .addCase(createRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.loading = false;
        state.roles.push(action.payload);
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Roles
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Role
      .addCase(deleteRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = state.roles.filter((role) => role.name !== action.payload);
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.loading = false;
        // Cập nhật role trong mảng roles
        state.roles = state.roles.map((role) =>
          role.name === action.payload.name ? action.payload : role,
        );
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default rolesSlice.reducer;
