
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/hooks/usePoolStats';
import { Wallet, Clock } from 'lucide-react';

interface EarningsOverviewProps {
  totalEarnings: number;
  claimedEarnings: number;
  unclaimedEarnings: number;
  tokenSymbol: string;
}

export function EarningsOverview({ 
  totalEarnings, 
  claimedEarnings, 
  unclaimedEarnings, 
  tokenSymbol 
}: EarningsOverviewProps) {
  const claimedPercentage = totalEarnings > 0 ? (claimedEarnings / totalEarnings) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Earnings Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-text/70">Claimed</span>
            <span className="font-semibold text-green-600">
              {formatCurrency(claimedEarnings.toString())}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-text/70 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Unclaimed
            </span>
            <span className="font-semibold text-orange-600">
              {formatCurrency(unclaimedEarnings.toString())}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Claimed Progress</span>
              <span>{claimedPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={claimedPercentage} className="h-2" />
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent mb-1">
              {formatCurrency(totalEarnings.toString())}
            </div>
            <div className="text-sm text-text/70">
              Total {tokenSymbol} Royalties Earned
            </div>
          </div>
        </div>

        {unclaimedEarnings > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="text-sm text-orange-800">
              <strong>Unclaimed Earnings Available</strong>
              <br />
              You have {formatCurrency(unclaimedEarnings.toString())} ready to claim from recent trades.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
