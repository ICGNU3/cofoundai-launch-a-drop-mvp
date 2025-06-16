
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { WalletConnection } from './WalletConnection';
import { PriceChart } from './PriceChart';
import { TradingAnalytics } from './TradingAnalytics';
import { TradingInterface } from './TradingInterface';
import { useTokenPrice } from '@/hooks/useTokenPrice';

interface Token {
  address: string;
  symbol: string;
  name: string;
  poolAddress?: string;
  logoUrl?: string;
}

interface EnhancedTradingDashboardProps {
  tokens: Token[];
  featuredToken: Token;
}

// Mock data for charts and analytics
const generateMockPriceData = (basePrice: number) => {
  const data = [];
  const now = Date.now();
  
  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now - (i * 60 * 60 * 1000)).toISOString();
    const volatility = 0.02;
    const change = (Math.random() - 0.5) * volatility;
    const price = basePrice * (1 + change);
    
    data.push({
      timestamp,
      price,
      volume: Math.random() * 100000 + 50000
    });
  }
  
  return data;
};

const generateMockAnalytics = () => {
  const volumeHistory = [];
  
  for (let i = 11; i >= 0; i--) {
    const time = new Date(Date.now() - (i * 2 * 60 * 60 * 1000)).toLocaleTimeString([], { hour: '2-digit' });
    volumeHistory.push({
      time,
      volume: Math.random() * 500000 + 100000
    });
  }
  
  return {
    volume24h: 2450000,
    trades24h: 1247,
    uniqueTraders24h: 384,
    liquidity: 5680000,
    volumeHistory
  };
};

export function EnhancedTradingDashboard({ tokens, featuredToken }: EnhancedTradingDashboardProps) {
  const [selectedToken, setSelectedToken] = useState(featuredToken);
  const { price } = useTokenPrice(selectedToken.address);
  
  const priceData = generateMockPriceData(price?.price || 0.45);
  const analyticsData = generateMockAnalytics();

  return (
    <div className="space-y-8">
      {/* Wallet Connection */}
      <WalletConnection />
      
      {/* Token Selector */}
      <Card className="bg-surface border-border">
        <CardHeader>
          <CardTitle>Select Token to Trade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tokens.map((token) => (
              <Card
                key={token.address}
                className={`cursor-pointer transition-all ${
                  selectedToken.address === token.address
                    ? 'ring-2 ring-accent bg-accent/10'
                    : 'hover:bg-surface/80'
                }`}
                onClick={() => setSelectedToken(token)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    {token.logoUrl ? (
                      <img src={token.logoUrl} alt={token.symbol} className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-sm font-bold text-black">
                        {token.symbol.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold">{token.symbol}</div>
                      <div className="text-xs text-text/70 truncate">{token.name}</div>
                    </div>
                  </div>
                  {selectedToken.address === token.address && (
                    <Badge className="mt-2 bg-accent text-black">
                      Selected
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Trading Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trading Interface */}
        <div className="lg:col-span-1">
          <TradingInterface
            tokenAddress={selectedToken.address}
            tokenSymbol={selectedToken.symbol}
            tokenName={selectedToken.name}
            poolAddress={selectedToken.poolAddress}
          />
        </div>

        {/* Charts and Analytics */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="chart" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chart">Price Chart</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chart" className="space-y-4">
              <PriceChart
                tokenSymbol={selectedToken.symbol}
                currentPrice={price?.price || 0.45}
                priceChange24h={price?.priceChange24h || 5.67}
                data={priceData}
              />
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-4">
              <TradingAnalytics
                tokenSymbol={selectedToken.symbol}
                data={analyticsData}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
