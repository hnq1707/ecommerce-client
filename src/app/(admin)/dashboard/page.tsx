'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useDashboardData } from '@/hooks/use-dashboardData';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton';
import { StatsCards } from '@/components/dashboard/starts-card';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { OrdersChart } from '@/components/dashboard/order-chart';
import { CategoriesChart } from '@/components/dashboard/category-chart';

// Component chính
export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<string>('year');
  const { stats, revenueData, orderData, categoryData, loading, error, refetch } =
    useDashboardData();

  // Hiển thị skeleton khi đang tải dữ liệu
  if (loading && !stats) {
    return <DashboardSkeleton />;
  }

  // Hiển thị thông báo lỗi
  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={() => refetch()}>Thử lại</Button>
      </div>
    );
  }

  // Nếu không có dữ liệu, hiển thị thông báo
  if (!stats || revenueData.length === 0 || orderData.length === 0 || categoryData.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="mb-4">Không có dữ liệu để hiển thị</div>
        <Button onClick={() => refetch()}>Tải dữ liệu</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tổng quan</h1>
          <p className="text-muted-foreground">Thống kê và phân tích dữ liệu cửa hàng</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Hôm nay</SelectItem>
              <SelectItem value="week">Tuần này</SelectItem>
              <SelectItem value="month">Tháng này</SelectItem>
              <SelectItem value="quarter">Quý này</SelectItem>
              <SelectItem value="year">Năm nay</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => refetch()} title="Làm mới dữ liệu">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Thẻ tổng quan */}
      <StatsCards stats={stats} />

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
          <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
          <TabsTrigger value="categories">Danh mục</TabsTrigger>
        </TabsList>
        <TabsContent value="revenue" className="space-y-4">
          <RevenueChart data={revenueData} loading={loading} />
        </TabsContent>
        <TabsContent value="orders" className="space-y-4">
          <OrdersChart data={orderData} loading={loading} />
        </TabsContent>
        <TabsContent value="categories" className="space-y-4">
          <CategoriesChart data={categoryData} loading={loading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
