
import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, parseUnits } from 'viem';
import { useToast } from '@/hooks/use-toast';
import { POOL_MANAGER_ADDRESS, PoolCreationParams } from './swapConstants';
import { createPoolKey } from './swapUtils';

export function usePoolCreation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const { toast } = useToast();

  const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
  });

  const createPoolAndAddLiquidity = async (params: PoolCreationParams) => {
    if (!address) {
      setError('Wallet not connected');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Creating Uniswap V4 pool with parameters:', params);

      const poolKey = createPoolKey(params.tokenA, params.tokenB, params.fee);
      
      // Execute the pool creation transaction
      const hash = await writeContract({
        address: POOL_MANAGER_ADDRESS as `0x${string}`,
        abi: [
          {
            name: 'initialize',
            type: 'function',
            inputs: [
              { name: 'key', type: 'tuple', components: [
                { name: 'currency0', type: 'address' },
                { name: 'currency1', type: 'address' },
                { name: 'fee', type: 'uint24' },
                { name: 'tickSpacing', type: 'int24' },
                { name: 'hooks', type: 'address' }
              ]},
              { name: 'sqrtPriceX96', type: 'uint160' }
            ],
            outputs: [{ name: 'tick', type: 'int24' }]
          }
        ] as const,
        functionName: 'initialize',
        args: [poolKey, parseUnits(params.initialPrice, 18)]
      });

      setTxHash(hash);
      
      toast({
        title: "Pool Creation Initiated",
        description: "Your Uniswap V4 pool is being created...",
      });

      return {
        success: true,
        txHash: hash,
        poolAddress: `${poolKey.currency0}-${poolKey.currency1}-${poolKey.fee}`
      };
      
    } catch (err) {
      console.error('Pool creation failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Pool creation failed';
      setError(errorMessage);
      
      toast({
        title: "Pool Creation Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createPoolAndAddLiquidity,
    isLoading: isLoading || isConfirming,
    error,
    txHash,
    receipt
  };
}
