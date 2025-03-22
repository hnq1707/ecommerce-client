'use client';

import { useEffect, useState } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import type { Notification } from '@/lib/websocket-service';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function OrderNotifications() {
  const { connected, subscribe } = useWebSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (connected) {
      // Subscribe to order status changes
      const unsubscribe = subscribe('ORDER_STATUS_CHANGED', (notification) => {
        setNotifications((prev) => [notification, ...prev].slice(0, 10));
        setUnreadCount((prev) => prev + 1);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [connected, subscribe]);

  const markAsRead = () => {
    setUnreadCount(0);
  };

  return (
    <DropdownMenu>
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
      <DropdownMenuContent align="end" className="w-80" onClick={markAsRead}>
        <div className="p-2 font-medium">Notifications</div>
        {notifications.length === 0 ? (
          <DropdownMenuItem disabled>No notifications</DropdownMenuItem>
        ) : (
          notifications.map((notification, index) => (
            <DropdownMenuItem key={index} className="cursor-pointer flex flex-col items-start">
              <div className="font-medium">{notification.message}</div>
              <div className="text-xs text-gray-500">
                {new Date(notification.timestamp).toLocaleString()}
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
