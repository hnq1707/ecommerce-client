'use client';

import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Coupon } from '@/lib/utils/coupon-service';

interface CouponStatsProps {
  coupons: Coupon[];
}

export function CouponStats({ coupons }: CouponStatsProps) {
  const [activeTab, setActiveTab] = useState('usage');

  // Sửa phần tính toán thống kê để kiểm tra xem coupons có phải là mảng hay không
  // Tính toán thống kê sử dụng
  const usageData = Array.isArray(coupons)
    ? coupons
        .filter((coupon) => coupon.usageCount && coupon.usageCount > 0)
        .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
        .slice(0, 10)
        .map((coupon) => ({
          name: coupon.code,
          value: coupon.usageCount || 0,
        }))
    : [];

  // Tính toán thống kê theo loại giảm giá
  const discountTypeData = Array.isArray(coupons)
    ? [
        {
          name: 'Phần trăm',
          value: coupons.filter((coupon) => coupon.discountType === 'PERCENTAGE').length,
        },
        {
          name: 'Số tiền cố định',
          value: coupons.filter((coupon) => coupon.discountType === 'FIXED_AMOUNT').length,
        },
      ]
    : [];

  // Tính toán thống kê theo loại áp dụng
  const couponTypeData = Array.isArray(coupons)
    ? [
        {
          name: 'Tất cả',
          value: coupons.filter((coupon) => coupon.couponType === 'GENERAL').length,
        },
        {
          name: 'Sản phẩm',
          value: coupons.filter((coupon) => coupon.couponType === 'PRODUCT').length,
        },
        {
          name: 'Danh mục',
          value: coupons.filter((coupon) => coupon.couponType === 'CATEGORY').length,
        },
        {
          name: 'Người dùng',
          value: coupons.filter((coupon) => coupon.couponType === 'USER').length,
        },
      ]
    : [];

  // Tính toán thống kê theo trạng thái
  const statusData = Array.isArray(coupons)
    ? [
        {
          name: 'Hoạt động',
          value: coupons.filter((coupon) => coupon.isActive).length,
        },
        {
          name: 'Vô hiệu',
          value: coupons.filter((coupon) => !coupon.isActive).length,
        },
      ]
    : [];

  // Màu sắc cho biểu đồ
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thống kê mã giảm giá</CardTitle>
        <CardDescription>Phân tích dữ liệu về mã giảm giá trong hệ thống</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="usage">Lượt sử dụng</TabsTrigger>
            <TabsTrigger value="type">Loại giảm giá</TabsTrigger>
            <TabsTrigger value="apply">Đối tượng áp dụng</TabsTrigger>
            <TabsTrigger value="status">Trạng thái</TabsTrigger>
          </TabsList>

          <TabsContent value="usage" className="pt-4">
            <div className="h-[400px]">
              {usageData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={usageData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" name="Lượt sử dụng" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Chưa có dữ liệu sử dụng mã giảm giá
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="type" className="pt-4">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={discountTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {discountTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="apply" className="pt-4">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={couponTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {couponTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="status" className="pt-4">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
