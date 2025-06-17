
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, HelpCircle } from 'lucide-react';
import { SwapForm } from '@/components/trading/SwapForm';
import { SlippageSettings } from '@/components/trading/SlippageSettings';
import { PriceInfo } from '@/components/trading/PriceInfo';
import { DemoModeToggle } from '@/components/onboarding/DemoModeToggle';
import { WalletEducationModal } from '@/components/onboarding/WalletEducationModal';
import { useTradingLogic } from '@/hooks/trading/useTradingLogic';
import { useOnboarding } from '@/contexts/OnboardingContext';
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
  const { isDemoMode } = useOnboarding();
  const [showWalletEducation, setShowWalletEducation] = useState(false);
  
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

  const handleDemoSwap = () => {
    if (isDemoMode) {
      // Simulate successful demo trade
      console.log('Demo trade executed:', { amountIn, currentSymbolIn, currentSymbolOut });
      // You could add toast notification here
    } else {
      handleSwap();
    }
  };

  return (
    <div className="space-y-4">
      <DemoModeToggle />
      
      <Card 
        data-onboarding="trading-interface"
        className="w-full max-w-md mx-auto bg-surface border-border"
      >
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between font-inter">
            <span className="font-light tracking-tighter">Trade {tokenSymbol}</span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowWalletEducation(true)}
                className="h-8 w-8 p-0"
              >
                <HelpCircle className="w-4 h-4" />
              </Button>
              <PriceInfo 
                price={price}
                currentSymbolIn={currentSymbolIn}
                currentSymbolOut={currentSymbolOut}
                isReversed={isReversed}
                isConnected={isConnected}
              />
              {price && (
                <div className="text-sm font-mono font-light">
                  {formatCurrency(price.price.toString())}
                </div>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="swap" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="swap" className="font-inter font-light">Swap</TabsTrigger>
              <TabsTrigger value="limit" className="font-inter font-light">Limit Order</TabsTrigger>
            </TabsList>
            
            <TabsContent value="swap" className="space-y-4">
              <div data-onboarding="swap-form">
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
              </div>

              <div data-onboarding="slippage-settings">
                <SlippageSettings
                  slippage={slippage}
                  onSlippageChange={setSlippage}
                />
              </div>

              <Button 
                onClick={handleDemoSwap}
                disabled={!amountIn || (isLoading && !isDemoMode)}
                className={`w-full font-inter font-light ${
                  isDemoMode 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-accent text-black hover:bg-accent/90'
                }`}
              >
                {isLoading && !isDemoMode ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                {isDemoMode 
                  ? `Demo: Swap ${currentSymbolIn} for ${currentSymbolOut}`
                  : isLoading 
                  ? 'Swapping...' 
                  : `Swap ${currentSymbolIn} for ${currentSymbolOut}`
                }
              </Button>

              {error && (
                <div className="text-red-400 text-sm p-2 bg-red-400/10 rounded font-inter font-light tracking-wide">
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
              <div className="text-center text-text/70 py-8 font-inter font-light tracking-wide">
                <span>Limit orders coming soon!</span>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <WalletEducationModal 
        isOpen={showWalletEducation}
        onClose={() => setShowWalletEducation(false)}
      />
    </div>
  );
}
