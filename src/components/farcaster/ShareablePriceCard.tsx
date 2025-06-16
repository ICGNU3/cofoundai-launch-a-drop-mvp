
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatPercentage } from '@/hooks/usePoolStats';
import { Copy, Download, Share, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';

interface TokenPrice {
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
}

interface ShareablePriceCardProps {
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  price?: TokenPrice | null;
}

export function ShareablePriceCard({ 
  tokenAddress, 
  tokenSymbol, 
  tokenName, 
  price 
}: ShareablePriceCardProps) {
  const [customMessage, setCustomMessage] = useState('');
  const [cardStyle, setCardStyle] = useState<'minimal' | 'detailed' | 'viral'>('detailed');

  const generateFrameUrl = () => {
    const baseUrl = window.location.origin;
    const frameUrl = `${baseUrl}/frame/${tokenAddress}`;
    return frameUrl;
  };

  const generateShareText = () => {
    if (!price) return `Check out ${tokenSymbol} on NEPLUS! 🚀`;
    
    const change = price.priceChange24h >= 0 ? 'up' : 'down';
    const emoji = price.priceChange24h >= 0 ? '🚀' : '📉';
    
    return customMessage || 
      `${tokenSymbol} is ${change} ${formatPercentage(Math.abs(price.priceChange24h).toString())} today! ${emoji}\n\n` +
      `Current price: ${formatCurrency(price.price.toString())}\n` +
      `Trade on NEPLUS 👇`;
  };

  const shareToFarcaster = () => {
    const text = encodeURIComponent(generateShareText());
    const frameUrl = encodeURIComponent(generateFrameUrl());
    const farcasterUrl = `https://warpcast.com/~/compose?text=${text}&embeds[]=${frameUrl}`;
    window.open(farcasterUrl, '_blank');
  };

  const copyFrameUrl = () => {
    navigator.clipboard.writeText(generateFrameUrl());
    // In a real app, you'd show a toast here
  };

  const downloadCard = () => {
    // Generate a downloadable image of the price card
    // This would typically use html2canvas or similar
    console.log('Downloading price card...');
  };

  const cardStyles = [
    { id: 'minimal', label: 'Minimal', emoji: '📊' },
    { id: 'detailed', label: 'Detailed', emoji: '📈' },
    { id: 'viral', label: 'Viral', emoji: '🚀' }
  ];

  return (
    <div className="space-y-4">
      {/* Style Selector */}
      <div>
        <label className="text-sm font-medium mb-2 block">Card Style</label>
        <div className="flex gap-2">
          {cardStyles.map((style) => (
            <Button
              key={style.id}
              variant={cardStyle === style.id ? "default" : "outline"}
              size="sm"
              onClick={() => setCardStyle(style.id as any)}
              className="flex-1"
            >
              <span className="mr-1">{style.emoji}</span>
              {style.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Preview Card */}
      <Card className="relative overflow-hidden">
        {cardStyle === 'viral' && (
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-accent/10" />
        )}
        
        <CardContent className="p-6 relative">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">{tokenSymbol}</h3>
              <p className="text-sm text-text/70">{tokenName}</p>
            </div>
            {cardStyle === 'viral' && (
              <Badge className="bg-accent text-black">
                <Sparkles className="w-3 h-3 mr-1" />
                Trending
              </Badge>
            )}
          </div>

          {price && (
            <>
              <div className="text-3xl font-bold mb-2">
                {formatCurrency(price.price.toString())}
              </div>
              
              <div className={`flex items-center gap-2 mb-4 ${
                price.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {price.priceChange24h >= 0 ? 
                  <TrendingUp className="w-4 h-4" /> : 
                  <TrendingDown className="w-4 h-4" />
                }
                <span className="font-semibold">
                  {price.priceChange24h >= 0 ? '+' : ''}
                  {formatPercentage(price.priceChange24h.toString())}
                </span>
                <span className="text-text/70">24h</span>
              </div>

              {cardStyle !== 'minimal' && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-text/70">24h Volume</div>
                    <div className="font-semibold">
                      {formatCurrency(price.volume24h.toString())}
                    </div>
                  </div>
                  <div>
                    <div className="text-text/70">Market Cap</div>
                    <div className="font-semibold">
                      {formatCurrency(price.marketCap.toString())}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {cardStyle === 'viral' && (
            <div className="mt-4 text-center">
              <div className="text-sm font-medium text-accent">
                🎯 Join the NEPLUS revolution!
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Custom Message */}
      <div>
        <label className="text-sm font-medium mb-2 block">Custom Message (Optional)</label>
        <Input
          placeholder="Add your own message..."
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          className="bg-card border-border"
        />
      </div>

      {/* Share Actions */}
      <div className="space-y-3">
        <Button onClick={shareToFarcaster} className="w-full bg-purple-600 hover:bg-purple-700">
          <Share className="w-4 h-4 mr-2" />
          Share on Farcaster
        </Button>
        
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={copyFrameUrl}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Frame URL
          </Button>
          <Button variant="outline" onClick={downloadCard}>
            <Download className="w-4 h-4 mr-2" />
            Download Card
          </Button>
        </div>
      </div>

      {/* Frame URL Display */}
      <div className="text-xs text-text/50 bg-surface/50 p-3 rounded break-all">
        Frame URL: {generateFrameUrl()}
      </div>
    </div>
  );
}
