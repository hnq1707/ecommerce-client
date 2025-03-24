'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminNotificationPanel from './admin-notification-panel';
import { useNotifications } from '@/hooks/use-admin-notification';
import { useToast } from '@/components/ui/use-toast';

export default function AdminNotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { unreadCount, fetchNotifications } = useNotifications();
  const { toast } = useToast();

  

  // Cập nhật thông báo định kỳ
  useEffect(() => {
    // Cập nhật thông báo mỗi 30 giây
    const interval = setInterval(() => {
      fetchNotifications();
    }, 1500000);

    return () => clearInterval(interval);
  }, []);

  // Đóng panel khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const togglePanel = () => {
    // Cập nhật thông báo khi mở panel
    if (!isOpen) {
      fetchNotifications();
    }

    setIsOpen((prev) => !prev);

    // Hiển thị toast khi có thông báo chưa đọc và panel được mở
    if (!isOpen && unreadCount > 0) {
      toast({
        title: `${unreadCount} thông báo chưa đọc`,
        description: 'Nhấp vào thông báo để đánh dấu đã đọc',
      });
    }
  };

  

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={togglePanel}
        className="relative h-10 w-10 rounded-full"
        aria-label="Thông báo quản trị"
        aria-expanded={isOpen}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-destructive text-destructive-foreground text-xs font-medium"
            aria-label={`${unreadCount} thông báo chưa đọc`}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div
          ref={panelRef}
          className="absolute right-0 mt-2 w-80 sm:w-96 z-50 animate-in fade-in-50 zoom-in-95 duration-200"
        >
          <AdminNotificationPanel
            onClose={() => setIsOpen(false)}
          />
        </div>
      )}

    </div>
  );
}
