
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw } from 'lucide-react';
import { SwapForm } from '@/components/trading/SwapForm';
import { SlippageSettings } from '@/components/trading/SlippageSettings';
import { PriceInfo } from '@/components/trading/PriceInfo';
import { useTradingLogic } from '@/hooks/trading/useTradingLogic';
import { formatCurrency } from '@/hooks/usePoolStats';

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
  const {
    amountIn,
    amountOut,
    tokenIn,
    slippage,
    isReversed,
    price,
    isConnected,
    isLoading,
    error,
    currentSymbolIn,
    currentSymbolOut,
    setAmountIn,
    setTokenIn,
    setSlippage,
    handleSwap,
    handleReverse
  } = useTradingLogic({ tokenAddress, tokenSymbol });

  return (
    <Card className="w-full max-w-md mx-auto bg-surface border-border">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span>Trade {tokenSymbol}</span>
          <div className="flex items-center gap-2">
            <PriceInfo 
              price={price}
              currentSymbolIn={currentSymbolIn}
              currentSymbolOut={currentSymbolOut}
              isReversed={isReversed}
              isConnected={isConnected}
            />
            {price && (
              <div className="text-sm font-mono">
                {formatCurrency(price.price.toString())}
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
            <SwapForm
              amountIn={amountIn}
              amountOut={amountOut}
              tokenIn={tokenIn}
              isReversed={isReversed}
              tokenSymbol={tokenSymbol}
              onAmountInChange={setAmountIn}
              onTokenInChange={setTokenIn}
              onReverse={handleReverse}
            />

            <SlippageSettings
              slippage={slippage}
              onSlippageChange={setSlippage}
            />

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

            <PriceInfo 
              price={price}
              currentSymbolIn={currentSymbolIn}
              currentSymbolOut={currentSymbolOut}
              isReversed={isReversed}
              isConnected={isConnected}
            />
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
