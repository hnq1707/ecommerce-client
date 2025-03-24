import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { CategoryDataDTO } from '@/lib/utils/statistic';
import dynamic from 'next/dynamic';

// Sử dụng dynamic import với ssr: false để tránh lỗi hydration
const ResponsivePie = dynamic(() => import('@nivo/pie').then((mod) => mod.ResponsivePie), {
  ssr: false,
});

interface CategoriesChartProps {
  data: CategoryDataDTO[];
  loading: boolean;
}

export function CategoriesChart({ data, loading }: CategoriesChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Phân bố danh mục sản phẩm</CardTitle>
        <CardDescription>Tỷ lệ phần trăm các danh mục sản phẩm</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        {loading ? (
          <div className="h-full w-full flex items-center justify-center">
            <Skeleton className="h-[90%] w-[95%] rounded-full" />
          </div>
        ) : (
          <ResponsivePie
            data={data}
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
        )}
      </CardContent>
    </Card>
  );
}
