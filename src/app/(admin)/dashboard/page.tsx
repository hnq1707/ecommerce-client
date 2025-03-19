'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import dynamic from 'next/dynamic';
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Users,
  ShoppingBag,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Sử dụng dynamic import với ssr: false để tránh lỗi hydration
const ResponsiveBar = dynamic(() => import('@nivo/bar').then((mod) => mod.ResponsiveBar), {
  ssr: false,
});
const ResponsiveLine = dynamic(() => import('@nivo/line').then((mod) => mod.ResponsiveLine), {
  ssr: false,
});
const ResponsivePie = dynamic(() => import('@nivo/pie').then((mod) => mod.ResponsivePie), {
  ssr: false,
});

// Dữ liệu mẫu - sử dụng dữ liệu cố định thay vì random
const revenueData = [
  { month: 'T1', revenue: 12000000 },
  { month: 'T2', revenue: 18000000 },
  { month: 'T3', revenue: 15000000 },
  { month: 'T4', revenue: 22000000 },
  { month: 'T5', revenue: 20000000 },
  { month: 'T6', revenue: 25000000 },
  { month: 'T7', revenue: 28000000 },
  { month: 'T8', revenue: 30000000 },
  { month: 'T9', revenue: 32000000 },
  { month: 'T10', revenue: 35000000 },
  { month: 'T11', revenue: 38000000 },
  { month: 'T12', revenue: 45000000 },
];

// Sử dụng dữ liệu cố định thay vì random
const orderData = [
  { month: 'T1', orders: 120 },
  { month: 'T2', orders: 180 },
  { month: 'T3', orders: 150 },
  { month: 'T4', orders: 220 },
  { month: 'T5', orders: 200 },
  { month: 'T6', orders: 250 },
  { month: 'T7', orders: 280 },
  { month: 'T8', orders: 300 },
  { month: 'T9', orders: 320 },
  { month: 'T10', orders: 350 },
  { month: 'T11', orders: 380 },
  { month: 'T12', orders: 450 },
];

const categoryData = [
  { id: 'Quần áo', value: 35, color: 'hsl(215, 70%, 50%)' },
  { id: 'Giày dép', value: 25, color: 'hsl(24, 70%, 50%)' },
  { id: 'Phụ kiện', value: 15, color: 'hsl(120, 70%, 50%)' },
  { id: 'Túi xách', value: 15, color: 'hsl(43, 70%, 50%)' },
  { id: 'Khác', value: 10, color: 'hsl(274, 70%, 50%)' },
];

