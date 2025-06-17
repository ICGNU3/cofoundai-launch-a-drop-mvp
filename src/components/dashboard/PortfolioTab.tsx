
import React from 'react';
import { TokenHoldings } from '@/components/TokenHoldings';
import { RecentTradingActivity } from '@/components/RecentTradingActivity';
import { PortfolioMetrics } from '@/components/PortfolioMetrics';
import { mockTokenHoldings, mockTradingActivity, mockPortfolioData } from '@/data/mockPortfolioData';

export function PortfolioTab() {
  const portfolioTotalValue = mockTokenHoldings.reduce((sum, holding) => sum + holding.valueUSD, 0);
  const portfolioDayChange = -0.9; // Mock day change
  const portfolioWeekChange = 9.1; // Mock week change
  const totalTrades = mockTradingActivity.length;

  return (
    <div className="space-y-6">
      <PortfolioMetrics
        totalValue={portfolioTotalValue}
        dayChange={portfolioDayChange}
        weekChange={portfolioWeekChange}
        totalTrades={totalTrades}
        historicalData={mockPortfolioData}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TokenHoldings
          holdings={mockTokenHoldings}
          totalValue={portfolioTotalValue}
          totalChange24h={portfolioDayChange}
        />
        
        <RecentTradingActivity activities={mockTradingActivity} />
      </div>
    </div>
  );
}
