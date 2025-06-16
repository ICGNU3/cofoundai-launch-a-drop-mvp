
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { formatCurrency } from '@/hooks/usePoolStats';

interface TradeActivity {
  id: string;
  type: 'buy' | 'sell';
  tokenSymbol: string;
  tokenName: string;
  amount: string;
  priceUSD: number;
  totalUSD: number;
  timestamp: string;
  txHash?: string;
}

interface RecentTradingActivityProps {
  activities: TradeActivity[];
}

export function RecentTradingActivity({ activities }: RecentTradingActivityProps) {
  const formatTimeAgo = (timestamp: string) => {
    const now = Date.now();
    const time = new Date(timestamp).getTime();
    const diff = now - time;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const formatTxHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Recent Trading Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-text/70">
            <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No Trading Activity</p>
            <p className="text-sm">Your trades will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.slice(0, 10).map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-background border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'buy' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {activity.type === 'buy' ? 
                      <ArrowDownLeft className="w-4 h-4" /> : 
                      <ArrowUpRight className="w-4 h-4" />
                    }
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant={activity.type === 'buy' ? 'default' : 'secondary'} className="text-xs">
                        {activity.type.toUpperCase()}
                      </Badge>
                      <span className="font-semibold">{activity.tokenSymbol}</span>
                    </div>
                    <div className="text-sm text-text/70">{activity.tokenName}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold">{activity.amount} {activity.tokenSymbol}</div>
                  <div className="text-sm text-text/70">{formatCurrency(activity.totalUSD.toString())}</div>
                  <div className="flex items-center gap-2 text-xs text-text/70">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeAgo(activity.timestamp)}</span>
                    {activity.txHash && (
                      <span className="font-mono">{formatTxHash(activity.txHash)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {activities.length > 10 && (
              <div className="text-center pt-2 border-t">
                <span className="text-sm text-text/70">
                  Showing 10 of {activities.length} trades
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
