'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { User } from '@/lib/type/User';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface UserDisableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onConfirm: () => void;
}

export function UserDisableDialog({ open, onOpenChange, user, onConfirm }: UserDisableDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            {!user.enabled ? 'Kích hoạt người dùng' : 'Vô hiệu hóa người dùng'}
          </DialogTitle>
          <DialogDescription>
            {!user.enabled
              ? 'Bạn có chắc chắn muốn kích hoạt lại người dùng này? Người dùng sẽ có thể đăng nhập vào hệ thống.'
              : 'Người dùng sẽ không thể đăng nhập vào hệ thống sau khi bị vô hiệu hóa.'}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="font-medium">
            {user.firstName} {user.lastName} ({user.email})
          </p>
          <div className="mt-2 flex items-center">
            <span className="mr-2">Trạng thái hiện tại:</span>
            {user.enabled ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                Đang hoạt động
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <XCircle className="h-4 w-4 mr-1" />
                Đã vô hiệu hóa
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button variant={!user.enabled ? 'default' : 'destructive'} onClick={onConfirm}>
            {!user.enabled ? 'Kích hoạt' : 'Vô hiệu hóa'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
