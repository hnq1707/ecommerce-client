'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  StatisticsAPI,
  type DashboardStatsDTO,
  type RevenueDataDTO,
  type OrderDataDTO,
  type CategoryDataDTO,
} from '@/lib/utils/statistic';

interface DashboardData {
  stats: DashboardStatsDTO | null;
  revenueData: RevenueDataDTO[];
  orderData: OrderDataDTO[];
  categoryData: CategoryDataDTO[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDashboardData(): DashboardData {
  const [stats, setStats] = useState<DashboardStatsDTO | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueDataDTO[]>([]);
  const [orderData, setOrderData] = useState<OrderDataDTO[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryDataDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await StatisticsAPI.getAllDashboardData();

      setStats(data.stats);
      setRevenueData(data.revenueData);
      setOrderData(data.orderData);
      setCategoryData(data.categoryData);
    } catch (err) {
      console.error('Lỗi khi lấy dữ liệu dashboard:', err);
      setError('Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Gọi API khi component được tải
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    stats,
    revenueData,
    orderData,
    categoryData,
    loading,
    error,
    refetch: fetchData,
  };
}
