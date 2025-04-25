/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useUsers } from '@/lib/redux/features/user/useUser';
import { useRoles } from '@/lib/redux/features/roles/useRole';
import type { User } from '@/lib/types/User';
import { UserTable } from '@/components/users/user-table';
import { UserFilters } from '@/components/users/user-filters';
import { UserStats } from '@/components/users/user-stats';
import { UserEditDialog } from '@/components/users/user-edit-dialog';
import { UserDisableDialog } from '@/components/users/user-disable-dialog';
import { RoleManagementDialog } from '@/components/users/role-management-dialog';
import { UpdateUserRequest } from '@/lib/redux/features/user/userSlice';

const roleOptions = [
  { value: 'ADMIN', label: 'Quản trị viên' },
  { value: 'MANAGER', label: 'Quản lý' },
  { value: 'STAFF', label: 'Nhân viên' },
  { value: 'USER', label: 'Khách hàng' },
];

export default function UsersPage() {
  // Sử dụng các hook Redux
  const { users, loading, fetchAllUsers, updateUserData, toggleUserStatus } = useUsers();
  const { roles, loadRoles, assignRole, unassignRole } = useRoles();
  const { toast } = useToast();

  // Các state cục bộ để xử lý tìm kiếm, lọc và dialog
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDisableDialogOpen, setIsDisableDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Gọi API lấy danh sách người dùng và vai trò khi component mount
  useEffect(() => {
    fetchAllUsers();
    loadRoles();
  }, []);

  // Cập nhật currentUser khi users thay đổi
  useEffect(() => {
    if (currentUser) {
      const updatedUser = users.find((user) => user.id === currentUser.id);
      if (updatedUser) {
        setCurrentUser(updatedUser);
      }
    }
  }, [users, currentUser]);
  console.log('users', users);
  // Lọc người dùng theo từ khóa tìm kiếm và bộ lọc vai trò
  const filteredUsers = users.filter((user: User) => {
    const matchesSearch = (
      (user.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
    const matchesRole = roleFilter ? user.roles.some((r) => r.name === roleFilter) : true;
    return matchesSearch && matchesRole;
  });

  // Xử lý cập nhật người dùng
  const handleUpdateUser = async (user: UpdateUserRequest) => {
      try {
        if (!currentUser) return;
        updateUserData(currentUser.id, {
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          imageUrl: currentUser.imageUrl ?? '',
        });

      toast({
        title: 'Cập nhật thành công',
        description: 'Thông tin người dùng đã được cập nhật',
      });
      fetchAllUsers();
      setIsEditDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật thông tin người dùng',
        variant: 'destructive',
      });
    }
  };

  // Xử lý thêm vai trò cho người dùng
  const handleAddRole = async (userId: string, roleName: string) => {
    if (!currentUser) return;

    try {
      await assignRole({ userId, roleName });

      // Cập nhật currentUser trực tiếp
      const roleToAdd = { name: roleName, description: '', permissions: [] }; // Add missing properties
      const updatedRoles = [...currentUser.roles, roleToAdd];
      setCurrentUser({ ...currentUser, roles: updatedRoles });

      // Fetch lại danh sách users để cập nhật UI
       fetchAllUsers();

      toast({
        title: 'Thêm vai trò thành công',
        description: `Đã thêm vai trò ${roleName} cho người dùng`,
      });
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể thêm vai trò cho người dùng',
        variant: 'destructive',
      });
    }
  };

  // Xử lý xóa vai trò của người dùng
  const handleRemoveRole = async (userId: string, roleName: string) => {
    if (!currentUser) return;

    try {
      await unassignRole({ userId, roleName });

      // Cập nhật currentUser trực tiếp
      const updatedRoles = currentUser.roles.filter((role) => role.name !== roleName);
      setCurrentUser({ ...currentUser, roles: updatedRoles });

      // Fetch lại danh sách users để cập nhật UI
      fetchAllUsers();

      toast({
        title: 'Xóa vai trò thành công',
        description: `Đã xóa vai trò ${roleName} của người dùng`,
      });
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa vai trò của người dùng',
        variant: 'destructive',
      });
    }
  };

  // Xử lý vô hiệu hóa/kích hoạt người dùng
  const handleToggleUserStatus = async () => {
    if (!currentUser) return;

    try {
      toggleUserStatus(currentUser.id);

      // Cập nhật currentUser trực tiếp
      setCurrentUser({ ...currentUser, enabled: !currentUser.enabled });

      // Fetch lại danh sách users để cập nhật UI
      fetchAllUsers();

      toast({
        title: !currentUser.enabled ? 'Kích hoạt thành công' : 'Vô hiệu hóa thành công',
        description: `Người dùng đã được ${!currentUser.enabled ? 'kích hoạt' : 'vô hiệu hóa'}`,
      });

      setIsDisableDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể thay đổi trạng thái người dùng',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý người dùng</h1>
          <p className="text-muted-foreground">Quản lý tài khoản người dùng trong hệ thống</p>
        </div>
      </div>

      {/* Thống kê */}
      <UserStats users={users} />

      {/* Tìm kiếm và lọc */}
      <UserFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        roles={roleOptions}
      />

      {/* Danh sách người dùng */}
      <UserTable
        users={filteredUsers}
        loading={loading}
        onEdit={(user) => {
          setCurrentUser(user);
          setIsEditDialogOpen(true);
        }}
        onDisable={(user) => {
          setCurrentUser(user);
          setIsDisableDialogOpen(true);
        }}
        onManageRoles={(user) => {
          setCurrentUser(user);
          setIsRoleDialogOpen(true);
        }}
      />

      {/* Dialog chỉnh sửa người dùng */}
      <UserEditDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        user={currentUser}
        onSave={handleUpdateUser}
      />

      {/* Dialog vô hiệu hóa người dùng */}
      <UserDisableDialog
        open={isDisableDialogOpen}
        onOpenChange={setIsDisableDialogOpen}
        user={currentUser}
        onConfirm={handleToggleUserStatus}
      />

      {/* Dialog quản lý vai trò */}
      <RoleManagementDialog
        open={isRoleDialogOpen}
        onOpenChange={setIsRoleDialogOpen}
        user={currentUser}
        roles={roleOptions}
        onAddRole={handleAddRole}
        onRemoveRole={handleRemoveRole}
      />
    </div>
  );
}
