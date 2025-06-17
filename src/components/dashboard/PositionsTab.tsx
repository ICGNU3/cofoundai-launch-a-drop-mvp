
import React from 'react';
import { LiquidityDashboard } from '@/components/LiquidityDashboard';
import { mockLiquidityPositions } from '@/data/mockPortfolioData';

interface PositionsTabProps {
  onClaim: (positionId: string) => Promise<void>;
  isClaimLoading: boolean;
}

export function PositionsTab({ onClaim, isClaimLoading }: PositionsTabProps) {
  return (
    <LiquidityDashboard 
      positions={mockLiquidityPositions}
      onClaim={onClaim}
      isClaimLoading={isClaimLoading}
    />
  );
}
