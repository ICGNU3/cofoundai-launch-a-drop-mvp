
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Calendar, Download, Filter } from 'lucide-react';

interface PerformanceData {
  date: string;
  revenue: number;
  visitors: number;
  conversions: number;
  engagement: number;
}

interface HistoricalPerformanceProps {
  data: PerformanceData[];
  onDateRangeChange: (startDate: string, endDate: string) => void;
  onExport: (format: 'csv' | 'pdf') => void;
}

export const HistoricalPerformance: React.FC<HistoricalPerformanceProps> = ({
  data,
  onDateRangeChange,
  onExport
}) => {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'custom'>('30d');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['revenue', 'visitors']);

  const handleDateRangeChange = (range: string) => {
    setDateRange(range as any);
    const end = new Date();
    let start = new Date();
    
    switch (range) {
      case '7d':
        start.setDate(end.getDate() - 7);
        break;
      case '30d':
        start.setDate(end.getDate() - 30);
        break;
      case '90d':
        start.setDate(end.getDate() - 90);
        break;
      default:
        return;
    }
    
    onDateRangeChange(start.toISOString().split('T')[0], end.toISOString().split('T')[0]);
  };

  const handleCustomDateRange = () => {
    if (startDate && endDate) {
      onDateRangeChange(startDate, endDate);
    }
  };

  const metricColors = {
    revenue: '#36DF8C',
    visitors: '#3B82F6',
    conversions: '#8B5CF6',
    engagement: '#F59E0B'
  };

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Historical Performance
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onExport('csv')}>
              <Download className="w-4 h-4 mr-1" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => onExport('pdf')}>
              <Download className="w-4 h-4 mr-1" />
              PDF
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-wrap items-end gap-4 mb-6 p-4 border border-border rounded-lg">
          <div>
            <Label htmlFor="dateRange">Time Period</Label>
            <Select value={dateRange} onValueChange={handleDateRangeChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {dateRange === 'custom' && (
            <>
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-40"
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-40"
                />
              </div>
              <Button onClick={handleCustomDateRange} size="sm">
                <Filter className="w-4 h-4 mr-1" />
                Apply
              </Button>
            </>
          )}
        </div>

        {/* Chart */}
        <div className="h-80 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'revenue' ? formatCurrency(value as number) : value,
                  name
                ]}
              />
              <Legend />
              {selectedMetrics.includes('revenue') && (
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke={metricColors.revenue}
                  strokeWidth={2}
                  name="Revenue"
                />
              )}
              {selectedMetrics.includes('visitors') && (
                <Line 
                  type="monotone" 
                  dataKey="visitors" 
                  stroke={metricColors.visitors}
                  strokeWidth={2}
                  name="Visitors"
                />
              )}
              {selectedMetrics.includes('conversions') && (
                <Line 
                  type="monotone" 
                  dataKey="conversions" 
                  stroke={metricColors.conversions}
                  strokeWidth={2}
                  name="Conversions"
                />
              )}
              {selectedMetrics.includes('engagement') && (
                <Line 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke={metricColors.engagement}
                  strokeWidth={2}
                  name="Engagement"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Metric Toggle */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(metricColors).map(([metric, color]) => (
            <Button
              key={metric}
              variant={selectedMetrics.includes(metric) ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedMetrics(prev => 
                  prev.includes(metric) 
                    ? prev.filter(m => m !== metric)
                    : [...prev, metric]
                );
              }}
              className="capitalize"
            >
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: color }}
              />
              {metric}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
