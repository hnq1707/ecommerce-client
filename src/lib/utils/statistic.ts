import api from './api';

// Định nghĩa các kiểu dữ liệu
export interface RevenueDataDTO {
  month: string;
  revenue: number;
}

export interface OrderDataDTO {
  month: string;
  orders: number;
}

export interface CategoryDataDTO {
  id: string;
  value: number;
  color: string;
}

export interface DashboardStatsDTO {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  revenueGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
  aovGrowth: number;
}

// URL của Spring Boot API

// Service xử lý API
export const StatisticsAPI = {
  // Lấy thống kê tổng quan
  async getStats(): Promise<DashboardStatsDTO> {
    const { data } = await api.get<DashboardStatsDTO>('/api/statistic/stats');
    return data;
  },

  // Lấy dữ liệu doanh thu
  async getRevenueData(): Promise<RevenueDataDTO[]> {
    const { data } = await api.get<RevenueDataDTO[]>('/api/statistic/revenue');

    return data;
  },

  // Lấy dữ liệu đơn hàng
  async getOrderData(): Promise<OrderDataDTO[]> {
    const { data } = await api.get<OrderDataDTO[]>('/api/statistic/orders');

    return data;
  },

  // Lấy dữ liệu danh mục
  async getCategoryData(): Promise<CategoryDataDTO[]> {
    const { data } = await api.get<CategoryDataDTO[]>('/api/statistic/categories');
    console.log(data);

    return data;
  },

  // Lấy tất cả dữ liệu dashboard
  async getAllDashboardData(): Promise<{
    stats: DashboardStatsDTO;
    revenueData: RevenueDataDTO[];
    orderData: OrderDataDTO[];
    categoryData: CategoryDataDTO[];
  }> {
    try {
      const [stats, revenueData, orderData, categoryData] = await Promise.all([
        this.getStats(),
        this.getRevenueData(),
        this.getOrderData(),
        this.getCategoryData(),
      ]);

      return {
        stats,
        revenueData,
        orderData,
        categoryData,
      };
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu dashboard:', error);
      throw error;
    }
  },
};
