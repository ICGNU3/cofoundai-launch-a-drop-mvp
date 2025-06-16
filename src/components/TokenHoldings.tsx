
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/hooks/usePoolStats';

interface TokenHolding {
  tokenAddress: string;
  symbol: string;
  name: string;
  balance: string;
  valueUSD: number;
  priceChange24h: number;
  logoUrl?: string;
}

interface TokenHoldingsProps {
  holdings: TokenHolding[];
  totalValue: number;
  totalChange24h: number;
}

export function TokenHoldings({ holdings, totalValue, totalChange24h }: TokenHoldingsProps) {
  const isPositiveChange = totalChange24h >= 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Token Holdings
        </CardTitle>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">{formatCurrency(totalValue.toString())}</div>
            <div className={`flex items-center gap-1 text-sm ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
              {isPositiveChange ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {isPositiveChange ? '+' : ''}{totalChange24h.toFixed(2)}%
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {holdings.length === 0 ? (
          <div className="text-center py-8 text-text/70">
            <Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No Holdings Yet</p>
            <p className="text-sm">Start trading to build your portfolio</p>
          </div>
        ) : (
          <div className="space-y-3">
            {holdings.map((holding) => {
              const isTokenPositive = holding.priceChange24h >= 0;
              
              return (
                <div key={holding.tokenAddress} className="flex items-center justify-between p-3 bg-background border rounded-lg">
                  <div className="flex items-center gap-3">
                    {holding.logoUrl ? (
                      <img src={holding.logoUrl} alt={holding.symbol} className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center text-accent font-semibold">
                        {holding.symbol.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold">{holding.symbol}</div>
                      <div className="text-sm text-text/70">{holding.name}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(holding.valueUSD.toString())}</div>
                    <div className="text-sm text-text/70">{holding.balance} {holding.symbol}</div>
                    <div className={`text-xs flex items-center gap-1 ${isTokenPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isTokenPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {isTokenPositive ? '+' : ''}{holding.priceChange24h.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
