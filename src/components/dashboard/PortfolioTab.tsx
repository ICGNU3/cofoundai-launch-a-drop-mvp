
import React from 'react';
import { TokenHoldings } from '@/components/TokenHoldings';
import { RecentTradingActivity } from '@/components/RecentTradingActivity';
import { PortfolioMetrics } from '@/components/PortfolioMetrics';
import { mockTokenHoldings, mockTradingActivity, mockPortfolioData } from '@/data/mockPortfolioData';

export function PortfolioTab() {
  const portfolioTotalValue = mockTokenHoldings.reduce((sum, holding) => sum + holding.valueUSD, 0);
  const portfolioDayChange = -0.9;
  const portfolioWeekChange = 9.1;
  const totalTrades = mockTradingActivity.length;

  return (
    <div className="space-y-8 font-inter">
      {/* Portfolio Overview Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-light tracking-tighter text-text mb-2">
          Portfolio Overview
        </h2>
        <p className="text-lg text-text/70 font-light tracking-wide">
          Track your holdings and performance across all NEPLUS tokens
        </p>
      </div>

      {/* Metrics Section */}
      <PortfolioMetrics
        totalValue={portfolioTotalValue}
        dayChange={portfolioDayChange}
        weekChange={portfolioWeekChange}
        totalTrades={totalTrades}
        historicalData={mockPortfolioData}
      />
      
      {/* Holdings and Activity Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
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
