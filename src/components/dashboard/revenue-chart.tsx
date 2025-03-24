import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { RevenueDataDTO } from '@/lib/utils/statistic';
import dynamic from 'next/dynamic';

// Sử dụng dynamic import với ssr: false để tránh lỗi hydration
const ResponsiveBar = dynamic(() => import('@nivo/bar').then((mod) => mod.ResponsiveBar), {
  ssr: false,
});

interface RevenueChartProps {
  data: RevenueDataDTO[];
  loading: boolean;
}

export function RevenueChart({ data, loading }: RevenueChartProps) {
      const formatCurrency = (amount: number) => {
        amount = amount * 23000;
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(amount);
      };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doanh thu theo tháng</CardTitle>
        <CardDescription>Biểu đồ doanh thu theo từng tháng trong năm</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px] w-full">
        {loading ? (
          <div className="h-full w-full flex items-center justify-center">
            <Skeleton className="h-[90%] w-[95%]" />
          </div>
        ) : (
          <ResponsiveBar
            data={data}
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
        )}
      </CardContent>
    </Card>
  );
}
