
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/hooks/usePoolStats';
import { ArrowRight, User } from 'lucide-react';

interface RoyaltyFlow {
  amount: string;
  blockTime: string;
  payer: string;
}

interface RoyaltyTrackingPanelProps {
  recentRoyalties: RoyaltyFlow[];
  tokenSymbol: string;
}

export function RoyaltyTrackingPanel({ recentRoyalties, tokenSymbol }: RoyaltyTrackingPanelProps) {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRight className="w-5 h-5" />
          Recent Royalty Payments
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentRoyalties.length === 0 ? (
          <div className="text-center py-8 text-text/70">
            <ArrowRight className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No recent royalty payments</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentRoyalties.slice(0, 5).map((royalty, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-background border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">
                      {formatAddress(royalty.payer)}
                    </div>
                    <div className="text-xs text-text/70">
                      {formatTime(royalty.blockTime)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">
                    +{formatCurrency(royalty.amount)}
                  </div>
                  <div className="text-xs text-text/70">
                    {tokenSymbol} royalty
                  </div>
                </div>
              </div>
            ))}
            
            {recentRoyalties.length > 5 && (
              <div className="text-center pt-2">
                <span className="text-sm text-text/70">
                  +{recentRoyalties.length - 5} more payments
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
