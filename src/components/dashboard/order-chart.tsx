import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { OrderDataDTO } from '@/lib/utils/statistic';
import dynamic from 'next/dynamic';

// Sử dụng dynamic import với ssr: false để tránh lỗi hydration
const ResponsiveLine = dynamic(() => import('@nivo/line').then((mod) => mod.ResponsiveLine), {
  ssr: false,
});

interface OrdersChartProps {
  data: OrderDataDTO[];
  loading: boolean;
}

export function OrdersChart({ data, loading }: OrdersChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Đơn hàng theo tháng</CardTitle>
        <CardDescription>Biểu đồ số lượng đơn hàng theo từng tháng</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        {loading ? (
          <div className="h-full w-full flex items-center justify-center">
            <Skeleton className="h-[90%] w-[95%]" />
          </div>
        ) : (
          <ResponsiveLine
            data={[
              {
                id: 'orders',
                color: 'hsl(210, 70%, 50%)',
                data: data.map((d) => ({ x: d.month, y: d.orders })),
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
                <strong>{String(point.data.y)} đơn hàng</strong> trong tháng {String(point.data.x)}
              </div>
            )}
          />
        )}
      </CardContent>
    </Card>
  );
}
