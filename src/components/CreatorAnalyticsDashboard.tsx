
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePoolStats } from '@/hooks/usePoolStats';
import { RoyaltyTrackingPanel } from './analytics/RoyaltyTrackingPanel';
import { VolumeRevenueCharts } from './analytics/VolumeRevenueCharts';
import { EarningsOverview } from './analytics/EarningsOverview';
import { RecentTradingActivity } from './analytics/RecentTradingActivity';
import { RevenueBreakdown } from './analytics/RevenueBreakdown';
import { EngagementMetrics } from './analytics/EngagementMetrics';
import { HistoricalPerformance } from './analytics/HistoricalPerformance';
import { AnalyticsExport } from './analytics/AnalyticsExport';
import { GlobalLoader } from './ui/GlobalLoader';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { formatCurrency, formatNumber } from '@/hooks/usePoolStats';
import { DollarSign, TrendingUp, Activity, Users, Eye, Clock } from 'lucide-react';

interface CreatorAnalyticsDashboardProps {
  tokenAddress: string;
  tokenSymbol: string;
  creatorAddress: string;
}

export function CreatorAnalyticsDashboard({ 
  tokenAddress, 
  tokenSymbol, 
  creatorAddress 
}: CreatorAnalyticsDashboardProps) {
  const { data: poolStats, isLoading, error } = usePoolStats(tokenAddress);
  const { handleError } = useErrorHandler();
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Mock data for new analytics features
  const mockRevenueData = [
    { source: 'Direct Sales', amount: 15000, percentage: 45, color: '#36DF8C' },
    { source: 'Creator Royalties', amount: 8000, percentage: 24, color: '#3B82F6' },
    { source: 'Community Fund', amount: 7000, percentage: 21, color: '#8B5CF6' },
    { source: 'Early Supporter Upside', amount: 3500, percentage: 10, color: '#F59E0B' },
  ];

  const mockEngagementData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    uniqueVisitors: Math.floor(Math.random() * 100) + 50,
    pageViews: Math.floor(Math.random() * 200) + 100,
    avgTimeOnPage: Math.floor(Math.random() * 180) + 60,
    conversionRate: Math.random() * 0.1 + 0.02,
    linkClicks: Math.floor(Math.random() * 50) + 20,
  }));

  const mockHistoricalData = Array.from({ length: 90 }, (_, i) => ({
    date: new Date(Date.now() - (89 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    revenue: Math.floor(Math.random() * 1000) + 500,
    visitors: Math.floor(Math.random() * 100) + 50,
    conversions: Math.floor(Math.random() * 20) + 5,
    engagement: Math.floor(Math.random() * 80) + 40,
  }));

  const handleExport = async (format: 'csv' | 'pdf', options: any) => {
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would generate and download the file
      console.log('Exporting analytics data:', { format, options });
      
      // Create mock download
      const data = format === 'csv' ? 'CSV data here' : 'PDF data here';
      const blob = new Blob([data], { 
        type: format === 'csv' ? 'text/csv' : 'application/pdf' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${Date.now()}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      handleError(err as Error, { operation: 'export', format, options });
    }
  };

  if (error) {
    handleError(error as Error, { tokenAddress, operation: 'fetchPoolStats' });
  }

  if (isLoading) {
    return <GlobalLoader isLoading={true} message="Loading analytics data..." overlay={false} />;
  }

  if (!poolStats) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">No Analytics Available</h3>
        <p className="text-text/70">Pool data not found for this token.</p>
      </div>
    );
  }

  const totalEarnings = parseFloat(poolStats.totalRoyalties || '0');
  const unclaimedEarnings = parseFloat(poolStats.unclaimedRoyalties || '0');
  const claimedEarnings = totalEarnings - unclaimedEarnings;

  const engagementSummary = {
    totalVisitors: mockEngagementData.reduce((sum, day) => sum + day.uniqueVisitors, 0),
    avgTimeOnPage: Math.floor(mockEngagementData.reduce((sum, day) => sum + day.avgTimeOnPage, 0) / mockEngagementData.length),
    conversionRate: mockEngagementData.reduce((sum, day) => sum + day.conversionRate, 0) / mockEngagementData.length,
    totalClicks: mockEngagementData.reduce((sum, day) => sum + day.linkClicks, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header with Export */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-text/70">Comprehensive insights for {tokenSymbol}</p>
        </div>
        <AnalyticsExport onExport={handleExport} />
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span className="text-sm text-text/70">Total Earnings</span>
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(poolStats.totalRoyalties)}
            </div>
            <div className="text-sm text-green-500 mt-1">
              All-time royalties
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-text/70">24h Volume</span>
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(poolStats.volume24h)}
            </div>
            <div className="text-sm text-blue-500 mt-1">
              Trading activity
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-text/70">Total Visitors</span>
            </div>
            <div className="text-2xl font-bold">
              {engagementSummary.totalVisitors.toLocaleString()}
            </div>
            <div className="text-sm text-purple-500 mt-1">
              Last 30 days
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-text/70">Avg. Engagement</span>
            </div>
            <div className="text-2xl font-bold">
              {Math.floor(engagementSummary.avgTimeOnPage / 60)}m {engagementSummary.avgTimeOnPage % 60}s
            </div>
            <div className="text-sm text-orange-500 mt-1">
              Time on page
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="earnings" className="space-y-6">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="earnings" className="text-text data-[state=active]:bg-accent data-[state=active]:text-black">
            Earnings
          </TabsTrigger>
          <TabsTrigger value="revenue" className="text-text data-[state=active]:bg-accent data-[state=active]:text-black">
            Revenue Breakdown
          </TabsTrigger>
          <TabsTrigger value="engagement" className="text-text data-[state=active]:bg-accent data-[state=active]:text-black">
            Engagement
          </TabsTrigger>
          <TabsTrigger value="historical" className="text-text data-[state=active]:bg-accent data-[state=active]:text-black">
            Historical
          </TabsTrigger>
          <TabsTrigger value="activity" className="text-text data-[state=active]:bg-accent data-[state=active]:text-black">
            Recent Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="earnings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EarningsOverview 
              totalEarnings={totalEarnings}
              claimedEarnings={claimedEarnings}
              unclaimedEarnings={unclaimedEarnings}
              tokenSymbol={tokenSymbol}
            />
            <RoyaltyTrackingPanel 
              recentRoyalties={poolStats.recentRoyalties}
              tokenSymbol={tokenSymbol}
            />
          </div>
        </TabsContent>

        <TabsContent value="revenue">
          <RevenueBreakdown
            revenueData={mockRevenueData}
            totalRevenue={mockRevenueData.reduce((sum, item) => sum + item.amount, 0)}
            period="Last 30 days"
          />
        </TabsContent>

        <TabsContent value="engagement">
          <EngagementMetrics
            data={mockEngagementData}
            summary={engagementSummary}
          />
        </TabsContent>

        <TabsContent value="historical">
          <HistoricalPerformance
            data={mockHistoricalData}
            onDateRangeChange={(start, end) => setDateRange({ start, end })}
            onExport={handleExport}
          />
        </TabsContent>

        <TabsContent value="activity">
          <RecentTradingActivity 
            recentRoyalties={poolStats.recentRoyalties}
            tokenSymbol={tokenSymbol}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
