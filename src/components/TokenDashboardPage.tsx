
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ZoraTokenDashboard } from './ZoraTokenDashboard';
import { Search, TrendingUp } from 'lucide-react';

export const TokenDashboardPage: React.FC = () => {
  const [tokenAddress, setTokenAddress] = useState('');
  const [activeToken, setActiveToken] = useState<string | null>(null);

  // Example tokens for quick access
  const exampleTokens = [
    {
      address: '0x1234567890123456789012345678901234567890',
      name: 'Example Token 1',
      symbol: 'EX1'
    },
    {
      address: '0x2345678901234567890123456789012345678901',
      name: 'Example Token 2', 
      symbol: 'EX2'
    }
  ];

  const handleSearch = () => {
    if (tokenAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      setActiveToken(tokenAddress);
    } else {
      alert('Please enter a valid Ethereum address');
    }
  };

  const handleExampleToken = (address: string) => {
    setTokenAddress(address);
    setActiveToken(address);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <TrendingUp className="w-8 h-8" />
            Token Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            View comprehensive data for any ERC-20 token on Base or Ethereum
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Token
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Enter token contract address (0x...)"
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                className="font-mono"
              />
              <Button onClick={handleSearch}>
                Search
              </Button>
            </div>

            {/* Quick Access Examples */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Quick access examples:</p>
              <div className="flex gap-2 flex-wrap">
                {exampleTokens.map((token) => (
                  <Button
                    key={token.address}
                    variant="outline"
                    size="sm"
                    onClick={() => handleExampleToken(token.address)}
                    className="text-xs"
                  >
                    {token.name} ({token.symbol})
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard */}
        {activeToken ? (
          <ZoraTokenDashboard tokenAddress={activeToken} />
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No Token Selected</h3>
              <p className="text-gray-600">
                Enter a token contract address above to view its dashboard
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
