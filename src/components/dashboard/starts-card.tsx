import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Users,
  ShoppingBag,
  TrendingUp,
} from 'lucide-react';
import type { DashboardStatsDTO } from '@/lib/utils/statistic';

interface StatsCardsProps {
  stats: DashboardStatsDTO;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const formatCurrency = (amount: number) => {
    amount = amount * 23000;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
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
  );
}
