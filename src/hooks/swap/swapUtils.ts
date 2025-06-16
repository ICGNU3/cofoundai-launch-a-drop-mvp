
import { encodeFunctionData } from 'viem';

export const createPoolKey = (tokenA: string, tokenB: string, fee: number) => {
  return {
    currency0: tokenA < tokenB ? tokenA : tokenB,
    currency1: tokenA < tokenB ? tokenB : tokenA,
    fee,
    tickSpacing: 60, // Standard tick spacing for most pools
    hooks: "0x0000000000000000000000000000000000000000" // No hooks for basic pool
  };
};

export const encodeSwapData = (recipient: string, amountIn: bigint) => {
  return encodeFunctionData({
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
      recipient,
      amountIn,
      0n, // Calculate proper minimum based on slippage
      "0x" // Encode proper path
    ]
  });
};
