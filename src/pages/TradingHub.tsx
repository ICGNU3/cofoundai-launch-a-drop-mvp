import React from 'react';
import { EnhancedTradingDashboard } from '@/components/EnhancedTradingDashboard';
import { ModernNavigation } from '@/components/ModernNavigation';

// Mock token data - in production this would come from your database
const DEMO_TOKENS = [
  {
    address: '0x1234567890123456789012345678901234567890',
    symbol: 'FILMX',
    name: 'Film Production Token',
    poolAddress: '0xpool1',
    logoUrl: undefined
  },
  {
    address: '0x2345678901234567890123456789012345678901',
    symbol: 'MUSICX',
    name: 'Music Creation Token',
    poolAddress: '0xpool2',
    logoUrl: undefined
  },
  {
    address: '0x3456789012345678901234567890123456789012',
    symbol: 'GAMEX',
    name: 'Game Development Token',
    poolAddress: '0xpool3',
    logoUrl: undefined
  },
  {
    address: '0x4567890123456789012345678901234567890123',
    symbol: 'ARTX',
    name: 'Digital Art Collective',
    poolAddress: '0xpool4',
    logoUrl: undefined
  }
];

export default function TradingHub() {
  return (
    <div className="min-h-screen bg-background">
      <ModernNavigation />
      
      <main className="container mx-auto px-4 py-8 font-inter">
        {/* Centered Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-light tracking-tighter mb-4 text-text">
            Enhanced Trading Hub
          </h1>
          <p className="text-text/70 text-lg font-light tracking-wide max-w-2xl mx-auto">
            Trade NEPLUS project tokens with real-time price updates, live liquidity, and comprehensive analytics
          </p>
        </div>

        <EnhancedTradingDashboard 
          tokens={DEMO_TOKENS}
          featuredToken={DEMO_TOKENS[0]}
        />
      </main>
    </div>
  );
}
