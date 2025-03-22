/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, MoreHorizontal, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useRoles } from '@/lib/redux/features/roles/useRole'; // Đảm bảo đường dẫn import chính xác
import { Textarea } from '@/components/ui/textarea';
import { Permission } from '@/lib/type/Permission';
import { Role } from '@/lib/type/Role';

// Dữ liệu mẫu của tất cả các quyền (sử dụng name thay vì id)
const allPermissions = [
  { name: 'dashboard_access', description: 'Truy cập Dashboard', group: 'Dashboard' },

  { name: 'categories_view', description: 'Xem danh mục', group: 'Danh mục' },
  { name: 'categories_create', description: 'Thêm danh mục', group: 'Danh mục' },
  { name: 'categories_edit', description: 'Sửa danh mục', group: 'Danh mục' },
  { name: 'categories_delete', description: 'Xóa danh mục', group: 'Danh mục' },

  { name: 'products_view', description: 'Xem sản phẩm', group: 'Sản phẩm' },
  { name: 'products_create', description: 'Thêm sản phẩm', group: 'Sản phẩm' },
  { name: 'products_edit', description: 'Sửa sản phẩm', group: 'Sản phẩm' },
  { name: 'products_delete', description: 'Xóa sản phẩm', group: 'Sản phẩm' },

  { name: 'orders_view', description: 'Xem đơn hàng', group: 'Đơn hàng' },
  { name: 'orders_edit', description: 'Xử lý đơn hàng', group: 'Đơn hàng' },
  { name: 'orders_export', description: 'Xuất hóa đơn', group: 'Đơn hàng' },

  { name: 'users_view', description: 'Xem người dùng', group: 'Người dùng' },
  { name: 'users_create', description: 'Thêm người dùng', group: 'Người dùng' },
  { name: 'users_edit', description: 'Sửa người dùng', group: 'Người dùng' },
  { name: 'users_delete', description: 'Xóa người dùng', group: 'Người dùng' },

  { name: 'roles_view', description: 'Xem vai trò', group: 'Phân quyền' },
  { name: 'roles_create', description: 'Thêm vai trò', group: 'Phân quyền' },
  { name: 'roles_edit', description: 'Sửa vai trò', group: 'Phân quyền' },
  { name: 'roles_delete', description: 'Xóa vai trò', group: 'Phân quyền' },
];

// Nhóm các quyền theo group
const permissionGroups = allPermissions.reduce((groups: Record<string, any[]>, permission) => {
  if (!groups[permission.group]) {
    groups[permission.group] = [];
  }
  groups[permission.group].push(permission);
  return groups;
}, {});

