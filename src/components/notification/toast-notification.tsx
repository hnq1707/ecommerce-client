'use client';

import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useNotifications } from '@/hooks/use-notification'; // Giả sử hook này trả về notifications từ backend
import type { Notification as AppNotification } from '@/lib/types/Notification';

interface ToastNotificationProps {
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export default function ToastNotification({
  autoClose = true,
  autoCloseDelay = 5000,
}: ToastNotificationProps) {
  const { toast } = useToast();
  const { notifications } = useNotifications();

  useEffect(() => {
    const displayedNotifications = new Set<string>();
    const checkNewNotifications = () => {
      const newNotifications = notifications.filter(
        (notification) => !notification.read && !displayedNotifications.has(notification.id),
      );
      if (newNotifications.length > 0) {
        const latestNotification = newNotifications[0];
        showNotificationToast(latestNotification);
        displayedNotifications.add(latestNotification.id);
      }
    };
    checkNewNotifications();
  }, [notifications, toast]);

  const showNotificationToast = (notification: AppNotification) => {
    toast({
      title: notification.title,
      description: notification.message,
      duration: autoClose ? autoCloseDelay : Number.POSITIVE_INFINITY,
    });
  };

  return null;
}
