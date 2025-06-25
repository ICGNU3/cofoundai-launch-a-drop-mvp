
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnhancedWalletConnection } from './EnhancedWalletConnection';
import { ExclusiveContent } from './ExclusiveContent';
import { useTokenGating } from '@/hooks/useTokenGating';
import { useWallet } from './WalletConnectionProvider';
import { 
  Lock, 
  Unlock, 
  Search, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  Shield 
} from 'lucide-react';

export const TokenGatedContentPage: React.FC = () => {
  const [tokenAddress, setTokenAddress] = useState('');
  const [minimumTokens, setMinimumTokens] = useState('1');
  const [creatorName, setCreatorName] = useState('Creator');
  const [tokenSymbol, setTokenSymbol] = useState('TOKEN');
  const { isConnected } = useWallet();

  // Configure token gating - using state values
  const tokenGatingConfig = tokenAddress ? {
    tokenAddress,
    minimumBalance: BigInt(minimumTokens) * BigInt(10 ** 18) // Assuming 18 decimals
  } : null;

  const { 
    balance, 
    isHolder, 
    isLoading, 
    error 
  } = useTokenGating(tokenGatingConfig || { tokenAddress: '', minimumBalance: 0n });

  const handleVerify = () => {
    if (!tokenAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      alert('Please enter a valid token contract address');
      return;
    }
    // The hook will automatically check when tokenAddress changes
  };

  const formatBalance = (bal: bigint) => {
    const formatted = Number(bal) / Math.pow(10, 18);
    return formatted.toFixed(4);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <Shield className="w-8 h-8" />
            Token-Gated Exclusive Content
          </h1>
          <p className="text-lg text-gray-600">
            Connect your wallet and verify token ownership to access exclusive content
          </p>
        </div>

        {/* Wallet Connection */}
        <div className="mb-6">
          <EnhancedWalletConnection />
        </div>

        {/* Token Configuration (for demo purposes) */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Configure Token Gating
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Creator Name</label>
                <Input
                  placeholder="Enter creator name"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Token Symbol</label>
                <Input
                  placeholder="e.g. MUSIC"
                  value={tokenSymbol}
                  onChange={(e) => setTokenSymbol(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Token Contract Address</label>
              <Input
                placeholder="0x..."
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                className="font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Minimum Tokens Required</label>
              <Input
                type="number"
                placeholder="1"
                value={minimumTokens}
                onChange={(e) => setMinimumTokens(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleVerify} 
              disabled={!tokenAddress || !isConnected}
              className="w-full"
            >
              Verify Token Holdings
            </Button>
          </CardContent>
        </Card>

        {/* Verification Status */}
        {isConnected && tokenAddress && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isHolder ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
                Verification Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">
                  <Loader2 className="w-6 h-6 mx-auto mb-2 animate-spin text-blue-500" />
                  <p>Verifying token balance...</p>
                </div>
              ) : error ? (
                <div className="text-center py-4">
                  <AlertCircle className="w-6 h-6 mx-auto mb-2 text-red-500" />
                  <p className="text-red-600">{error}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Token Balance:</span>
                    <Badge variant={isHolder ? "default" : "secondary"}>
                      {formatBalance(balance)} {tokenSymbol}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Access Status:</span>
                    <Badge variant={isHolder ? "default" : "destructive"}>
                      {isHolder ? (
                        <>
                          <Unlock className="w-3 h-3 mr-1" />
                          Access Granted
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3 mr-1" />
                          Access Denied
                        </>
                      )}
                    </Badge>
                  </div>
                  {!isHolder && (
                    <p className="text-sm text-gray-600 mt-2">
                      You need at least {minimumTokens} {tokenSymbol} tokens to access exclusive content.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Gated Content */}
        {isConnected && isHolder ? (
          <ExclusiveContent 
            creatorName={creatorName} 
            tokenSymbol={tokenSymbol}
          />
        ) : isConnected && tokenAddress && !isLoading ? (
          <Card>
            <CardContent className="text-center py-12">
              <Lock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Content Locked</h3>
              <p className="text-gray-600 mb-4">
                You need to hold {minimumTokens} or more {tokenSymbol} tokens to access this exclusive content.
              </p>
              <Button 
                variant="outline"
                onClick={() => window.open(`https://zora.co/collect/base/${tokenAddress}`, '_blank')}
              >
                Get {tokenSymbol} Tokens
              </Button>
            </CardContent>
          </Card>
        ) : !isConnected ? (
          <Card>
            <CardContent className="text-center py-12">
              <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
              <p className="text-gray-600">
                Please connect your wallet to verify token ownership and access exclusive content.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Configure Token Gating</h3>
              <p className="text-gray-600">
                Enter a token contract address above to set up token-gated access.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