export default function RolesPage() {
  // Sử dụng custom hook để lấy dữ liệu từ Redux store
  const { roles, loading, error, addRole, loadRoles, modifyRole, removeRole } = useRoles();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Trạng thái cho role mới (dùng cho Dialog thêm mới)
  const [newRole, setNewRole] = useState<Role>({
    name: '',
    description: '',
    permissions: [],
  });

  // Trạng thái cho role hiện tại (sử dụng cho Dialog chỉnh sửa/xóa)
  const [currentRole, setCurrentRole] = useState<Role | null>(null);

  // Tải danh sách vai trò khi component mount
  useEffect(() => {
    loadRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lọc vai trò theo từ khóa tìm kiếm
  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Xử lý thêm vai trò mới
  const handleAddRole = async () => {
    await addRole(newRole);
    setNewRole({ name: '', description: '', permissions: [] });
    setIsAddDialogOpen(false);
  };

  // Xử lý cập nhật vai trò
  const handleUpdateRole = async () => {
    if (!currentRole) return;
    await modifyRole(currentRole.name, currentRole);
    setIsEditDialogOpen(false);
  };

  // Xử lý xóa vai trò
  const handleDeleteRole = async () => {
    if (!currentRole) return;
    await removeRole(currentRole.name);
    setIsDeleteDialogOpen(false);
  };

  // Hàm xử lý chọn/bỏ chọn quyền theo name
  const handlePermissionChange = (permissionName: string, isChecked: boolean, isNew = false) => {
    if (isNew) {
      setNewRole((prev) => ({
        ...prev,
        permissions: isChecked
          ? [...prev.permissions, allPermissions.find((p) => p.name === permissionName)!]
          : prev.permissions.filter((p) => p.name !== permissionName),
      }));
    } else {
      if (!currentRole) return;
      setCurrentRole((prev) =>
        prev
          ? {
              ...prev,
              permissions: isChecked
                ? [...prev.permissions, allPermissions.find((p) => p.name === permissionName)!]
                : prev.permissions.filter((p) => p.name !== permissionName),
            }
          : null,
      );
    }
  };

  // Hàm xử lý chọn/bỏ chọn tất cả quyền trong một nhóm
  const handleGroupPermissionChange = (
    groupPermissions: any[],
    isChecked: boolean,
    isNew = false,
  ) => {
    const permissionsToToggle = groupPermissions.map((p) => p.name);
    if (isNew) {
      setNewRole((prev) => ({
        ...prev,
        permissions: isChecked
          ? Array.from(
              new Set([...prev.permissions.map((p) => p.name), ...permissionsToToggle]),
            ).map((name) => allPermissions.find((p) => p.name === name)!)
          : prev.permissions.filter((p) => !permissionsToToggle.includes(p.name)),
      }));
    } else {
      if (!currentRole) return;
      setCurrentRole((prev) =>
        prev
          ? {
              ...prev,
              permissions: isChecked
                ? Array.from(
                    new Set([...prev.permissions.map((p) => p.name), ...permissionsToToggle]),
                  ).map((name) => allPermissions.find((p) => p.name === name)!)
                : prev.permissions.filter((p) => !permissionsToToggle.includes(p.name)),
            }
          : null,
      );
    }
  };

  // Kiểm tra xem tất cả quyền trong nhóm có được chọn không
  const isGroupChecked = (groupPermissions: any[], rolePermissions: Permission[]) => {
    return groupPermissions.every((p) => rolePermissions.some((rp) => rp.name === p.name));
  };

  // Kiểm tra xem có ít nhất một quyền trong nhóm được chọn không
  const isGroupIndeterminate = (groupPermissions: any[], rolePermissions: Permission[]) => {
    const checkedCount = groupPermissions.filter((p) =>
      rolePermissions.some((rp) => rp.name === p.name),
    ).length;
    return checkedCount > 0 && checkedCount < groupPermissions.length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý phân quyền</h1>
          <p className="text-muted-foreground">Quản lý vai trò và quyền hạn trong hệ thống</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm vai trò
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Thêm vai trò mới</DialogTitle>
              <DialogDescription>Tạo vai trò mới và cấu hình quyền hạn</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Tên vai trò</Label>
                <Input
                  id="name"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  placeholder="Nhập tên vai trò"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                  placeholder="Mô tả vai trò này"
                  className="min-h-[80px]"
                />
              </div>
              <div className="grid gap-2">
                <Label>Quyền hạn</Label>
                <div className="border rounded-md p-4 space-y-4">
                  {Object.entries(permissionGroups).map(
                    ([groupName, permissions]: [string, any]) => (
                      <div key={groupName} className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`group-${groupName}`}
                            checked={isGroupChecked(permissions, newRole.permissions)}
                            onCheckedChange={(checked) =>
                              handleGroupPermissionChange(permissions, checked as boolean, true)
                            }
                            className="data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground"
                            data-state={
                              isGroupIndeterminate(permissions, newRole.permissions)
                                ? 'indeterminate'
                                : undefined
                            }
                          />
                          <Label htmlFor={`group-${groupName}`} className="font-semibold">
                            {groupName}
                          </Label>
                        </div>
                        <div className="ml-6 grid grid-cols-2 gap-2">
                          {permissions.map((permission: any) => (
                            <div key={permission.name} className="flex items-center space-x-2">
                              <Checkbox
                                id={`new-${permission.name}`}
                                checked={newRole.permissions.some(
                                  (p) => p.name === permission.name,
                                )}
                                onCheckedChange={(checked) =>
                                  handlePermissionChange(permission.name, checked as boolean, true)
                                }
                              />
                              <Label htmlFor={`new-${permission.name}`}>
                                {permission.description}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleAddRole}>Thêm vai trò</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm vai trò..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên vai trò</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead className="text-center">Số quyền</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  <div className="flex flex-col items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Đang tải vai trò...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredRoles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  <ShieldCheck className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                  <p className="text-muted-foreground">Không tìm thấy vai trò nào</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredRoles.map((role) => (
                <TableRow key={role.name}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell className="text-center">{role.permissions.length}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setCurrentRole(role);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            setCurrentRole(role);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog chỉnh sửa vai trò */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa vai trò</DialogTitle>
            <DialogDescription>Cập nhật thông tin và quyền hạn của vai trò</DialogDescription>
          </DialogHeader>
          {currentRole && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Tên vai trò</Label>
                <Input
                  id="edit-name"
                  value={currentRole.name}
                  onChange={(e) => setCurrentRole({ ...currentRole, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Mô tả</Label>
                <Textarea
                  id="edit-description"
                  value={currentRole.description}
                  onChange={(e) => setCurrentRole({ ...currentRole, description: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>
              <div className="grid gap-2">
                <Label>Quyền hạn</Label>
                <div className="border rounded-md p-4 space-y-4">
                  {Object.entries(permissionGroups).map(
                    ([groupName, permissions]: [string, any]) => (
                      <div key={groupName} className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`edit-group-${groupName}`}
                            checked={isGroupChecked(permissions, currentRole.permissions)}
                            onCheckedChange={(checked) =>
                              handleGroupPermissionChange(permissions, checked as boolean)
                            }
                            className="data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground"
                            data-state={
                              isGroupIndeterminate(permissions, currentRole.permissions)
                                ? 'indeterminate'
                                : undefined
                            }
                          />
                          <Label htmlFor={`edit-group-${groupName}`} className="font-semibold">
                            {groupName}
                          </Label>
                        </div>
                        <div className="ml-6 grid grid-cols-2 gap-2">
                          {permissions.map((permission: any) => (
                            <div key={permission.name} className="flex items-center space-x-2">
                              <Checkbox
                                id={`edit-${permission.name}`}
                                checked={currentRole.permissions.some(
                                  (p) => p.name === permission.name,
                                )}
                                onCheckedChange={(checked) =>
                                  handlePermissionChange(permission.name, checked as boolean)
                                }
                              />
                              <Label htmlFor={`edit-${permission.name}`}>
                                {permission.description}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleUpdateRole}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa vai trò */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa vai trò này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteRole}>
              Xóa vai trò
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
