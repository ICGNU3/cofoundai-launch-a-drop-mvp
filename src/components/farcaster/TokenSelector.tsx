
import React from 'react';
import { Button } from '@/components/ui/button';

interface Token {
  address: string;
  symbol: string;
  name: string;
}

interface TokenSelectorProps {
  tokens: Token[];
  selectedToken: Token;
  onTokenSelect: (token: Token) => void;
}

export function TokenSelector({ tokens, selectedToken, onTokenSelect }: TokenSelectorProps) {
  return (
    <div className="flex justify-center mb-6">
      <div className="text-center">
        <label className="text-sm font-medium mb-2 block">Select Token</label>
        <div className="flex gap-2 justify-center">
          {tokens.map((token) => (
            <Button
              key={token.address}
              variant={selectedToken.address === token.address ? "default" : "outline"}
              onClick={() => onTokenSelect(token)}
            >
              {token.symbol}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
