'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CouponList } from './coupon-list';
import { CouponForm } from './coupon-form';
import { CouponStats } from './coupon-stats';
import { getCoupons, deleteCoupon, toggleCouponStatus } from '@/lib/utils/coupon-service';
import type { Coupon } from '@/lib/utils/coupon-service';

export function CouponManagement() {
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [activeTab, setActiveTab] = useState('list');

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      setIsLoading(true);
      const data = await getCoupons();
      setCoupons(data);
    } catch (error) {
      console.error('Error loading coupons:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách mã giảm giá',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setActiveTab('edit');
  };

  const handleDeleteCoupon = async (id: number) => {
    try {
      await deleteCoupon(id);
      setCoupons(coupons.filter((coupon) => coupon.id !== id));
      toast({
        title: 'Thành công',
        description: 'Đã xóa mã giảm giá',
      });
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa mã giảm giá',
        variant: 'destructive',
      });
    }
  };

  const handleToggleStatus = async (id: number, isActive: boolean) => {
    try {
      await toggleCouponStatus(id, !isActive);
      setCoupons(coupons.map((coupon) => (coupon.id === id ? { ...coupon, isActive } : coupon)));
      toast({
        title: 'Thành công',
        description: `Đã ${isActive ? 'kích hoạt' : 'vô hiệu hóa'} mã giảm giá`,
      });
    } catch (error) {
      console.error('Error toggling coupon status:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể thay đổi trạng thái mã giảm giá',
        variant: 'destructive',
      });
    }
  };

  const handleCouponSaved = () => {
    loadCoupons();
    setSelectedCoupon(null);
    setActiveTab('list');
    toast({
      title: 'Thành công',
      description: 'Đã lưu mã giảm giá',
    });
  };

  const handleCancelEdit = () => {
    setSelectedCoupon(null);
    setActiveTab('list');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý mã giảm giá</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="list">Danh sách</TabsTrigger>
          <TabsTrigger value="create">Tạo mới</TabsTrigger>
          <TabsTrigger value="stats">Thống kê</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <CouponList
            coupons={coupons}
            isLoading={isLoading}
            onEdit={handleEditCoupon}
            onDelete={handleDeleteCoupon}
            onToggleStatus={handleToggleStatus}
            onRefresh={loadCoupons}
          />
        </TabsContent>

        <TabsContent value="create">
          <CouponForm onSave={handleCouponSaved} onCancel={handleCancelEdit} />
        </TabsContent>

        <TabsContent value="edit">
          <CouponForm
            coupon={selectedCoupon}
            onSave={handleCouponSaved}
            onCancel={handleCancelEdit}
          />
        </TabsContent>

        <TabsContent value="stats">
          <CouponStats coupons={coupons} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
