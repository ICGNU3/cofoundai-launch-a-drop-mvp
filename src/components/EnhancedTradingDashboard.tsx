
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WalletConnection } from './WalletConnection';
import { AdvancedChart } from './trading/AdvancedChart';
import { TradingAnalytics } from './TradingAnalytics';
import { TradingInterface } from './TradingInterface';
import { TradingHistory } from './trading/TradingHistory';
import { TokenSelector } from './trading/TokenSelector';
import { OnboardingTooltip } from './onboarding/OnboardingTooltip';
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

// Mock data generators
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
    <div className="space-y-8 font-inter">
      <WalletConnection />
      
      <div data-onboarding="token-selector">
        <TokenSelector
          tokens={tokens}
          selectedToken={selectedToken}
          onTokenSelect={setSelectedToken}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <TradingInterface
            tokenAddress={selectedToken.address}
            tokenSymbol={selectedToken.symbol}
            tokenName={selectedToken.name}
            poolAddress={selectedToken.poolAddress}
          />
          
          <TradingHistory />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="chart" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chart" className="font-inter font-light">Advanced Chart</TabsTrigger>
              <TabsTrigger value="analytics" className="font-inter font-light">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chart" className="space-y-4">
              <div data-onboarding="price-chart">
                <AdvancedChart
                  tokenSymbol={selectedToken.symbol}
                  currentPrice={price?.price || 0.45}
                  priceChange24h={price?.priceChange24h || 5.67}
                  data={priceData}
                />
              </div>
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

      <OnboardingTooltip />
    </div>
  );
}
