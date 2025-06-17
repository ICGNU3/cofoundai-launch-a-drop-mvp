
import React from 'react';
import { SwapCard } from '@/components/SwapCard';
import { mockTrendingCoins } from '@/data/mockPortfolioData';

export function TradingTab() {
  return (
    <div className="space-y-8 font-inter">
      {/* Trading Hub Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-light tracking-tighter text-text mb-2">
          Trading Hub
        </h2>
        <p className="text-lg text-text/70 font-light tracking-wide">
          Trade NEPLUS project tokens with real-time pricing and liquidity
        </p>
      </div>

      {/* Trading Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockTrendingCoins.map((coin) => {
          const mockPoolStats = {
            depth: '125000.50',
            volume24h: '45000.25',
            feeAPR: '8.5'
          };
          return (
            <SwapCard 
              key={coin.id}
              coin={coin}
              poolStats={mockPoolStats}
            />
          );
        })}
      </div>
    </div>
  );
}
