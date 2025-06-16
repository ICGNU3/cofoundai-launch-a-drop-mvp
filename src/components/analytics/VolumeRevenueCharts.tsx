
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { formatCurrency } from '@/hooks/usePoolStats';
import { TrendingUp, BarChart3 } from 'lucide-react';

interface DailyStat {
  date: number;
  volume: string;
  royalties: string;
  swaps: number;
}

interface VolumeRevenueChartsProps {
  dailyStats: DailyStat[];
  tokenSymbol: string;
}

export function VolumeRevenueCharts({ dailyStats, tokenSymbol }: VolumeRevenueChartsProps) {
  // Prepare chart data
  const chartData = dailyStats.map(stat => ({
    date: new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    volume: parseFloat(stat.volume),
    royalties: parseFloat(stat.royalties),
    swaps: stat.swaps
  })).reverse(); // Show most recent first

  const chartConfig = {
    volume: {
      label: 'Volume',
      color: 'hsl(var(--chart-1))',
    },
    royalties: {
      label: 'Royalties',
      color: 'hsl(var(--chart-2))',
    },
    swaps: {
      label: 'Trades',
      color: 'hsl(var(--chart-3))',
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Volume Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Trading Volume (30 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <AreaChart data={chartData}>
              <XAxis 
                dataKey="date" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCurrency(value.toString()).replace('$', '$')}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => [
                      formatCurrency(value.toString()),
                      name === 'volume' ? 'Volume' : 'Royalties'
                    ]}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="volume"
                stroke="var(--color-volume)"
                fill="var(--color-volume)"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Royalties Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Daily Royalties Earned
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <BarChart data={chartData}>
              <XAxis 
                dataKey="date" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCurrency(value.toString()).replace('$', '$')}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => [
                      formatCurrency(value.toString()),
                      'Royalties Earned'
                    ]}
                  />
                }
              />
              <Bar
                dataKey="royalties"
                fill="var(--color-royalties)"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Combined Volume & Royalties */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Volume vs Royalties Correlation</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <AreaChart data={chartData}>
              <XAxis 
                dataKey="date" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCurrency(value.toString()).replace('$', '$')}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => [
                      formatCurrency(value.toString()),
                      name === 'volume' ? 'Trading Volume' : 'Royalties Earned'
                    ]}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="volume"
                stackId="1"
                stroke="var(--color-volume)"
                fill="var(--color-volume)"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="royalties"
                stackId="2"
                stroke="var(--color-royalties)"
                fill="var(--color-royalties)"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
