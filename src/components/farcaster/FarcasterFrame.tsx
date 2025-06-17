
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import { formatCurrency, formatPercentage } from '@/hooks/usePoolStats';
import { TrendingUp, TrendingDown, Zap, Share } from 'lucide-react';

interface FarcasterFrameProps {
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  referralCode?: string;
  action?: 'buy' | 'sell' | 'share';
}

export function FarcasterFrame({ 
  tokenAddress, 
  tokenSymbol, 
  tokenName, 
  referralCode,
  action = 'buy'
}: FarcasterFrameProps) {
  const { price, isConnected } = useTokenPrice(tokenAddress);

  const handleFrameAction = (actionType: string) => {
    const frameData = {
      action: actionType,
      tokenAddress,
      tokenSymbol,
      referralCode
    };
    
    console.log('Frame action:', frameData);
    
    const baseUrl = window.location.origin;
    const url = referralCode 
      ? `${baseUrl}/trade/${tokenAddress}?ref=${referralCode}`
      : `${baseUrl}/trade/${tokenAddress}`;
    
    window.open(url, '_blank');
  };

  return (
    <div className="w-full max-w-sm mx-auto aspect-[1.91/1] bg-gradient-to-br from-background via-surface to-background border border-border rounded-lg overflow-hidden font-inter">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-accent/20 to-accent/10 p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-light text-lg tracking-tighter text-text">{tokenSymbol}</h3>
              <p className="text-sm text-text/70 truncate font-light tracking-wide">{tokenName}</p>
            </div>
            {isConnected && (
              <Badge variant="outline" className="text-xs font-light">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1" />
                Live
              </Badge>
            )}
          </div>
        </div>

        {/* Price Display */}
        <div className="flex-1 p-4 flex flex-col justify-center">
          {price ? (
            <div className="text-center">
              <div className="text-2xl font-light tracking-tighter text-text mb-1">
                {formatCurrency(price.price.toString())}
              </div>
              <div className={`flex items-center justify-center gap-1 text-sm font-light ${
                price.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {price.priceChange24h >= 0 ? 
                  <TrendingUp className="w-3 h-3" /> : 
                  <TrendingDown className="w-3 h-3" />
                }
                {price.priceChange24h >= 0 ? '+' : ''}
                {formatPercentage(price.priceChange24h.toString())}
                <span className="text-text/50">24h</span>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-xl font-light text-text/50 tracking-wide">Loading...</div>
            </div>
          )}

          {referralCode && (
            <div className="text-center mt-2">
              <Badge variant="outline" className="text-xs font-light">
                🎁 Referral Bonus Available
              </Badge>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-border bg-surface/30">
          <div className="grid grid-cols-2 gap-2">
            <Button 
              size="sm" 
              className="bg-green-600 hover:bg-green-700 text-white font-light tracking-wide"
              onClick={() => handleFrameAction('buy')}
            >
              <Zap className="w-3 h-3 mr-1" />
              Quick Buy
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="font-light tracking-wide"
              onClick={() => handleFrameAction('share')}
            >
              <Share className="w-3 h-3 mr-1" />
              Share
            </Button>
          </div>
          
          <Button 
            size="sm" 
            variant="ghost" 
            className="w-full mt-2 text-xs font-light tracking-wide"
            onClick={() => handleFrameAction('open')}
          >
            Open in NEPLUS →
          </Button>
        </div>
      </div>
    </div>
  );
}