// Dữ liệu thống kê cố định
const stats = {
  totalRevenue: 320000000,
  totalOrders: 2950,
  totalCustomers: 1234,
  averageOrderValue: 108475,
  revenueGrowth: 12.5,
  ordersGrowth: 8.3,
  customersGrowth: 15.2,
  aovGrowth: -2.1,
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// Component chính
export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<string>('year');

  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tổng quan</h1>
          <p className="text-muted-foreground">Thống kê và phân tích dữ liệu cửa hàng</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
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
          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Thẻ tổng quan */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium leading-none text-muted-foreground">Doanh thu</p>
              <div
                className={`flex items-center text-sm ${
                  stats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stats.revenueGrowth >= 0 ? (
                  <ArrowUpRight className="mr-1 h-4 w-4" />
                ) : (
                  <ArrowDownRight className="mr-1 h-4 w-4" />
                )}
                {Math.abs(stats.revenueGrowth)}%
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium leading-none text-muted-foreground">Đơn hàng</p>
              <div
                className={`flex items-center text-sm ${
                  stats.ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stats.ordersGrowth >= 0 ? (
                  <ArrowUpRight className="mr-1 h-4 w-4" />
                ) : (
                  <ArrowDownRight className="mr-1 h-4 w-4" />
                )}
                {Math.abs(stats.ordersGrowth)}%
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium leading-none text-muted-foreground">Khách hàng</p>
              <div
                className={`flex items-center text-sm ${
                  stats.customersGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stats.customersGrowth >= 0 ? (
                  <ArrowUpRight className="mr-1 h-4 w-4" />
                ) : (
                  <ArrowDownRight className="mr-1 h-4 w-4" />
                )}
                {Math.abs(stats.customersGrowth)}%
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{stats.totalCustomers.toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium leading-none text-muted-foreground">
                Giá trị đơn hàng
              </p>
              <div
                className={`flex items-center text-sm ${
                  stats.aovGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stats.aovGrowth >= 0 ? (
                  <ArrowUpRight className="mr-1 h-4 w-4" />
                ) : (
                  <ArrowDownRight className="mr-1 h-4 w-4" />
                )}
                {Math.abs(stats.aovGrowth)}%
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{formatCurrency(stats.averageOrderValue)}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
          <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
          <TabsTrigger value="categories">Danh mục</TabsTrigger>
        </TabsList>
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Doanh thu theo tháng</CardTitle>
              <CardDescription>Biểu đồ doanh thu theo từng tháng trong năm</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] w-full">
              <ResponsiveBar
                data={revenueData}
                keys={['revenue']}
                indexBy="month"
                margin={{ top: 20, right: 30, bottom: 50, left: 80 }}
                padding={0.3}
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                colors={{ scheme: 'blues' }}
                borderRadius={4}
                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Doanh thu (VNĐ)',
                  legendPosition: 'middle',
                  legendOffset: -60,
                  format: (value) => `${value / 1000000}M`,
                }}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Tháng',
                  legendPosition: 'middle',
                  legendOffset: 40,
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                animate={true}
                motionStiffness={90}
                motionDamping={15}
                tooltip={({ value }) => (
                  <div className="bg-white p-2 shadow-md rounded-md border">
                    <strong>{formatCurrency(value)}</strong>
                  </div>
                )}
                theme={{
                  tooltip: {
                    container: {
                      background: 'white',
                      color: 'black',
                      fontSize: 12,
                      borderRadius: 4,
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.25)',
                      padding: '5px 9px',
                    },
                  },
                  axis: {
                    ticks: {
                      text: {
                        fontSize: 12,
                        fill: '#6b7280',
                      },
                    },
                    legend: {
                      text: {
                        fontSize: 12,
                        fill: '#6b7280',
                      },
                    },
                  },
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Đơn hàng theo tháng</CardTitle>
              <CardDescription>Biểu đồ số lượng đơn hàng theo từng tháng</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveLine
                data={[
                  {
                    id: 'orders',
                    color: 'hsl(210, 70%, 50%)',
                    data: orderData.map((d) => ({ x: d.month, y: d.orders })),
                  },
                ]}
                margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
                xScale={{ type: 'point' }}
                yScale={{
                  type: 'linear',
                  min: 'auto',
                  max: 'auto',
                  stacked: false,
                  reverse: false,
                }}
                curve="cardinal"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Tháng',
                  legendOffset: 36,
                  legendPosition: 'middle',
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Số đơn hàng',
                  legendOffset: -40,
                  legendPosition: 'middle',
                }}
                colors={{ scheme: 'category10' }}
                pointSize={10}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                useMesh={true}
                enableArea={true}
                areaOpacity={0.1}
                enableGridX={false}
                theme={{
                  tooltip: {
                    container: {
                      background: 'white',
                      color: 'black',
                      fontSize: 12,
                      borderRadius: 4,
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.25)',
                      padding: '5px 9px',
                    },
                  },
                  axis: {
                    ticks: {
                      text: {
                        fontSize: 12,
                        fill: '#6b7280',
                      },
                    },
                    legend: {
                      text: {
                        fontSize: 12,
                        fill: '#6b7280',
                      },
                    },
                  },
                }}
                tooltip={({ point }) => (
                  <div className="bg-white p-2 shadow-md rounded-md border">
                    <strong>{point.data.y} đơn hàng</strong> trong tháng {point.data.x}
                  </div>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Phân bố danh mục sản phẩm</CardTitle>
              <CardDescription>Tỷ lệ phần trăm các danh mục sản phẩm</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsivePie
                data={categoryData}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                defs={[
                  {
                    id: 'dots',
                    type: 'patternDots',
                    background: 'inherit',
                    color: 'rgba(255, 255, 255, 0.3)',
                    size: 4,
                    padding: 1,
                    stagger: true,
                  },
                  {
                    id: 'lines',
                    type: 'patternLines',
                    background: 'inherit',
                    color: 'rgba(255, 255, 255, 0.3)',
                    rotation: -45,
                    lineWidth: 6,
                    spacing: 10,
                  },
                ]}
                legends={[
                  {
                    anchor: 'bottom',
                    direction: 'row',
                    justify: false,
                    translateX: 0,
                    translateY: 56,
                    itemsSpacing: 0,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: '#999',
                    itemDirection: 'left-to-right',
                    itemOpacity: 1,
                    symbolSize: 18,
                    symbolShape: 'circle',
                    effects: [
                      {
                        on: 'hover',
                        style: {
                          itemTextColor: '#000',
                        },
                      },
                    ],
                  },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
