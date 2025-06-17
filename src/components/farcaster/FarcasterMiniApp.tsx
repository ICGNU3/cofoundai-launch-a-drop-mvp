
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TradingInterface } from '../TradingInterface';
import { ShareablePriceCard } from './ShareablePriceCard';
import { ReferralSystem } from './ReferralSystem';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import { formatCurrency, formatPercentage } from '@/hooks/usePoolStats';
import { Share, TrendingUp, Users, Zap } from 'lucide-react';

interface FarcasterMiniAppProps {
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  frameData?: {
    castHash?: string;
    fid?: string;
    messageBytes?: string;
  };
}

export function FarcasterMiniApp({ 
  tokenAddress, 
  tokenSymbol, 
  tokenName,
  frameData 
}: FarcasterMiniAppProps) {
  const [activeTab, setActiveTab] = useState<'trade' | 'share' | 'refer'>('trade');
  const [amount, setAmount] = useState('');
  const { price, isConnected } = useTokenPrice(tokenAddress);

  const tabs = [
    { id: 'trade', label: 'Trade', icon: TrendingUp },
    { id: 'share', label: 'Share', icon: Share },
    { id: 'refer', label: 'Refer', icon: Users }
  ];

  return (
    <div className="max-w-md mx-auto bg-background border border-border rounded-xl overflow-hidden font-inter">
      {/* Mini App Header */}
      <div className="bg-gradient-to-r from-accent/20 to-accent/10 p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-light text-lg tracking-tighter text-text">{tokenSymbol}</h3>
            <p className="text-sm text-text/70 font-light tracking-wide">{tokenName}</p>
          </div>
          <div className="text-right">
            {price && (
              <>
                <div className="font-mono font-light text-text tracking-tighter">
                  {formatCurrency(price.price.toString())}
                </div>
                <div className={`text-sm flex items-center gap-1 font-light ${
                  price.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  <TrendingUp className="w-3 h-3" />
                  {formatPercentage(Math.abs(price.priceChange24h).toString())}
                </div>
              </>
            )}
          </div>
        </div>
        
        {isConnected && (
          <Badge variant="outline" className="mt-2 font-light">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
            Live Feed
          </Badge>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-border bg-surface">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-light tracking-wide transition-colors ${
                activeTab === tab.id
                  ? 'text-accent border-b-2 border-accent bg-accent/5'
                  : 'text-text/70 hover:text-text hover:bg-surface/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'trade' && (
          <div className="space-y-4">
            <TradingInterface
              tokenAddress={tokenAddress}
              tokenSymbol={tokenSymbol}
              tokenName={tokenName}
            />
            
            {frameData && (
              <div className="text-xs text-text/50 bg-surface/50 p-2 rounded font-light tracking-wide">
                Trading from Farcaster frame • Cast: {frameData.castHash?.slice(0, 8)}...
              </div>
            )}
          </div>
        )}

        {activeTab === 'share' && (
          <ShareablePriceCard
            tokenAddress={tokenAddress}
            tokenSymbol={tokenSymbol}
            tokenName={tokenName}
            price={price}
          />
        )}

        {activeTab === 'refer' && (
          <ReferralSystem
            tokenAddress={tokenAddress}
            tokenSymbol={tokenSymbol}
            frameData={frameData}
          />
        )}
      </div>

      {/* Frame Action Buttons */}
      <div className="border-t border-border bg-surface/30 p-3">
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 font-light tracking-wide">
            <Zap className="w-3 h-3 mr-1" />
            Quick Buy
          </Button>
          <Button size="sm" variant="outline" className="flex-1 font-light tracking-wide">
            <Share className="w-3 h-3 mr-1" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}
