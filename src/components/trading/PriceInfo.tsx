
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatNumber } from '@/hooks/usePoolStats';

interface PriceInfoProps {
  price?: {
    price: number;
    priceChange24h: number;
    volume24h: number;
  };
  currentSymbolIn: string;
  currentSymbolOut: string;
  isReversed: boolean;
  isConnected: boolean;
}

export function PriceInfo({ 
  price, 
  currentSymbolIn, 
  currentSymbolOut, 
  isReversed, 
  isConnected 
}: PriceInfoProps) {
  if (!price) return null;

  return (
    <>
      {/* Live Badge */}
      {isConnected && (
        <Badge variant="outline" className="text-xs mb-2 font-inter font-light">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
          Live
        </Badge>
      )}

      {/* Price Details */}
      <div className="space-y-2 text-xs text-text/70 bg-surface/50 p-3 rounded font-inter">
        <div className="flex justify-between">
          <span className="font-light tracking-wide">Rate</span>
          <span className="font-light">
            1 {currentSymbolIn} = {(isReversed ? price.price : 1/price.price).toFixed(6)} {currentSymbolOut}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-light tracking-wide">24h Volume</span>
          <span className="font-light">{formatNumber(price.volume24h.toString())}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-light tracking-wide">24h Change</span>
          <span className={`flex items-center gap-1 font-light ${price.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {price.priceChange24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(price.priceChange24h).toFixed(2)}%
          </span>
        </div>
      </div>
    </>
  );
}
