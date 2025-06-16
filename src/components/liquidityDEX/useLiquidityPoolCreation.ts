
import { useState, useEffect } from "react";
import { useUniversalSwap } from "@/hooks/useUniversalSwap";

type Props = {
  tokenSymbol: string;
  tokenAddress: string;
  pairedToken: { symbol: string; address: string };
  poolAddress?: string;
  onPoolCreated?: (poolAddress: string) => void;
};

export function useLiquidityPoolCreation({
  tokenSymbol,
  tokenAddress,
  pairedToken,
  poolAddress,
  onPoolCreated,
}: Props) {
  const [step, setStep] = useState(poolAddress ? 3 : 1);
  const [liquidityAmount, setLiquidityAmount] = useState<string>("1000");
  const [isCreatingPool, setIsCreatingPool] = useState(false);
  
  const { createPoolAndAddLiquidity, isLoading, error, txHash, receipt } = useUniversalSwap();

  // Auto-advance to step 3 when pool is created
  useEffect(() => {
    if (poolAddress) {
      setStep(3);
    }
  }, [poolAddress]);

  // Handle successful pool creation
  useEffect(() => {
    if (receipt && isCreatingPool) {
      setIsCreatingPool(false);
      const newPoolAddress = `${tokenAddress}-${pairedToken.address}-3000`;
      onPoolCreated?.(newPoolAddress);
      setStep(3);
    }
  }, [receipt, isCreatingPool, tokenAddress, pairedToken.address, onPoolCreated]);

  const handleCreatePool = async () => {
    if (!liquidityAmount || !tokenAddress) return;
    
    setIsCreatingPool(true);
    try {
      await createPoolAndAddLiquidity({
        tokenA: tokenAddress,
        tokenB: pairedToken.address,
        fee: 3000, // 0.3% fee tier
        initialPrice: "1000000000000000000", // 1:1 ratio
        liquidityAmount
      });
    } catch (error) {
      console.error('Failed to create pool:', error);
      setIsCreatingPool(false);
    }
  };

  return {
    step,
    setStep,
    liquidityAmount,
    setLiquidityAmount,
    isCreatingPool,
    handleCreatePool,
    isLoading,
    error,
    txHash
  };
}
