
import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { useToast } from '@/hooks/use-toast';
import { UNIVERSAL_ROUTER_ADDRESS, SwapParams } from './swapConstants';
import { encodeSwapData } from './swapUtils';

export function useSwapExecution() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  
  const { address, chain } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { toast } = useToast();

  const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
  });

  const executeSwap = async (params: SwapParams) => {
    if (!address) {
      setError('Wallet not connected');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const amountIn = parseEther(params.amountIn);
      const slippage = params.slippageTolerance || 50; // 0.5% default
      
      console.log('Executing swap via Universal Router:', {
        tokenIn: params.tokenIn,
        tokenOut: params.tokenOut,
        amountIn: params.amountIn,
        recipient: params.recipient || address,
        slippage
      });

      // Encode Universal Router V2 command for V4 swap
      const commands = "0x00"; // V4_SWAP command
      const inputs = encodeSwapData(params.recipient || address, amountIn);

      const hash = await writeContractAsync({
        address: UNIVERSAL_ROUTER_ADDRESS as `0x${string}`,
        abi: [
          {
            name: 'execute',
            type: 'function',
            inputs: [
              { name: 'commands', type: 'bytes' },
              { name: 'inputs', type: 'bytes[]' }
            ]
          }
        ] as const,
        functionName: 'execute',
        args: [commands, [inputs]],
        chain,
        account: address
      });

      setTxHash(hash);
      
      toast({
        title: "Swap Initiated",
        description: "Your swap is being processed...",
      });

      return {
        success: true,
        txHash: hash
      };
      
    } catch (err) {
      console.error('Swap failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Swap failed';
      setError(errorMessage);
      
      toast({
        title: "Swap Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    executeSwap,
    isLoading: isLoading || isConfirming,
    error,
    txHash,
    receipt
  };
}
