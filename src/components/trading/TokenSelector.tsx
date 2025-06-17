
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Token {
  address: string;
  symbol: string;
  name: string;
  logoUrl?: string;
}

interface TokenSelectorProps {
  tokens: Token[];
  selectedToken: Token;
  onTokenSelect: (token: Token) => void;
}

export function TokenSelector({ tokens, selectedToken, onTokenSelect }: TokenSelectorProps) {
  return (
    <Card className="bg-surface border-border">
      <CardHeader>
        <CardTitle>Select Token to Trade</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tokens.map((token) => (
            <Card
              key={token.address}
              className={`cursor-pointer transition-all ${
                selectedToken.address === token.address
                  ? 'ring-2 ring-accent bg-accent/10'
                  : 'hover:bg-surface/80'
              }`}
              onClick={() => onTokenSelect(token)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  {token.logoUrl ? (
                    <img src={token.logoUrl} alt={token.symbol} className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-sm font-bold text-black">
                      {token.symbol.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold">{token.symbol}</div>
                    <div className="text-xs text-text/70 truncate">{token.name}</div>
                  </div>
                </div>
                {selectedToken.address === token.address && (
                  <Badge className="mt-2 bg-accent text-black">
                    Selected
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
