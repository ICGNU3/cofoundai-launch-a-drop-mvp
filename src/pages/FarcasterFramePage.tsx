
import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { FarcasterFrame } from '@/components/farcaster/FarcasterFrame';

// Mock token data - in production this would come from your database
const DEMO_TOKENS = {
  '0x1234567890123456789012345678901234567890': {
    symbol: 'FILMX',
    name: 'Film Production Token'
  },
  '0x2345678901234567890123456789012345678901': {
    symbol: 'MUSICX',
    name: 'Music Creation Token'
  },
  '0x3456789012345678901234567890123456789012': {
    symbol: 'GAMEX',
    name: 'Game Development Token'
  }
};

export default function FarcasterFramePage() {
  const { tokenAddress } = useParams<{ tokenAddress: string }>();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get('ref');

  if (!tokenAddress || !DEMO_TOKENS[tokenAddress as keyof typeof DEMO_TOKENS]) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Token Not Found</h1>
          <p className="text-text/70">The requested token could not be found.</p>
        </div>
      </div>
    );
  }

  const token = DEMO_TOKENS[tokenAddress as keyof typeof DEMO_TOKENS];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <FarcasterFrame
        tokenAddress={tokenAddress}
        tokenSymbol={token.symbol}
        tokenName={token.name}
        referralCode={referralCode || undefined}
      />
    </div>
  );
}
