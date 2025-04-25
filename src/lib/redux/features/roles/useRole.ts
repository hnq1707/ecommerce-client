import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/lib/redux/store'; // Điều chỉnh import cho phù hợp với cấu trúc project của bạn
import {
  createRole,
  fetchRoles,
  updateRole,
  deleteRole,
  assignRoleToUser,
  removeRoleFromUser,
} from '@/lib/redux/features/roles/roleSlice';
import { useCallback } from 'react';
import { Role } from '@/lib/types/Role';
import { AssignRoleRequest } from '@/lib/types/AssignRoleRequest';
import { RemoveRoleRequest } from '@/lib/types/RemoveRoleRequest';

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

  // Gán vai trò cho người dùng
  const assignRole = useCallback(
    async (request: AssignRoleRequest) => {
      await dispatch(assignRoleToUser(request));
    },
    [dispatch],
  );

  // Xóa vai trò khỏi người dùng
  const unassignRole = useCallback(
    async (request: RemoveRoleRequest) => {
      await dispatch(removeRoleFromUser(request));
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
    assignRole,
    unassignRole,
  };
};

export default useRoles;
