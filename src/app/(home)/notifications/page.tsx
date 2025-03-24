'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  Archive,
  Bell,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
  Trash2,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

import { useNotifications } from '@/hooks/use-notification';
import NotificationItem from '@/components/notification/notification-item';
import type { Notification, NotificationType } from '@/lib/type/Notification';
import { useSession } from 'next-auth/react';

export default function NotificationsPage() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'all');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<NotificationType | 'ALL'>('ALL');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();
  const {
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    archiveNotification,
    archiveAllReadNotifications,
    restoreNotification,
  } = useNotifications();

  // Chỉ gọi fetchNotifications khi session đã được tải và có thay đổi trong các bộ lọc
  useEffect(() => {
    // Chỉ fetch khi session đã sẵn sàng (authenticated hoặc unauthenticated)
    if (status !== 'loading') {
      fetchNotifications();
    }
  }, [activeTab, page, pageSize, searchQuery, typeFilter, dateRange, session, status]);

  const fetchNotifications = async () => {
    // Nếu session đang loading hoặc user chưa đăng nhập, không fetch
    if (status === 'loading' || !session?.user?.id) {
      return;
    }

    setIsLoading(true);
    try {
      const currentUser = session.user.id;

      let url = `/api/notifications/user/${currentUser}?page=${page}&size=${pageSize}`;

      // Xác định URL dựa trên tab đang active
      if (activeTab === 'unread') {
        url = `/api/notifications/user/${currentUser}/unread?page=${page}&size=${pageSize}`;
      } else if (activeTab === 'read') {
        url = `/api/notifications/user/${currentUser}/read?page=${page}&size=${pageSize}`;
      } else if (activeTab === 'archived') {
        url = `/api/notifications/user/${currentUser}/archived?page=${page}&size=${pageSize}`;
      } else if (activeTab === 'deleted') {
        url = `/api/notifications/user/${currentUser}/deleted?page=${page}&size=${pageSize}`;
      }

      // Thêm các tham số tìm kiếm và lọc
      if (searchQuery) {
        url += `&query=${encodeURIComponent(searchQuery)}`;
      }

      if (typeFilter !== 'ALL') {
        url += `&type=${typeFilter}`;
      }

      if (dateRange.from) {
        url += `&startDate=${dateRange.from.toISOString()}`;
      }
      if (dateRange.to) {
        url += `&endDate=${dateRange.to.toISOString()}`;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`);
      if (!response.ok) throw new Error('Lỗi khi tải thông báo');

      const data = await response.json();
      console.log('Dữ liệu thông báo nhận được:', data); // Log để debug

      // Kiểm tra cấu trúc dữ liệu và xử lý phù hợp
      if (Array.isArray(data)) {
        // Nếu API trả về mảng trực tiếp
        setNotifications(data);
        setTotalPages(Math.ceil(data.length / pageSize) || 1);
      } else if (data.content && Array.isArray(data.content)) {
        // Nếu API trả về dạng phân trang
        setNotifications(data.content);
        setTotalPages(data.totalPages || Math.ceil(data.content.length / pageSize) || 1);
      } else if (data.notifications && Array.isArray(data.notifications)) {
        // Trường hợp khác - API có thể trả về dạng { notifications: [...] }
        setNotifications(data.notifications);
        setTotalPages(data.totalPages || Math.ceil(data.notifications.length / pageSize) || 1);
      } else {
        // Trường hợp không xác định được cấu trúc
        console.error('Cấu trúc dữ liệu không đúng định dạng:', data);
        setNotifications([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Lỗi khi tải thông báo:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải thông báo. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setPage(0); // Reset về trang đầu tiên khi chuyển tab
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0); // Reset về trang đầu tiên khi tìm kiếm
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setTypeFilter('ALL');
    setDateRange({ from: undefined, to: undefined });
    setPage(0);
  };

  const handleArchiveAll = async () => {
    try {
      await archiveAllReadNotifications();
      toast({
        title: 'Thành công',
        description: 'Tất cả thông báo đã đọc đã được lưu trữ',
      });
      fetchNotifications();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể lưu trữ thông báo. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllNotifications();
      toast({
        title: 'Thành công',
        description: 'Tất cả thông báo đã được xóa',
      });
      fetchNotifications();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa thông báo. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    }
  };

  // Hiển thị trạng thái khi chưa đăng nhập hoặc không có thông báo
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Bell className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">
        {status === 'unauthenticated'
          ? 'Vui lòng đăng nhập để xem thông báo'
          : 'Không có thông báo'}
      </h3>
      <p className="text-muted-foreground text-sm max-w-md">
        {status === 'unauthenticated'
          ? 'Bạn cần đăng nhập để xem thông báo của mình.'
          : activeTab === 'all'
          ? 'Bạn chưa có thông báo nào.'
          : activeTab === 'unread'
          ? 'Bạn không có thông báo chưa đọc.'
          : activeTab === 'read'
          ? 'Bạn không có thông báo đã đọc.'
          : activeTab === 'archived'
          ? 'Bạn không có thông báo đã lưu trữ.'
          : 'Thùng rác trống.'}
      </p>
      {status !== 'unauthenticated' &&
        (searchQuery || typeFilter !== 'ALL' || dateRange.from || dateRange.to) && (
          <Button variant="outline" onClick={handleClearFilters} className="mt-4">
            <X className="h-4 w-4 mr-2" />
            Xóa bộ lọc
          </Button>
        )}
      {status === 'unauthenticated' && (
        <Button variant="default" className="mt-4" asChild>
          <a href="/auth/signin">Đăng nhập</a>
        </Button>
      )}
    </div>
  );

  // Hiển thị thông báo loading khi session đang tải
  if (status === 'loading') {
    return (
      <div className="container max-w-4xl py-8">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="bg-card rounded-lg border shadow-sm overflow-hidden p-6">
          <div className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <div className="space-y-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Lịch sử thông báo</h1>
        {status === 'authenticated' && (
          <div className="flex gap-2">
            {activeTab === 'read' && (
              <Button variant="outline" onClick={handleArchiveAll}>
                <Archive className="h-4 w-4 mr-2" />
                Lưu trữ tất cả
              </Button>
            )}
            {activeTab !== 'deleted' && (
              <Button variant="outline" onClick={handleClearAll} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa tất cả
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        {status === 'authenticated' && (
          <div className="p-4 border-b">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Tìm kiếm thông báo..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>

              <div className="flex gap-2">
                <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as any)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Loại thông báo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tất cả loại</SelectItem>
                    <SelectItem value="SYSTEM">Hệ thống</SelectItem>
                    <SelectItem value="ORDER">Đơn hàng</SelectItem>
                    <SelectItem value="PAYMENT">Thanh toán</SelectItem>
                    <SelectItem value="USER">Người dùng</SelectItem>
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[140px]">
                      <Calendar className="h-4 w-4 mr-2" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, 'dd/MM')} - {format(dateRange.to, 'dd/MM')}
                          </>
                        ) : (
                          format(dateRange.from, 'dd/MM/yyyy')
                        )
                      ) : (
                        'Chọn ngày'
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <CalendarComponent
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={dateRange}
                      onSelect={(range) => setDateRange(range as any)}
                      numberOfMonths={2}
                      locale={vi}
                    />
                  </PopoverContent>
                </Popover>

                {(searchQuery || typeFilter !== 'ALL' || dateRange.from || dateRange.to) && (
                  <Button variant="ghost" onClick={handleClearFilters} size="icon">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid grid-cols-5 h-9">
                <TabsTrigger value="all">Tất cả</TabsTrigger>
                <TabsTrigger value="unread">Chưa đọc</TabsTrigger>
                <TabsTrigger value="read">Đã đọc</TabsTrigger>
                <TabsTrigger value="archived">Đã lưu trữ</TabsTrigger>
                <TabsTrigger value="deleted">Thùng rác</TabsTrigger>
              </TabsList>

              <div className="min-h-[400px]">
                <TabsContent value={activeTab} className="m-0">
                  {isLoading ? (
                    <div className="p-4 space-y-4">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <div key={i} className="flex gap-4 p-4 border-b">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2 flex-1">
                              <Skeleton className="h-4 w-3/4" />
                              <Skeleton className="h-4 w-1/2" />
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : notifications && notifications.length > 0 ? (
                    <div>
                      {notifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          onMarkAsRead={markAsRead}
                          onDelete={deleteNotification}
                          onArchive={archiveNotification}
                          onRestore={restoreNotification}
                          showActions={true}
                          isInTrash={activeTab === 'deleted'}
                          isArchived={activeTab === 'archived'}
                        />
                      ))}
                    </div>
                  ) : (
                    renderEmptyState()
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </div>
        )}

        {status !== 'authenticated' && <div className="p-8">{renderEmptyState()}</div>}
      </div>

      {status === 'authenticated' &&
        notifications &&
        notifications.length > 0 &&
        totalPages > 1 && (
          <div className="p-4 border-t flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Trang {page + 1} / {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
    </div>
  );
}
