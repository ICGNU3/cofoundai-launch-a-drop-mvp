
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpDown, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { useUniversalSwap } from '@/hooks/useUniversalSwap';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import { formatCurrency, formatNumber } from '@/hooks/usePoolStats';

interface TradingInterfaceProps {
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  poolAddress?: string;
}

export function TradingInterface({ 
  tokenAddress, 
  tokenSymbol, 
  tokenName,
  poolAddress 
}: TradingInterfaceProps) {
  const [amountIn, setAmountIn] = useState('');
  const [amountOut, setAmountOut] = useState('');
  const [tokenIn, setTokenIn] = useState('ETH');
  const [slippage, setSlippage] = useState(0.5);
  const [isReversed, setIsReversed] = useState(false);

  const { executeSwap, isLoading, error } = useUniversalSwap();
  const { price, isConnected } = useTokenPrice(isReversed ? tokenAddress : tokenIn);

  const currentTokenIn = isReversed ? tokenAddress : tokenIn;
  const currentTokenOut = isReversed ? tokenIn : tokenAddress;
  const currentSymbolIn = isReversed ? tokenSymbol : tokenIn;
  const currentSymbolOut = isReversed ? tokenIn : tokenSymbol;

  const handleSwap = async () => {
    if (!amountIn) return;
    
    await executeSwap({
      tokenIn: currentTokenIn === 'ETH' ? '0x0000000000000000000000000000000000000000' : currentTokenIn,
      tokenOut: currentTokenOut,
      amountIn,
      slippageTolerance: slippage * 100 // Convert to basis points
    });
  };

  const handleReverse = () => {
    setIsReversed(!isReversed);
    setAmountIn(amountOut);
    setAmountOut(amountIn);
  };

  const calculateOutput = () => {
    if (!amountIn || !price) return '';
    const input = parseFloat(amountIn);
    const output = isReversed ? input * price.price : input / price.price;
    return output.toFixed(6);
  };

  // Auto-calculate output amount
  React.useEffect(() => {
    const output = calculateOutput();
    setAmountOut(output);
  }, [amountIn, price, isReversed]);

  return (
    <Card className="w-full max-w-md mx-auto bg-surface border-border">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span>Trade {tokenSymbol}</span>
          <div className="flex items-center gap-2">
            {isConnected && (
              <Badge variant="outline" className="text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                Live
              </Badge>
            )}
            {price && (
              <div className="text-sm font-mono">
                {formatCurrency(price.price.toString())}
                <span className={`ml-1 text-xs ${price.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {price.priceChange24h >= 0 ? <TrendingUp className="inline w-3 h-3" /> : <TrendingDown className="inline w-3 h-3" />}
                  {Math.abs(price.priceChange24h).toFixed(2)}%
                </span>
              </div>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="swap" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="swap">Swap</TabsTrigger>
            <TabsTrigger value="limit">Limit Order</TabsTrigger>
          </TabsList>
          
          <TabsContent value="swap" className="space-y-4">
            {/* Token Input */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-text/70">
                <span>From</span>
                <span>Balance: 0.0</span>
              </div>
              <div className="flex gap-2">
                <select 
                  value={currentSymbolIn} 
                  onChange={(e) => {
                    if (isReversed) {
                      // Can't change the token when reversed to project token
                      return;
                    }
                    setTokenIn(e.target.value);
                  }}
                  disabled={isReversed}
                  className="px-3 py-2 bg-card border border-border rounded text-text min-w-[80px]"
                >
                  <option value="ETH">ETH</option>
                  <option value="USDC">USDC</option>
                  {isReversed && <option value={tokenSymbol}>{tokenSymbol}</option>}
                </select>
                <Input
                  type="number"
                  placeholder="0.0"
                  value={amountIn}
                  onChange={(e) => setAmountIn(e.target.value)}
                  className="flex-1 bg-card border-border text-text"
                />
              </div>
            </div>

            {/* Swap Direction Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReverse}
                className="rounded-full p-2"
              >
                <ArrowUpDown className="w-4 h-4" />
              </Button>
            </div>

            {/* Token Output */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-text/70">
                <span>To</span>
                <span>Balance: 0.0</span>
              </div>
              <div className="flex gap-2">
                <div className="px-3 py-2 bg-card border border-border rounded text-text min-w-[80px] flex items-center">
                  {currentSymbolOut}
                </div>
                <Input
                  type="number"
                  placeholder="0.0"
                  value={amountOut}
                  readOnly
                  className="flex-1 bg-card border-border text-text"
                />
              </div>
            </div>

            {/* Slippage Settings */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-text/70">Slippage Tolerance</span>
              <div className="flex gap-1">
                {[0.1, 0.5, 1.0].map((value) => (
                  <Button
                    key={value}
                    variant={slippage === value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSlippage(value)}
                    className="h-6 px-2 text-xs"
                  >
                    {value}%
                  </Button>
                ))}
                <Input
                  type="number"
                  value={slippage}
                  onChange={(e) => setSlippage(parseFloat(e.target.value) || 0.5)}
                  className="w-16 h-6 px-1 text-xs"
                  step="0.1"
                  min="0.1"
                  max="50"
                />
              </div>
            </div>

            {/* Swap Button */}
            <Button 
              onClick={handleSwap}
              disabled={!amountIn || isLoading}
              className="w-full bg-accent text-black hover:bg-accent/90"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {isLoading ? 'Swapping...' : `Swap ${currentSymbolIn} for ${currentSymbolOut}`}
            </Button>

            {error && (
              <div className="text-red-400 text-sm p-2 bg-red-400/10 rounded">
                {error}
              </div>
            )}

            {/* Price Info */}
            {price && (
              <div className="space-y-2 text-xs text-text/70 bg-surface/50 p-3 rounded">
                <div className="flex justify-between">
                  <span>Rate</span>
                  <span>1 {currentSymbolIn} = {(isReversed ? price.price : 1/price.price).toFixed(6)} {currentSymbolOut}</span>
                </div>
                <div className="flex justify-between">
                  <span>24h Volume</span>
                  <span>{formatNumber(price.volume24h.toString())}</span>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="limit" className="space-y-4">
            <div className="text-center text-text/70 py-8">
              <span>Limit orders coming soon!</span>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
