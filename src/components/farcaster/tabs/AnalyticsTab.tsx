
import React from 'react';
import { FarcasterAnalytics } from '@/components/farcaster/FarcasterAnalytics';

interface FarcasterMetric {
  date: string;
  impressions: number;
  frameClicks: number;
  likes: number;
  recasts: number;
  comments: number;
  profileViews: number;
}

interface AnalyticsTabProps {
  metrics: FarcasterMetric[];
}

export function AnalyticsTab({ metrics }: AnalyticsTabProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Farcaster Analytics Dashboard</h2>
        <p className="text-text/70 mb-6">
          Comprehensive insights into your Farcaster performance and audience engagement.
        </p>
      </div>
      
      <FarcasterAnalytics
        metrics={metrics}
        totalFollowers={1247}
        weeklyGrowth={23}
      />
    </div>
  );
}
