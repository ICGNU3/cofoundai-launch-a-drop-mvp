
import { useSwapExecution } from './swap/useSwapExecution';
import { usePoolCreation } from './swap/usePoolCreation';

export function useUniversalSwap() {
  const {
    executeSwap,
    isLoading: swapLoading,
    error: swapError,
    txHash: swapTxHash,
    receipt: swapReceipt
  } = useSwapExecution();

  const {
    createPoolAndAddLiquidity,
    isLoading: poolLoading,
    error: poolError,
    txHash: poolTxHash,
    receipt: poolReceipt
  } = usePoolCreation();

  return {
    executeSwap,
    createPoolAndAddLiquidity,
    isLoading: swapLoading || poolLoading,
    error: swapError || poolError,
    txHash: swapTxHash || poolTxHash,
    receipt: swapReceipt || poolReceipt
  };
}

// Re-export types for convenience
export type { SwapParams, PoolCreationParams } from './swap/swapConstants';
