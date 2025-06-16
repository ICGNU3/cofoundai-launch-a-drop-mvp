
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/hooks/usePoolStats';
import { Activity, Clock, User, DollarSign } from 'lucide-react';

interface RoyaltyFlow {
  amount: string;
  blockTime: string;
  payer: string;
}

interface RecentTradingActivityProps {
  recentRoyalties: RoyaltyFlow[];
  tokenSymbol: string;
}

export function RecentTradingActivity({ recentRoyalties, tokenSymbol }: RecentTradingActivityProps) {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = Date.now();
    const time = parseInt(timestamp) * 1000;
    const diff = now - time;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getTradingIntensity = (amount: string) => {
    const value = parseFloat(amount);
    if (value > 100) return { label: 'High', color: 'bg-red-500' };
    if (value > 50) return { label: 'Medium', color: 'bg-orange-500' };
    return { label: 'Low', color: 'bg-green-500' };
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
        {recentRoyalties.length === 0 ? (
          <div className="text-center py-12 text-text/70">
            <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No Recent Activity</p>
            <p className="text-sm">Trades will appear here once they start happening</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-background border rounded-lg">
                <div className="text-2xl font-bold text-accent">
                  {recentRoyalties.length}
                </div>
                <div className="text-sm text-text/70">Recent Trades</div>
              </div>
              <div className="text-center p-4 bg-background border rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(
                    recentRoyalties
                      .reduce((sum, r) => sum + parseFloat(r.amount), 0)
                      .toString()
                  )}
                </div>
                <div className="text-sm text-text/70">Total Volume</div>
              </div>
              <div className="text-center p-4 bg-background border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {recentRoyalties.length > 0 
                    ? formatCurrency(
                        (recentRoyalties.reduce((sum, r) => sum + parseFloat(r.amount), 0) / recentRoyalties.length).toString()
                      )
                    : '$0.00'
                  }
                </div>
                <div className="text-sm text-text/70">Avg Trade Size</div>
              </div>
            </div>

            <div className="space-y-3">
              {recentRoyalties.slice(0, 10).map((trade, index) => {
                const intensity = getTradingIntensity(trade.amount);
                
                return (
                  <div key={index} className="flex items-center justify-between p-4 bg-background border rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${intensity.color}`}></div>
                        <Badge variant="outline" className="text-xs">
                          {intensity.label}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-text/70">
                        <User className="w-4 h-4" />
                        <span className="font-mono">{formatAddress(trade.payer)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-text/70">
                        <Clock className="w-4 h-4" />
                        <span>{formatTimeAgo(trade.blockTime)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-green-600">
                        {formatCurrency(trade.amount)}
                      </span>
                      <span className="text-sm text-text/70">royalty</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {recentRoyalties.length > 10 && (
              <div className="text-center pt-4 border-t">
                <span className="text-sm text-text/70">
                  Showing 10 of {recentRoyalties.length} recent trades
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
