
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useZoraCoinFactory } from '@/hooks/useZoraCoinFactory';
import { Coins, TrendingUp, User, Search } from 'lucide-react';
import type { ZoraCoinInfo } from '@/lib/zoraCoinFactory';

export const ZoraRoyaltyTracker: React.FC = () => {
  const [tokenAddress, setTokenAddress] = useState('');
  const [coinInfo, setCoinInfo] = useState<ZoraCoinInfo | null>(null);
  const [royaltyEarnings, setRoyaltyEarnings] = useState<string>('0');
  const { getCoinInfo, isLoading, walletAddress } = useZoraCoinFactory();

  const handleSearch = async () => {
    if (!tokenAddress) return;
    
    try {
      const info = await getCoinInfo(tokenAddress);
      setCoinInfo(info);
      
      // Mock royalty earnings - in a real implementation, you'd fetch this from Zora's API
      setRoyaltyEarnings('0.125'); // Example earnings in ETH
    } catch (error) {
      console.error('Error fetching coin info:', error);
      setCoinInfo(null);
    }
  };

  const isCreatorView = coinInfo && walletAddress && coinInfo.creator.toLowerCase() === walletAddress.toLowerCase();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-6 h-6" />
            Token Royalty Tracker
          </CardTitle>
          <p className="text-sm text-gray-600">
            Enter a token contract address to view royalty information
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="tokenAddress">Token Contract Address</Label>
              <Input
                id="tokenAddress"
                placeholder="0x..."
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleSearch}
              disabled={!tokenAddress || isLoading}
              className="mt-6"
            >
              {isLoading ? 'Loading...' : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {coinInfo && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="w-5 h-5" />
                Token Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-medium">Name:</span>
                <span className="ml-2">{coinInfo.name}</span>
              </div>
              <div>
                <span className="font-medium">Symbol:</span>
                <span className="ml-2">{coinInfo.symbol}</span>
              </div>
              <div>
                <span className="font-medium">Total Supply:</span>
                <span className="ml-2">{parseInt(coinInfo.totalSupply).toLocaleString()}</span>
              </div>
              <div>
                <span className="font-medium">Creator:</span>
                <code className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                  {coinInfo.creator}
                </code>
                {isCreatorView && (
                  <span className="ml-2 text-green-600 text-sm font-medium">(You)</span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Royalty Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-medium">Royalty Rate:</span>
                <span className="ml-2">5% (Zora Default)</span>
              </div>
              <div>
                <span className="font-medium">Total Earnings:</span>
                <span className="ml-2 text-green-600 font-semibold">
                  {royaltyEarnings} ETH
                </span>
              </div>
              <div>
                <span className="font-medium">Recipient:</span>
                <div className="mt-1">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {coinInfo.creator}
                    </code>
                  </div>
                </div>
              </div>
              
              {isCreatorView && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    <strong>Creator Benefits:</strong> As the token creator, you automatically receive 5% royalties on all secondary market transactions through Zora's protocol.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
