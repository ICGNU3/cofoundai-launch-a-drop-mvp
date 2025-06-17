
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Activity, DollarSign, Users } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/hooks/usePoolStats';

interface AnalyticsData {
  volume24h: number;
  trades24h: number;
  uniqueTraders24h: number;
  liquidity: number;
  volumeHistory: Array<{
    time: string;
    volume: number;
  }>;
}

interface TradingAnalyticsProps {
  tokenSymbol: string;
  data: AnalyticsData;
}

export function TradingAnalytics({ tokenSymbol, data }: TradingAnalyticsProps) {
  const stats = [
    {
      title: '24h Volume',
      value: formatCurrency(data.volume24h.toString()),
      icon: DollarSign,
      change: '+12.5%'
    },
    {
      title: '24h Trades',
      value: formatNumber(data.trades24h.toString()),
      icon: Activity,
      change: '+8.2%'
    },
    {
      title: 'Unique Traders',
      value: formatNumber(data.uniqueTraders24h.toString()),
      icon: Users,
      change: '+15.3%'
    },
    {
      title: 'Total Liquidity',
      value: formatCurrency(data.liquidity.toString()),
      icon: TrendingUp,
      change: '+3.1%'
    }
  ];

  return (
    <div className="space-y-6 font-inter">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-surface border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text/70 font-light tracking-wide">{stat.title}</p>
                  <p className="text-xl font-light">{stat.value}</p>
                  <Badge variant="outline" className="text-xs text-green-500 font-light">
                    {stat.change}
                  </Badge>
                </div>
                <stat.icon className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Volume Chart */}
      <Card className="bg-surface border-border">
        <CardHeader>
          <CardTitle className="font-light tracking-tighter">Trading Volume (24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.volumeHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time" 
                  stroke="#9CA3AF"
                  fontSize={12}
                  style={{ fontFamily: 'Inter', fontWeight: 300 }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  style={{ fontFamily: 'Inter', fontWeight: 300 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB',
                    fontFamily: 'Inter',
                    fontWeight: 300
                  }}
                  formatter={(value: number) => [formatCurrency(value.toString()), 'Volume']}
                />
                <Bar 
                  dataKey="volume" 
                  fill="#3B82F6"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
