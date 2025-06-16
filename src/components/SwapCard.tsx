
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUniversalSwap } from '@/hooks/useUniversalSwap';
import { formatCurrency, formatNumber } from '@/hooks/usePoolStats';

interface SwapCardProps {
  coin: {
    id: string;
    symbol: string;
    name: string;
    logoUrl?: string;
  };
  poolStats: {
    depth: string;
    volume24h: string;
    feeAPR: string;
  };
}

export function SwapCard({ coin, poolStats }: SwapCardProps) {
  const [amountIn, setAmountIn] = useState('');
  const [tokenIn, setTokenIn] = useState('ETH');
  const { executeSwap, isLoading, error } = useUniversalSwap();

  const handleSwap = async () => {
    if (!amountIn) return;
    
    await executeSwap({
      tokenIn: tokenIn === 'ETH' ? '0x0000000000000000000000000000000000000000' : tokenIn,
      tokenOut: coin.id,
      amountIn
    });
  };

  return (
    <Card className="bg-surface border-border">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          {coin.logoUrl ? (
            <img src={coin.logoUrl} alt={coin.symbol} className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-sm font-bold">
              {coin.symbol.charAt(0)}
            </div>
          )}
          <div>
            <div className="text-lg font-semibold text-headline">{coin.symbol}</div>
            <div className="text-sm text-text/70">{coin.name}</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-text/70">Depth</div>
            <div className="font-mono text-text">{formatCurrency(poolStats.depth)}</div>
          </div>
          <div>
            <div className="text-text/70">24h Volume</div>
            <div className="font-mono text-text">{formatNumber(poolStats.volume24h)}</div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex gap-2">
            <select 
              value={tokenIn} 
              onChange={(e) => setTokenIn(e.target.value)}
              className="px-3 py-2 bg-card border border-border rounded text-text"
            >
              <option value="ETH">ETH</option>
              <option value="USDC">USDC</option>
            </select>
            <Input
              type="number"
              placeholder="0.0"
              value={amountIn}
              onChange={(e) => setAmountIn(e.target.value)}
              className="flex-1 bg-card border-border text-text"
            />
          </div>
          
          <Button 
            onClick={handleSwap}
            disabled={!amountIn || isLoading}
            className="w-full bg-accent text-black hover:bg-accent/90"
          >
            {isLoading ? 'Swapping...' : 'Swap / Support'}
          </Button>
          
          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
