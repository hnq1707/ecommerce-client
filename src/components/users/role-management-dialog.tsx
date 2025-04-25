'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import type { User } from '@/lib/types/User';
import { Badge } from '@/components/ui/badge';
import { X, Plus, RefreshCw } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface RoleManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  roles: { value: string; label: string }[];
  onAddRole: (userId: string, roleName: string) => void;
  onRemoveRole: (userId: string, roleName: string) => void;
}

export function RoleManagementDialog({
  open,
  onOpenChange,
  user,
  roles,
  onAddRole,
  onRemoveRole,
}: RoleManagementDialogProps) {
  const [selectedRole, setSelectedRole] = useState('');
  const [availableRoles, setAvailableRoles] = useState<{ value: string; label: string }[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user && roles) {
      // Lọc ra các vai trò chưa được gán cho người dùng
      const userRoleNames = user.roles.map((r) => r.name);
      setAvailableRoles(roles.filter((r) => !userRoleNames.includes(r.value)));
    }
  }, [user, roles, open]);

  if (!user) return null;

  const handleAddRole = async () => {
    if (selectedRole) {
      setIsUpdating(true);
      try {
        await onAddRole(user.id, selectedRole);
        setSelectedRole('');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleRemoveRole = async (roleName: string) => {
    setIsUpdating(true);
    try {
      await onRemoveRole(user.id, roleName);
    } finally {
      setIsUpdating(false);
    }
  };

  const getRoleBadgeColor = (roleName: string) => {
    switch (roleName) {
      case 'ADMIN':
        return 'bg-purple-500';
      case 'MANAGER':
        return 'bg-blue-500';
      case 'STAFF':
        return 'bg-green-500';
      case 'USER':
        return 'bg-gray-500';
      default:
        return '';
    }
  };

  const getRoleLabel = (roleName: string) => {
    const role = roles.find((r) => r.value === roleName);
    return role ? role.label : roleName;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quản lý vai trò</DialogTitle>
          <DialogDescription>
            Thêm hoặc xóa vai trò cho người dùng {user.firstName} {user.lastName}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label className="mb-2 block">Vai trò hiện tại</Label>
            {isUpdating ? (
              <div className="flex items-center justify-center py-4">
                <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                <span>Đang cập nhật...</span>
              </div>
            ) : user.roles.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.roles.map((role, index) => (
                  <Badge
                    key={index}
                    className={`${getRoleBadgeColor(role.name)} flex items-center gap-1`}
                  >
                    {getRoleLabel(role.name)}
                    <button
                      onClick={() => handleRemoveRole(role.name)}
                      className="ml-1 rounded-full hover:bg-white/20 p-0.5"
                      aria-label={`Xóa vai trò ${role.name}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Người dùng chưa có vai trò nào</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="add-role">Thêm vai trò mới</Label>
            <div className="flex gap-2">
              <Select value={selectedRole} onValueChange={setSelectedRole} disabled={isUpdating}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.length > 0 ? (
                    availableRoles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      Không có vai trò khả dụng
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <Button
                onClick={handleAddRole}
                disabled={!selectedRole || isUpdating}
                size="icon"
                aria-label="Thêm vai trò"
              >
                {isUpdating ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
