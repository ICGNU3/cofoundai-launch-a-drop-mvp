
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area } from 'recharts';
import { Eye, Clock, MousePointer, TrendingUp } from 'lucide-react';

interface EngagementData {
  date: string;
  uniqueVisitors: number;
  pageViews: number;
  avgTimeOnPage: number;
  conversionRate: number;
  linkClicks: number;
}

interface EngagementMetricsProps {
  data: EngagementData[];
  summary: {
    totalVisitors: number;
    avgTimeOnPage: number;
    conversionRate: number;
    totalClicks: number;
  };
}

export const EngagementMetrics: React.FC<EngagementMetricsProps> = ({
  data,
  summary
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-text/70">Total Visitors</span>
            </div>
            <div className="text-2xl font-bold">{summary.totalVisitors.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-green-500" />
              <span className="text-sm text-text/70">Avg. Time on Page</span>
            </div>
            <div className="text-2xl font-bold">{formatTime(summary.avgTimeOnPage)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-text/70">Conversion Rate</span>
            </div>
            <div className="text-2xl font-bold">{formatPercentage(summary.conversionRate)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <MousePointer className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-text/70">Total Clicks</span>
            </div>
            <div className="text-2xl font-bold">{summary.totalClicks.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Visitor Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="uniqueVisitors" 
                    stroke="#36DF8C" 
                    fill="#36DF8C" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => formatPercentage(value as number)} />
                  <Line 
                    type="monotone" 
                    dataKey="conversionRate" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    dot={{ fill: '#8B5CF6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
