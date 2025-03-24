/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Notification } from '@/lib/type/Notification';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';

// Tạo một instance duy nhất cho WebSocket
let stompClient: any = null;
let stompConnected = false;
let pendingSubscriptions: Array<() => void> = [];

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Khởi tạo WebSocket khi component mount và session sẵn sàng
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      initializeWebSocket();

      // Tải thông báo ban đầu
      fetchNotifications();

      // Thiết lập polling để cập nhật thông báo định kỳ
      startPolling();

      return () => {
        // Dọn dẹp khi component unmount
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
      };
    }
  }, [status, session]);

  // Khởi tạo kết nối WebSocket
  const initializeWebSocket = useCallback(() => {
    if (!session?.user?.id) return;

    try {
      // Nếu đã có kết nối WebSocket, không cần khởi tạo lại
      if (stompConnected) {
        subscribeToNotifications();
        return;
      }

      // Khởi tạo WebSocket nếu chưa có
      import('@stomp/stompjs').then(({ Client }) => {
        import('sockjs-client').then((SockJS) => {
          const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8080/ws';

          stompClient = new Client({
            webSocketFactory: () => new SockJS.default(WS_URL),
            debug: (str) => {
              console.log(str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
          });

          stompClient.onConnect = () => {
            console.log('Đã kết nối WebSocket');
            stompConnected = true;

            // Đăng ký nhận thông báo
            subscribeToNotifications();

            // Thực hiện các đăng ký đang chờ
            pendingSubscriptions.forEach((subscribe) => subscribe());
            pendingSubscriptions = [];
          };

          stompClient.onStompError = (frame: any) => {
            console.error('Lỗi STOMP', frame);
            stompConnected = false;
            setError(new Error(`Lỗi kết nối WebSocket: ${frame.headers.message}`));

            toast({
              title: 'Lỗi kết nối',
              description: 'Không thể kết nối đến máy chủ thông báo. Vui lòng thử lại sau.',
              variant: 'destructive',
            });
          };

          stompClient.activate();
        });
      });
    } catch (err) {
      console.error('Lỗi khởi tạo WebSocket:', err);
    }
  }, [session, toast]);

  // Đăng ký nhận thông báo qua WebSocket
  const subscribeToNotifications = useCallback(() => {
    if (!session?.user?.id) return;

    const subscribeFunction = () => {
      if (!stompClient || !stompConnected) {
        pendingSubscriptions.push(subscribeFunction);
        return;
      }

      // Đăng ký nhận thông báo cá nhân
      stompClient.subscribe(`/user/queue/notifications`, (message: any) => {
        try {
          const newNotification = JSON.parse(message.body) as Notification;
          handleNewNotification(newNotification);
        } catch (err) {
          console.error('Lỗi xử lý thông báo:', err);
        }
      });

      // Đăng ký nhận thông báo broadcast
      stompClient.subscribe('/topic/notifications', (message: any) => {
        try {
          const newNotification = JSON.parse(message.body) as Notification;
          handleNewNotification(newNotification);
        } catch (err) {
          console.error('Lỗi xử lý thông báo broadcast:', err);
        }
      });
    };

    subscribeFunction();
  }, [session]);

  // Xử lý thông báo mới
  const handleNewNotification = useCallback(
    (newNotification: Notification) => {
      setNotifications((prev) => {
        // Kiểm tra xem thông báo đã tồn tại chưa
        const exists = prev.some((n) => n.id === newNotification.id);
        if (exists) return prev;
        return [newNotification, ...prev];
      });

      if (!newNotification.read) {
        setUnreadCount((count) => count + 1);

        // Hiển thị thông báo trình duyệt nếu được hỗ trợ
        if (window.Notification && Notification.permission === 'granted') {
          new Notification(newNotification.title, {
            body: newNotification.message,
            icon: '/notification-icon.png',
          });
        }

        // Hiển thị toast khi có thông báo mới
        toast({
          title: newNotification.title,
          description: newNotification.message,
          variant: 'default'
        });
      }
    },
    [toast],
  );

  // Thiết lập polling để cập nhật thông báo định kỳ
  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    // Cập nhật thông báo mỗi 30 giây
    pollingIntervalRef.current = setInterval(() => {
      fetchNotifications();
    }, 30000);
  }, []);

  // Tải thông báo từ API
  const fetchNotifications = useCallback(async () => {
    if (status !== 'authenticated' || !session?.user?.id) return;

    setIsLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
      const response = await fetch(`${API_URL}/api/notifications/user/${session.user.id}`);

      if (!response.ok) throw new Error('Không thể tải thông báo');

      const data = await response.json();

      // Xử lý dữ liệu dựa trên cấu trúc trả về
      if (Array.isArray(data)) {
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.read).length);
      } else if (data.content && Array.isArray(data.content)) {
        setNotifications(data.content);
        setUnreadCount(data.content.filter((n: Notification) => !n.read).length);
      } else if (data.notifications && Array.isArray(data.notifications)) {
        setNotifications(data.notifications);
        setUnreadCount(data.notifications.filter((n: Notification) => !n.read).length);
      } else {
        console.error('Cấu trúc dữ liệu không đúng định dạng:', data);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Lỗi không xác định'));
      console.error('Lỗi khi tải thông báo:', err);

      toast({
        title: 'Lỗi tải thông báo',
        description: 'Không thể tải thông báo. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [session, status, toast]);

  // Đánh dấu thông báo là đã đọc
  const markAsRead = useCallback(
    async (notificationId: string) => {
      if (!session?.user?.id) return;

      try {
        const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
        const response = await fetch(`${API_URL}/api/notifications/${notificationId}/read`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Không thể đánh dấu thông báo là đã đọc');

        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId ? { ...notification, read: true } : notification,
          ),
        );

        setUnreadCount((count) => Math.max(0, count - 1));

        toast({
          title: 'Đã đánh dấu đã đọc',
          description: 'Thông báo đã được đánh dấu là đã đọc',
        });
      } catch (err) {
        console.error('Lỗi khi đánh dấu thông báo là đã đọc:', err);

        toast({
          title: 'Lỗi',
          description: 'Không thể đánh dấu thông báo là đã đọc. Vui lòng thử lại sau.',
          variant: 'destructive',
        });
      }
    },
    [session, toast],
  );

  // Đánh dấu tất cả thông báo là đã đọc
  const markAllAsRead = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
      const response = await fetch(
        `${API_URL}/api/notifications/user/${session.user.id}/read-all`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) throw new Error('Không thể đánh dấu tất cả thông báo là đã đọc');

      setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));

      setUnreadCount(0);

      toast({
        title: 'Đã đánh dấu tất cả đã đọc',
        description: 'Tất cả thông báo đã được đánh dấu là đã đọc',
      });
    } catch (err) {
      console.error('Lỗi khi đánh dấu tất cả thông báo là đã đọc:', err);

      toast({
        title: 'Lỗi',
        description: 'Không thể đánh dấu tất cả thông báo là đã đọc. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    }
  }, [session, toast]);

  // Xóa thông báo
  const deleteNotification = useCallback(
    async (notificationId: string) => {
      if (!session?.user?.id) return;

      try {
        const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
        const response = await fetch(`${API_URL}/api/notifications/${notificationId}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Không thể xóa thông báo');

        // Cập nhật UI để xóa thông báo
        setNotifications((prev) =>
          prev.filter((notification) => notification.id !== notificationId),
        );

        // Cập nhật số lượng chưa đọc nếu cần
        const wasUnread = notifications.find((n) => n.id === notificationId)?.read === false;
        if (wasUnread) {
          setUnreadCount((count) => Math.max(0, count - 1));
        }

        toast({
          title: 'Đã xóa thông báo',
          description: 'Thông báo đã được xóa thành công',
        });
      } catch (err) {
        console.error('Lỗi khi xóa thông báo:', err);

        toast({
          title: 'Lỗi',
          description: 'Không thể xóa thông báo. Vui lòng thử lại sau.',
          variant: 'destructive',
        });
      }
    },
    [notifications, session, toast],
  );

  // Xóa tất cả thông báo
  const clearAllNotifications = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
      const response = await fetch(`${API_URL}/api/notifications/user/${session.user.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Không thể xóa tất cả thông báo');

      setNotifications([]);
      setUnreadCount(0);

      toast({
        title: 'Đã xóa tất cả thông báo',
        description: 'Tất cả thông báo đã được xóa thành công',
      });
    } catch (err) {
      console.error('Lỗi khi xóa tất cả thông báo:', err);

      toast({
        title: 'Lỗi',
        description: 'Không thể xóa tất cả thông báo. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    }
  }, [session, toast]);

  // Lưu trữ thông báo
  const archiveNotification = useCallback(
    async (notificationId: string) => {
      if (!session?.user?.id) return;

      try {
        const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
        const response = await fetch(`${API_URL}/api/notifications/${notificationId}/archive`, {
          method: 'POST',
        });

        if (!response.ok) throw new Error('Không thể lưu trữ thông báo');

        // Cập nhật UI để đánh dấu thông báo là đã lưu trữ
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId ? { ...notification, archived: true } : notification,
          ),
        );

        toast({
          title: 'Đã lưu trữ thông báo',
          description: 'Thông báo đã được chuyển vào mục lưu trữ',
        });
      } catch (err) {
        console.error('Lỗi khi lưu trữ thông báo:', err);

        toast({
          title: 'Lỗi',
          description: 'Không thể lưu trữ thông báo. Vui lòng thử lại sau.',
          variant: 'destructive',
        });
      }
    },
    [session, toast],
  );

  // Lưu trữ tất cả thông báo đã đọc
  const archiveAllReadNotifications = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
      const response = await fetch(
        `${API_URL}/api/notifications/user/${session.user.id}/archive-all-read`,
        {
          method: 'POST',
        },
      );

      if (!response.ok) throw new Error('Không thể lưu trữ tất cả thông báo đã đọc');

      // Cập nhật UI để đánh dấu tất cả thông báo đã đọc là đã lưu trữ
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.read ? { ...notification, archived: true } : notification,
        ),
      );

      toast({
        title: 'Đã lưu trữ tất cả thông báo đã đọc',
        description: 'Tất cả thông báo đã đọc đã được chuyển vào mục lưu trữ',
      });
    } catch (err) {
      console.error('Lỗi khi lưu trữ tất cả thông báo đã đọc:', err);

      toast({
        title: 'Lỗi',
        description: 'Không thể lưu trữ tất cả thông báo đã đọc. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    }
  }, [session, toast]);

  // Khôi phục thông báo đã xóa
  const restoreNotification = useCallback(
    async (notificationId: string) => {
      if (!session?.user?.id) return;

      try {
        const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
        const response = await fetch(`${API_URL}/api/notifications/${notificationId}/restore`, {
          method: 'POST',
        });

        if (!response.ok) throw new Error('Không thể khôi phục thông báo');

        // Cập nhật UI để khôi phục thông báo
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId ? { ...notification, deleted: false } : notification,
          ),
        );

        toast({
          title: 'Đã khôi phục thông báo',
          description: 'Thông báo đã được khôi phục thành công',
        });
      } catch (err) {
        console.error('Lỗi khi khôi phục thông báo:', err);

        toast({
          title: 'Lỗi',
          description: 'Không thể khôi phục thông báo. Vui lòng thử lại sau.',
          variant: 'destructive',
        });
      }
    },
    [session, toast],
  );

  // Yêu cầu quyền thông báo trình duyệt
  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      toast({
        title: 'Không hỗ trợ',
        description: 'Trình duyệt của bạn không hỗ trợ thông báo.',
        variant: 'destructive',
      });
      return false;
    }

    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        toast({
          title: 'Đã bật thông báo',
          description: 'Bạn sẽ nhận được thông báo ngay cả khi không mở trang web.',
        });
      } else {
        toast({
          title: 'Thông báo bị tắt',
          description: 'Bạn sẽ không nhận được thông báo khi không mở trang web.',
          variant: 'destructive',
        });
      }

      return permission === 'granted';
    }

    return true;
  }, [toast]);

  // Cập nhật thông báo theo yêu cầu
  const refreshNotifications = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    fetchNotifications: refreshNotifications,
    requestNotificationPermission,
    archiveNotification,
    archiveAllReadNotifications,
    restoreNotification,
  };
}
