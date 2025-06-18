
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar } from 'recharts';
import { TrendingUp, Users, MessageCircle, Share, Eye, MousePointer } from 'lucide-react';

interface FarcasterMetric {
  date: string;
  impressions: number;
  frameClicks: number;
  likes: number;
  recasts: number;
  comments: number;
  profileViews: number;
}

interface FarcasterAnalyticsProps {
  metrics: FarcasterMetric[];
  totalFollowers: number;
  weeklyGrowth: number;
}

export function FarcasterAnalytics({ metrics, totalFollowers, weeklyGrowth }: FarcasterAnalyticsProps) {
  const totalImpressions = metrics.reduce((sum, m) => sum + m.impressions, 0);
  const totalEngagement = metrics.reduce((sum, m) => sum + m.likes + m.recasts + m.comments, 0);
  const totalFrameClicks = metrics.reduce((sum, m) => sum + m.frameClicks, 0);
  const engagementRate = totalImpressions > 0 ? (totalEngagement / totalImpressions) * 100 : 0;

  const summaryStats = [
    {
      title: "Total Impressions",
      value: totalImpressions.toLocaleString(),
      icon: Eye,
      change: "+12.5%",
      positive: true
    },
    {
      title: "Frame Interactions",
      value: totalFrameClicks.toLocaleString(),
      icon: MousePointer,
      change: "+8.2%",
      positive: true
    },
    {
      title: "Engagement Rate",
      value: `${engagementRate.toFixed(1)}%`,
      icon: TrendingUp,
      change: "+2.1%",
      positive: true
    },
    {
      title: "Followers",
      value: totalFollowers.toLocaleString(),
      icon: Users,
      change: `+${weeklyGrowth}`,
      positive: weeklyGrowth > 0
    }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text/70">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className="w-8 h-8 text-accent" />
                </div>
                <div className="mt-2">
                  <Badge variant={stat.positive ? "default" : "destructive"} className="text-xs">
                    {stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Impressions Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Impressions & Frame Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics}>
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="impressions" 
                    stroke="#36DF8C" 
                    strokeWidth={2}
                    name="Impressions"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="frameClicks" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    name="Frame Clicks"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Engagement Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics}>
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="likes" stackId="a" fill="#EF4444" name="Likes" />
                  <Bar dataKey="recasts" stackId="a" fill="#36DF8C" name="Recasts" />
                  <Bar dataKey="comments" stackId="a" fill="#3B82F6" name="Comments" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Date</th>
                  <th className="text-right p-2">Impressions</th>
                  <th className="text-right p-2">Frame Clicks</th>
                  <th className="text-right p-2">Likes</th>
                  <th className="text-right p-2">Recasts</th>
                  <th className="text-right p-2">Comments</th>
                  <th className="text-right p-2">Engagement Rate</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((metric, index) => {
                  const dayEngagement = metric.likes + metric.recasts + metric.comments;
                  const dayEngagementRate = metric.impressions > 0 ? (dayEngagement / metric.impressions) * 100 : 0;
                  
                  return (
                    <tr key={index} className="border-b hover:bg-surface/50">
                      <td className="p-2">{metric.date}</td>
                      <td className="text-right p-2">{metric.impressions.toLocaleString()}</td>
                      <td className="text-right p-2">{metric.frameClicks.toLocaleString()}</td>
                      <td className="text-right p-2 text-red-500">{metric.likes}</td>
                      <td className="text-right p-2 text-green-500">{metric.recasts}</td>
                      <td className="text-right p-2 text-blue-500">{metric.comments}</td>
                      <td className="text-right p-2">{dayEngagementRate.toFixed(1)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
