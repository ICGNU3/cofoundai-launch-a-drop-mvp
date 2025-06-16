
import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, parseUnits, encodeFunctionData } from 'viem';
import { useToast } from '@/hooks/use-toast';

interface SwapParams {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  recipient?: string;
  slippageTolerance?: number; // in basis points, default 50 = 0.5%
}

interface PoolCreationParams {
  tokenA: string;
  tokenB: string;
  fee: number; // fee tier in basis points
  initialPrice: string;
  liquidityAmount: string;
}

// Universal Router address on Base/Zora testnet
const UNIVERSAL_ROUTER_ADDRESS = "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD";

// Pool Manager address for Uniswap V4 (Base testnet)
const POOL_MANAGER_ADDRESS = "0x38EB8B22Df3Ae7fb21e92881151B365Df14ba967";

export function useUniversalSwap() {
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

      // Encode the pool initialization data
      const poolKey = {
        currency0: params.tokenA < params.tokenB ? params.tokenA : params.tokenB,
        currency1: params.tokenA < params.tokenB ? params.tokenB : params.tokenA,
        fee: params.fee,
        tickSpacing: 60, // Standard tick spacing for most pools
        hooks: "0x0000000000000000000000000000000000000000" // No hooks for basic pool
      };

      // Calculate initial liquidity parameters
      const liquidityAmount = parseEther(params.liquidityAmount);
      
      // Encode the initialization call
      const initializeData = encodeFunctionData({
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
        ],
        functionName: 'initialize',
        args: [poolKey, parseUnits(params.initialPrice, 18)]
      });

      // Execute the pool creation transaction
      const result = await writeContract({
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
        ],
        functionName: 'initialize',
        args: [poolKey, parseUnits(params.initialPrice, 18)]
      });

      setTxHash(result);
      
      toast({
        title: "Pool Creation Initiated",
        description: "Your Uniswap V4 pool is being created...",
      });

      return {
        success: true,
        txHash: result,
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
      const inputs = encodeFunctionData({
        abi: [
          {
            name: 'v4Swap',
            type: 'function',
            inputs: [
              { name: 'recipient', type: 'address' },
              { name: 'amountIn', type: 'uint256' },
              { name: 'amountOutMinimum', type: 'uint256' },
              { name: 'path', type: 'bytes' }
            ]
          }
        ],
        functionName: 'v4Swap',
        args: [
          params.recipient || address,
          amountIn,
          0n, // Calculate proper minimum based on slippage
          "0x" // Encode proper path
        ]
      });

      const result = await writeContract({
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
        ],
        functionName: 'execute',
        args: [commands, [inputs]]
      });

      setTxHash(result);
      
      toast({
        title: "Swap Initiated",
        description: "Your swap is being processed...",
      });

      return {
        success: true,
        txHash: result
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
    createPoolAndAddLiquidity,
    isLoading: isLoading || isConfirming,
    error,
    txHash,
    receipt
  };
}
