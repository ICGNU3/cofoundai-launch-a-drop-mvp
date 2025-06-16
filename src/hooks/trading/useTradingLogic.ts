
import { useState, useEffect } from 'react';
import { useUniversalSwap } from '@/hooks/useUniversalSwap';
import { useTokenPrice } from '@/hooks/useTokenPrice';

interface TradingLogicParams {
  tokenAddress: string;
  tokenSymbol: string;
}

export function useTradingLogic({ tokenAddress, tokenSymbol }: TradingLogicParams) {
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

  const calculateOutput = () => {
    if (!amountIn || !price) return '';
    const input = parseFloat(amountIn);
    const output = isReversed ? input * price.price : input / price.price;
    return output.toFixed(6);
  };

  const handleSwap = async () => {
    if (!amountIn) return;
    
    await executeSwap({
      tokenIn: currentTokenIn === 'ETH' ? '0x0000000000000000000000000000000000000000' : currentTokenIn,
      tokenOut: currentTokenOut,
      amountIn,
      slippageTolerance: slippage * 100
    });
  };

  const handleReverse = () => {
    setIsReversed(!isReversed);
    setAmountIn(amountOut);
    setAmountOut(amountIn);
  };

  // Auto-calculate output amount
  useEffect(() => {
    const output = calculateOutput();
    setAmountOut(output);
  }, [amountIn, price, isReversed]);

  return {
    // State
    amountIn,
    amountOut,
    tokenIn,
    slippage,
    isReversed,
    price,
    isConnected,
    isLoading,
    error,
    
    // Computed values
    currentTokenIn,
    currentTokenOut,
    currentSymbolIn,
    currentSymbolOut,
    
    // Actions
    setAmountIn,
    setTokenIn,
    setSlippage,
    handleSwap,
    handleReverse
  };
}
