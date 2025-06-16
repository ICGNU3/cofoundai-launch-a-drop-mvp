
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePoolStats } from '@/hooks/usePoolStats';
import { RoyaltyTrackingPanel } from './analytics/RoyaltyTrackingPanel';
import { VolumeRevenueCharts } from './analytics/VolumeRevenueCharts';
import { EarningsOverview } from './analytics/EarningsOverview';
import { RecentTradingActivity } from './analytics/RecentTradingActivity';
import { formatCurrency, formatNumber } from '@/hooks/usePoolStats';
import { DollarSign, TrendingUp, Activity, Users } from 'lucide-react';

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
  const { data: poolStats, isLoading } = usePoolStats(tokenAddress);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
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

  return (
    <div className="space-y-6">
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
              <Activity className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-text/70">Pool Depth</span>
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(poolStats.depth)}
            </div>
            <div className="text-sm text-purple-500 mt-1">
              Total liquidity
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-text/70">LP Providers</span>
            </div>
            <div className="text-2xl font-bold">
              {poolStats.lpCount}
            </div>
            <div className="text-sm text-orange-500 mt-1">
              Active LPs
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
          <TabsTrigger value="volume" className="text-text data-[state=active]:bg-accent data-[state=active]:text-black">
            Volume & Revenue
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

        <TabsContent value="volume">
          <VolumeRevenueCharts 
            dailyStats={poolStats.dailyStats}
            tokenSymbol={tokenSymbol}
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
