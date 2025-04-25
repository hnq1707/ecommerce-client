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
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { User } from '@/lib/types/User';
import { UpdateUserRequest } from '@/lib/redux/features/user/userSlice';

interface UserEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSave: (user: UpdateUserRequest) => void;
}

export function UserEditDialog({ open, onOpenChange, user, onSave }: UserEditDialogProps) {
  const [editedUser, setEditedUser] = useState<UpdateUserRequest>({
    imageUrl: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });

  useEffect(() => {
    if (user) {
      setEditedUser({
        imageUrl: user.imageUrl || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
      });
    }
  }, [user]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thông tin cá nhân</DialogTitle>
          <DialogDescription>Cập nhật thông tin cá nhân của bạn tại đây</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex justify-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src={editedUser.imageUrl} alt="Avatar" />
              <AvatarFallback>{user?.firstName?.[0]}{user?.lastName?.[0]}</AvatarFallback>
            </Avatar>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-firstName">Tên</Label>
            <Input
              id="edit-firstName"
              placeholder="Nhập tên của bạn"
              value={editedUser.firstName}
              onChange={(e) => setEditedUser({ ...editedUser, firstName: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-lastName">Họ</Label>
            <Input
              id="edit-lastName"
              placeholder="Nhập họ của bạn"
              value={editedUser.lastName}
              onChange={(e) => setEditedUser({ ...editedUser, lastName: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-phoneNumber">Số điện thoại</Label>
            <Input
              id="edit-phoneNumber"
              placeholder="Nhập số điện thoại"
              value={editedUser.phoneNumber}
              onChange={(e) => setEditedUser({ ...editedUser, phoneNumber: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              value={user?.email ?? ''}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">Email không thể thay đổi</p>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={() => onSave(editedUser)}>Lưu thay đổi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}