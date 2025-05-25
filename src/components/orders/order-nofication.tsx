'use client';

import { useEffect } from 'react';
import { useNotifications } from '@/hooks/use-notification';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function OrderNotifications() {
  const {
    notifications,
    unreadCount,
    isLoading,
    markAllAsRead,
    requestNotificationPermission,
  } = useNotifications();

  // Xin phép Notification API ngay khi component mount
  useEffect(() => {
    void requestNotificationPermission();
  }, [requestNotificationPermission]);

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (!open && unreadCount > 0) {
          // Khi menu đóng, đánh dấu tất cả đã đọc
          void markAllAsRead();
        }
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <div className="p-2 font-medium">Notifications</div>

        {isLoading ? (
          <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
        ) : notifications.length === 0 ? (
          <DropdownMenuItem disabled>No notifications</DropdownMenuItem>
        ) : (
          notifications.slice(0, 10).map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="cursor-pointer flex flex-col items-start"
            >
              <div className="font-medium">{notification.message}</div>
              <div className="text-xs text-gray-500">
                {new Date(notification.updatedAt).toLocaleString()}
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
