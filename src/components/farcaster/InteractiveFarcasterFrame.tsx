
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import { formatCurrency, formatPercentage } from '@/hooks/usePoolStats';
import { TrendingUp, TrendingDown, Heart, MessageCircle, Share, ShoppingCart, Users } from 'lucide-react';

interface InteractiveFarcasterFrameProps {
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  frameData?: {
    castHash?: string;
    fid?: string;
    messageBytes?: string;
  };
  onInteraction?: (action: 'like' | 'comment' | 'share' | 'buy' | 'join') => void;
}

export function InteractiveFarcasterFrame({ 
  tokenAddress, 
  tokenSymbol, 
  tokenName,
  frameData,
  onInteraction
}: InteractiveFarcasterFrameProps) {
  const [interactions, setInteractions] = useState({
    likes: 24,
    comments: 8,
    shares: 12,
    purchases: 3
  });
  const [userInteracted, setUserInteracted] = useState({
    liked: false,
    shared: false
  });

  const { price, isConnected } = useTokenPrice(tokenAddress);

  const handleInteraction = (action: 'like' | 'comment' | 'share' | 'buy' | 'join') => {
    onInteraction?.(action);
    
    // Update local state for immediate feedback
    if (action === 'like') {
      setInteractions(prev => ({
        ...prev,
        likes: prev.likes + (userInteracted.liked ? -1 : 1)
      }));
      setUserInteracted(prev => ({ ...prev, liked: !prev.liked }));
    } else if (action === 'share') {
      setInteractions(prev => ({
        ...prev,
        shares: prev.shares + 1
      }));
      setUserInteracted(prev => ({ ...prev, shared: true }));
    } else if (action === 'buy') {
      setInteractions(prev => ({
        ...prev,
        purchases: prev.purchases + 1
      }));
    }

    // Post to Farcaster frame endpoint
    fetch('/api/farcaster/frame-action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        tokenAddress,
        frameData,
        timestamp: Date.now()
      })
    }).catch(console.error);
  };

  return (
    <div className="w-full max-w-sm mx-auto aspect-[1.91/1] bg-gradient-to-br from-background via-surface to-background border border-border rounded-lg overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header with Live Badge */}
        <div className="bg-gradient-to-r from-accent/20 to-accent/10 p-3 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">{tokenSymbol}</h3>
              <p className="text-sm text-text/70 truncate">{tokenName}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              {isConnected && (
                <Badge variant="outline" className="text-xs">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1" />
                  Live
                </Badge>
              )}
              <Badge variant="secondary" className="text-xs">
                <Users className="w-3 h-3 mr-1" />
                {interactions.purchases} buyers
              </Badge>
            </div>
          </div>
        </div>

        {/* Price Display */}
        <div className="flex-1 p-3 flex flex-col justify-center">
          {price ? (
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">
                {formatCurrency(price.price.toString())}
              </div>
              <div className={`flex items-center justify-center gap-1 text-sm ${
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
              <div className="text-xl font-bold text-text/50">Loading...</div>
            </div>
          )}
        </div>

        {/* Interactive Buttons */}
        <div className="p-3 border-t bg-surface/30 space-y-2">
          {/* Main Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button 
              size="sm" 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => handleInteraction('buy')}
            >
              <ShoppingCart className="w-3 h-3 mr-1" />
              Quick Buy
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleInteraction('join')}
            >
              <Users className="w-3 h-3 mr-1" />
              Join Community
            </Button>
          </div>

          {/* Engagement Actions */}
          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              <button
                onClick={() => handleInteraction('like')}
                className={`flex items-center gap-1 text-sm ${
                  userInteracted.liked ? 'text-red-500' : 'text-text/70'
                } hover:text-red-500 transition-colors`}
              >
                <Heart className={`w-4 h-4 ${userInteracted.liked ? 'fill-current' : ''}`} />
                {interactions.likes}
              </button>
              
              <button
                onClick={() => handleInteraction('comment')}
                className="flex items-center gap-1 text-sm text-text/70 hover:text-accent transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                {interactions.comments}
              </button>
              
              <button
                onClick={() => handleInteraction('share')}
                className={`flex items-center gap-1 text-sm ${
                  userInteracted.shared ? 'text-accent' : 'text-text/70'
                } hover:text-accent transition-colors`}
              >
                <Share className="w-4 h-4" />
                {interactions.shares}
              </button>
            </div>
            
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-xs px-2"
              onClick={() => handleInteraction('share')}
            >
              Open in NEPLUS →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
