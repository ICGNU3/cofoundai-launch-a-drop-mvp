
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/car
import { TradingInterface } from './TradingInterface';
import { useRealTimePrices } from '@/hooks/useTokenPrice';
import { formatCurrency, formatNumber, formatPercentage } from '@/hooks/usePoolStats';
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';

interface LiveTradingDashboardProps {
  tokens: Array<{
    address: string;
    symbol: string;
    name: string;
    poolAddress?: string;
    logoUrl?: string;
  }>;
  featuredToken?: {
    address: string;
    symbol: string;
    name: string;
    poolAddress?: string;
  };
}

export function LiveTradingDashboard({ tokens, featuredToken }: LiveTradingDashboardProps) {
  const tokenAddresses = tokens.map(t => t.address);
  const { data: prices, isLoading } = useRealTimePrices(tokenAddresses);

  return (
    <div className="space-y-6">
      {/* Featured Trading Interface */}
      {featuredToken && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Trade {featuredToken.symbol}</h2>
            <TradingInterface
              tokenAddress={featuredToken.address}
              tokenSymbol={featuredToken.symbol}
              tokenName={featuredToken.name}
              poolAddress={featuredToken.poolAddress}
            />
          </div>
          
          {/* Live Statistics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Live Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-accent" />
                    <span className="text-sm text-text/70">Price</span>
                  </div>
                  <div className="text-xl font-bold">
                    {prices?.[featuredToken.address] ? 
                      formatCurrency(prices[featuredToken.address].price.toString()) : 
                      'Loading...'
                    }
                  </div>
                  {prices?.[featuredToken.address] && (
                    <div className={`text-sm flex items-center gap-1 ${
                      prices[featuredToken.address].priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {prices[featuredToken.address].priceChange24h >= 0 ? 
                        <TrendingUp className="w-3 h-3" /> : 
                        <TrendingDown className="w-3 h-3" />
                      }
                      {formatPercentage(Math.abs(prices[featuredToken.address].priceChange24h).toString())}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-accent" />
                    <span className="text-sm text-text/70">24h Volume</span>
                  </div>
                  <div className="text-xl font-bold">
                    {prices?.[featuredToken.address] ? 
                      formatNumber(prices[featuredToken.address].volume24h.toString()) : 
                      'Loading...'
                    }
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* All Tokens Price Grid */}
      <div>
        <h3 className="text-lg font-semibold mb-4">All NEPLUS Tokens</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tokens.map((token) => {
            const tokenPrice = prices?.[token.address];
            
            return (
              <Card key={token.address} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3">
                    {token.logoUrl ? (
                      <img src={token.logoUrl} alt={token.symbol} className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-sm font-bold">
                        {token.symbol.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold">{token.symbol}</div>
                      <div className="text-sm text-text/70">{token.name}</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {isLoading ? (
                    <div className="text-center text-text/70">Loading...</div>
                  ) : tokenPrice ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-text/70">Price</span>
                        <span className="font-mono font-semibold">
                          {formatCurrency(tokenPrice.price.toString())}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-text/70">24h Change</span>
                        <span className={`font-mono ${
                          tokenPrice.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {tokenPrice.priceChange24h >= 0 ? '+' : ''}
                          {formatPercentage(tokenPrice.priceChange24h.toString())}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-text/70">Volume</span>
                        <span className="font-mono">
                          {formatNumber(tokenPrice.volume24h.toString())}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-text/70">No data</div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
