import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/lib/redux/store'; // Điều chỉnh import cho phù hợp với cấu trúc project của bạn
import {
  createRole,
  fetchRoles,
  updateRole,
  deleteRole,
 
} from '@/lib/redux/features/roles/roleSlice';
import { useCallback } from 'react';
import { Role } from '@/lib/type/Role';

export const useRoles = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { roles, loading, error } = useSelector((state: RootState) => state.role);

  // Thêm Role mới
  const addRole = useCallback(
    async (roleData: Role) => {
      await dispatch(createRole(roleData));
    },
    [dispatch],
  );

  // Lấy danh sách Roles
  const loadRoles = useCallback(async () => {
    await dispatch(fetchRoles());
  }, [dispatch]);

  // Cập nhật Role
  const modifyRole = useCallback(
    async (roleName: string, roleData: Role) => {
      await dispatch(updateRole({ roleName, roleData }));
    },
    [dispatch],
  );

  // Xóa Role theo name
  const removeRole = useCallback(
    async (roleName: string) => {
      await dispatch(deleteRole(roleName));
    },
    [dispatch],
  );

  return {
    roles,
    loading,
    error,
    addRole,
    loadRoles,
    modifyRole,
    removeRole,
  };
};

export default useRoles;
