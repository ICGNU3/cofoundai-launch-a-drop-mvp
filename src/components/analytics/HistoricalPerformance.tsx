
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Calendar, Download } from 'lucide-react';

interface HistoricalData {
  date: string;
  revenue: number;
  visitors: number;
  conversions: number;
  engagement: number;
}

interface HistoricalPerformanceProps {
  data: HistoricalData[];
  onDateRangeChange: (start: string, end: string) => void;
  onExport: (format: 'csv' | 'pdf', options: any) => Promise<void>;
}

export const HistoricalPerformance: React.FC<HistoricalPerformanceProps> = ({
  data,
  onDateRangeChange,
  onExport
}) => {
  const [timeRange, setTimeRange] = useState('30d');
  const [metric, setMetric] = useState('revenue');

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  const handleExportData = async () => {
    await onExport('csv', {
      format: 'csv',
      dateRange: timeRange,
      metrics: ['historical'],
      includeCharts: false
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Historical Performance</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handleExportData}>
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Metric Selector */}
          <div className="flex gap-2">
            <Button
              variant={metric === 'revenue' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMetric('revenue')}
            >
              Revenue
            </Button>
            <Button
              variant={metric === 'visitors' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMetric('visitors')}
            >
              Visitors
            </Button>
            <Button
              variant={metric === 'conversions' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMetric('conversions')}
            >
              Conversions
            </Button>
            <Button
              variant={metric === 'engagement' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMetric('engagement')}
            >
              Engagement
            </Button>
          </div>

          {/* Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value) => 
                    metric === 'revenue' ? formatCurrency(value as number) : value
                  }
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey={metric} 
                  stroke="#36DF8C" 
                  strokeWidth={2}
                  dot={{ fill: '#36DF8C' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {metric === 'revenue' 
                  ? formatCurrency(data.reduce((sum, d) => sum + d.revenue, 0))
                  : data.reduce((sum, d) => sum + (d as any)[metric], 0).toLocaleString()
                }
              </div>
              <div className="text-sm text-text/60">Total {metric}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {metric === 'revenue' 
                  ? formatCurrency(data.reduce((sum, d) => sum + d.revenue, 0) / data.length)
                  : Math.round(data.reduce((sum, d) => sum + (d as any)[metric], 0) / data.length).toLocaleString()
                }
              </div>
              <div className="text-sm text-text/60">Average {metric}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {metric === 'revenue' 
                  ? formatCurrency(Math.max(...data.map(d => d.revenue)))
                  : Math.max(...data.map(d => (d as any)[metric])).toLocaleString()
                }
              </div>
              <div className="text-sm text-text/60">Peak {metric}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {data.length}
              </div>
              <div className="text-sm text-text/60">Data points</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
