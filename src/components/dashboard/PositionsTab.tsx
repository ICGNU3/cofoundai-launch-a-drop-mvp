
import React from 'react';
import { LiquidityDashboard } from '@/components/LiquidityDashboard';
import { mockLiquidityPositions } from '@/data/mockPortfolioData';

interface PositionsTabProps {
  onClaim: (positionId: string) => Promise<void>;
  isClaimLoading: boolean;
}

export function PositionsTab({ onClaim, isClaimLoading }: PositionsTabProps) {
  return (
    <div className="space-y-8 font-inter">
      {/* Positions Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-light tracking-tighter text-text mb-2">
          Liquidity Positions
        </h2>
        <p className="text-lg text-text/70 font-light tracking-wide">
          Manage your liquidity positions and claim rewards
        </p>
      </div>

      {/* Liquidity Dashboard */}
      <LiquidityDashboard 
        positions={mockLiquidityPositions}
        onClaim={onClaim}
        isClaimLoading={isClaimLoading}
      />
    </div>
  );
}
