/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { Search, Edit, Trash2, MoreHorizontal, UsersIcon, Shield } from 'lucide-react';
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
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUsers } from '@/lib/redux/features/user/useUser';
import { User } from '@/lib/type/User';

const roles = [
  { value: 'ADMIN', label: 'Quản trị viên' },
  { value: 'MANAGER', label: 'Quản lý' },
  { value: 'STAFF', label: 'Nhân viên' },
  { value: 'USER', label: 'Khách hàng' },
];

export default function UsersPage() {
  // Sử dụng hook từ Redux để lấy danh sách người dùng và các action liên quan
  const { users, loading, fetchAllUsers, updateUserData, removeUser } = useUsers();

  // Các state cục bộ để xử lý tìm kiếm, lọc và dialog
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Gọi API lấy danh sách người dùng khi component mount
  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  // Lọc người dùng theo từ khóa tìm kiếm và bộ lọc vai trò
  const filteredUsers = users.filter((user: User) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      roleFilter && roleFilter !== 'all' ? user.roles.some((r) => r.name === roleFilter) : true;
    return matchesSearch && matchesRole;
  });

  // Xử lý cập nhật người dùng qua hook
  const handleUpdateUser = () => {
    if (!currentUser) return;
    updateUserData(currentUser.id, {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      phoneNumber: currentUser.phoneNumber,
      imageUrl: currentUser.imageUrl,
    });
    setIsEditDialogOpen(false);
  };

  // Xử lý xóa người dùng qua hook
  const handleDeleteUser = () => {
    if (!currentUser) return;
    removeUser(currentUser.id);
    setIsDeleteDialogOpen(false);
  };

  // Hiển thị badge cho vai trò người dùng, sử dụng trường name của Role
  const getRoleBadge = (roleName: string) => {
    switch (roleName) {
      case 'AMIN':
        return <Badge className="bg-purple-500">Quản trị viên</Badge>;
      case 'MANAGER':
        return <Badge className="bg-blue-500">Quản lý</Badge>;
      case 'STAFF':
        return <Badge className="bg-green-500">Nhân viên</Badge>;
      case 'USER':
        return <Badge className="bg-gray-500">Khách hàng</Badge>;
      default:
        return <Badge>{roleName}</Badge>;
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
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quản trị viên</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u: User) => u.roles.some((r) => r.name === 'ADMIN')).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tìm kiếm và lọc */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm người dùng..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Lọc theo vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả vai trò</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Danh sách người dùng */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Người dùng</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center h-24">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center h-24">
                  <UsersIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                  <p className="text-muted-foreground">Không tìm thấy người dùng nào</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={user.imageUrl}
                          alt={`${user.firstName} ${user.lastName}`}
                        />
                        <AvatarFallback>{user.firstName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.roles.length > 0 && getRoleBadge(user.roles[0].name)}</TableCell>
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
                            setCurrentUser(user);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            setCurrentUser(user);
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

      {/* Dialog chỉnh sửa người dùng */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
            <DialogDescription>Cập nhật thông tin người dùng</DialogDescription>
          </DialogHeader>
          {currentUser && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-firstName">Họ</Label>
                <Input
                  id="edit-firstName"
                  value={currentUser.firstName}
                  onChange={(e) => setCurrentUser({ ...currentUser, firstName: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-lastName">Tên</Label>
                <Input
                  id="edit-lastName"
                  value={currentUser.lastName}
                  onChange={(e) => setCurrentUser({ ...currentUser, lastName: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={currentUser.email}
                  onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Vai trò</Label>
                <Select
                  value={currentUser.roles.length > 0 ? currentUser.roles[0].name : ''}
                  onValueChange={(value) =>
                    setCurrentUser({
                      ...currentUser,
                      roles: [{ ...currentUser.roles[0], name: value }],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleUpdateUser}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa người dùng */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Xóa người dùng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
