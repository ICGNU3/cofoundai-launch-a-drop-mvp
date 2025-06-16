
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/hooks/usePoolStats';

interface PricePoint {
  timestamp: string;
  price: number;
  volume: number;
}

interface PriceChartProps {
  tokenSymbol: string;
  currentPrice: number;
  priceChange24h: number;
  data: PricePoint[];
}

export function PriceChart({ tokenSymbol, currentPrice, priceChange24h, data }: PriceChartProps) {
  const isPositive = priceChange24h >= 0;

  const formatTooltipLabel = (label: string) => {
    const date = new Date(label);
    return date.toLocaleString();
  };

  const formatTooltipValue = (value: number) => {
    return formatCurrency(value.toString());
  };

  return (
    <Card className="bg-surface border-border">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>{tokenSymbol} Price Chart</span>
            <Badge variant="outline" className="text-xs">
              24H
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{formatCurrency(currentPrice.toString())}</div>
            <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {isPositive ? '+' : ''}{formatPercentage(priceChange24h.toString())}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="timestamp" 
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value) => `$${value.toFixed(2)}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
                labelFormatter={formatTooltipLabel}
                formatter={(value: number) => [formatTooltipValue(value), 'Price']}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={isPositive ? "#10B981" : "#EF4444"}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: isPositive ? "#10B981" : "#EF4444" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
