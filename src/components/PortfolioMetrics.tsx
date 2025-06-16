
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Percent, Activity } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/hooks/usePoolStats';

interface PortfolioMetric {
  label: string;
  value: string;
  change: number;
  icon: React.ElementType;
}

interface PortfolioDataPoint {
  timestamp: string;
  totalValue: number;
  dayChange: number;
}

interface PortfolioMetricsProps {
  totalValue: number;
  dayChange: number;
  weekChange: number;
  totalTrades: number;
  historicalData: PortfolioDataPoint[];
}

export function PortfolioMetrics({ 
  totalValue, 
  dayChange, 
  weekChange, 
  totalTrades, 
  historicalData 
}: PortfolioMetricsProps) {
  const metrics: PortfolioMetric[] = [
    {
      label: 'Portfolio Value',
      value: formatCurrency(totalValue.toString()),
      change: dayChange,
      icon: DollarSign
    },
    {
      label: '24h Change',
      value: formatPercentage(dayChange.toString()),
      change: dayChange,
      icon: dayChange >= 0 ? TrendingUp : TrendingDown
    },
    {
      label: '7d Change',
      value: formatPercentage(weekChange.toString()),
      change: weekChange,
      icon: weekChange >= 0 ? TrendingUp : TrendingDown
    },
    {
      label: 'Total Trades',
      value: totalTrades.toString(),
      change: 0,
      icon: Activity
    }
  ];

  const isPositiveDay = dayChange >= 0;

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text/70">{metric.label}</p>
                  <p className="text-lg font-bold">{metric.value}</p>
                  {metric.change !== 0 && (
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {metric.change >= 0 ? '+' : ''}{metric.change.toFixed(2)}%
                    </Badge>
                  )}
                </div>
                <metric.icon className={`w-6 h-6 ${
                  metric.change > 0 ? 'text-green-600' : 
                  metric.change < 0 ? 'text-red-600' : 
                  'text-accent'
                }`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Portfolio Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Portfolio Performance (7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {historicalData.length === 0 ? (
            <div className="text-center py-8 text-text/70">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No Historical Data</p>
              <p className="text-sm">Start trading to see your portfolio performance</p>
            </div>
          ) : (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="timestamp" 
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value: number) => [formatCurrency(value.toString()), 'Portfolio Value']}
                  />
                  <Line
                    type="monotone"
                    dataKey="totalValue"
                    stroke={isPositiveDay ? "#10B981" : "#EF4444"}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: isPositiveDay ? "#10B981" : "#EF4444" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
