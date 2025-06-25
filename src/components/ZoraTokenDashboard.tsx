
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTokenData } from '@/hooks/useTokenData';
import { ExternalLink, Copy, Users, DollarSign, Hash, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ZoraTokenDashboardProps {
  tokenAddress: string;
  chainId?: number;
}

export const ZoraTokenDashboard: React.FC<ZoraTokenDashboardProps> = ({ 
  tokenAddress, 
  chainId = 8453 // Default to Base
}) => {
  const { tokenData, isLoading, error } = useTokenData(tokenAddress, chainId);
  const { toast } = useToast();

  const copyAddress = () => {
    navigator.clipboard.writeText(tokenAddress);
    toast({
      title: "Address Copied",
      description: "Token contract address copied to clipboard",
    });
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Not Available';
    return `$${price.toFixed(6)}`;
  };

  const formatSupply = (supply: string) => {
    const num = parseFloat(supply);
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toLocaleString();
  };

  const getZoraMarketplaceUrl = () => {
    const baseUrl = chainId === 8453 
      ? 'https://zora.co/collect/base' 
      : 'https://zora.co/collect/eth';
    return `${baseUrl}/${tokenAddress}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Token Data...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Error Loading Token Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Token Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Contract Address</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                  {tokenAddress.slice(0, 6)}...{tokenAddress.slice(-4)}
                </code>
                <Button variant="ghost" size="sm" onClick={copyAddress}>
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Token Info</span>
              </div>
              <div>
                <p className="font-semibold">{tokenData?.name || 'Unknown Token'}</p>
                <Badge variant="outline">{tokenData?.symbol || 'N/A'}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="w-4 h-4" />
              Total Supply
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tokenData?.totalSupply ? formatSupply(tokenData.totalSupply) : 'N/A'}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {tokenData?.totalSupply ? `${parseFloat(tokenData.totalSupply).toLocaleString()} tokens` : 'Data unavailable'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Current Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(tokenData?.price || 0)}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {tokenData?.priceChange24h !== undefined ? (
                <span className={tokenData.priceChange24h >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {tokenData.priceChange24h >= 0 ? '+' : ''}{tokenData.priceChange24h.toFixed(2)}% (24h)
                </span>
              ) : (
                'Price tracking unavailable'
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              Supporters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tokenData?.holderCount || 0}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Unique wallet holders
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Marketplace & Explorer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2"
            onClick={() => window.open(getZoraMarketplaceUrl(), '_blank')}
          >
            <ExternalLink className="w-4 h-4" />
            View on Zora Marketplace
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2"
            onClick={() => window.open(`https://basescan.org/token/${tokenAddress}`, '_blank')}
          >
            <ExternalLink className="w-4 h-4" />
            View on BaseScan
          </Button>

          {tokenData?.uniswapPoolAddress && (
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={() => window.open(`https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=${tokenAddress}`, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
              Trade on Uniswap
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
