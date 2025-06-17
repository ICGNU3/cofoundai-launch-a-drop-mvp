
import React from 'react';
import { SwapCard } from '@/components/SwapCard';
import { mockTrendingCoins } from '@/data/mockPortfolioData';

export function TradingTab() {
  return (
    <div className="space-y-6 font-inter">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTrendingCoins.map((coin) => {
          // Mock pool stats for each coin
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
