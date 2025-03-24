'use client';

import { useState } from 'react';
import { Check, Bell, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/hooks/use-admin-notification';
import NotificationItem from '@/components/notification/notification-item';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';

interface AdminNotificationPanelProps {
  onClose: () => void;
}

export default function AdminNotificationPanel({
  onClose,
}: AdminNotificationPanelProps) {
  const [activeTab, setActiveTab] = useState('all');
  const {
    notifications,
    unreadCount,
    isLoading,
    markAllAsRead,
    clearAllNotifications,
    markAsRead,
    deleteNotification,
    archiveNotification,
  } = useNotifications();
  const { toast } = useToast();

  const unreadNotifications = notifications.filter((notification) => !notification.read);
  const readNotifications = notifications.filter((notification) => notification.read);

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    toast({
      title: 'Đã đánh dấu tất cả đã đọc',
      description: `${unreadCount} thông báo đã được đánh dấu là đã đọc`,
    });
  };

  const handleClearAll = () => {
    if (notifications.length === 0) {
      toast({
        title: 'Không có thông báo',
        description: 'Không có thông báo nào để xóa',
        variant: 'destructive',
      });
      return;
    }

    clearAllNotifications();
    toast({
      title: 'Đã xóa tất cả thông báo',
      description: `${notifications.length} thông báo đã được xóa`,
    });
  };

  return (
    <div className="bg-card rounded-lg shadow-lg border overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Thông báo quản trị
          {unreadCount > 0 && (
            <span className="bg-primary/10 text-primary text-xs rounded-full px-2 py-0.5">
              {unreadCount} mới
            </span>
          )}
        </h2>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs h-8 px-2 text-muted-foreground hover:text-foreground"
            >
              <Check className="h-3.5 w-3.5 mr-1" />
              Đánh dấu đã đọc
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
            <X className="h-4 w-4" />
            <span className="sr-only">Đóng</span>
          </Button>
        </div>
      </div>


      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="px-4 pt-2 border-b">
          <TabsList className="grid grid-cols-3 h-9">
            <TabsTrigger value="all" className="text-sm">
              Tất cả
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-sm">
              Chưa đọc
            </TabsTrigger>
            <TabsTrigger value="read" className="text-sm">
              Đã đọc
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="h-[350px] p-1">
          <TabsContent value="all" className="m-0">
            {isLoading ? (
              <NotificationSkeleton count={3} />
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                  onArchive={archiveNotification}
                  showActions={true}
                />
              ))
            ) : (
              <EmptyState message="Không có thông báo nào" />
            )}
          </TabsContent>

          <TabsContent value="unread" className="m-0">
            {isLoading ? (
              <NotificationSkeleton count={2} />
            ) : unreadNotifications.length > 0 ? (
              unreadNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                  onArchive={archiveNotification}
                  showActions={true}
                />
              ))
            ) : (
              <EmptyState message="Không có thông báo chưa đọc" />
            )}
          </TabsContent>

          <TabsContent value="read" className="m-0">
            {isLoading ? (
              <NotificationSkeleton count={2} />
            ) : readNotifications.length > 0 ? (
              readNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                  onArchive={archiveNotification}
                  showActions={true}
                />
              ))
            ) : (
              <EmptyState message="Không có thông báo đã đọc" />
            )}
          </TabsContent>
        </ScrollArea>

        <div className="p-3 border-t bg-muted/30 flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-xs text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Xóa tất cả
          </Button>
          <Button variant="outline" size="sm" asChild className="text-xs">
            <Link href="/admin/notifications">Xem tất cả</Link>
          </Button>
        </div>
      </Tabs>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
        <Bell className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
}

function NotificationSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="p-4 border-b flex gap-3 animate-pulse">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
    </>
  );
}
