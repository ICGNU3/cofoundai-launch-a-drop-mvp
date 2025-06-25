
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

// ERC20 ABI for balance checking
const ERC20_BALANCE_ABI = [
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

interface TokenGatingConfig {
  tokenAddress: string;
  minimumBalance: bigint;
  chainId?: number;
}

export function useTokenGating(config: TokenGatingConfig) {
  const { address, isConnected } = useAccount();
  const [balance, setBalance] = useState<bigint>(0n);
  const [isHolder, setIsHolder] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkTokenBalance = async () => {
      if (!address || !isConnected || !config.tokenAddress) {
        setBalance(0n);
        setIsHolder(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const client = createPublicClient({
          chain: base,
          transport: http()
        });

        const tokenBalance = await client.readContract({
          address: config.tokenAddress as `0x${string}`,
          abi: ERC20_BALANCE_ABI,
          functionName: 'balanceOf',
          args: [address],
        });

        setBalance(tokenBalance);
        setIsHolder(tokenBalance >= config.minimumBalance);
        
        console.log(`Token balance for ${address}: ${tokenBalance.toString()}`);
        console.log(`Is holder: ${tokenBalance >= config.minimumBalance}`);
      } catch (err) {
        console.error('Error checking token balance:', err);
        setError('Failed to verify token balance');
        setBalance(0n);
        setIsHolder(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkTokenBalance();
  }, [address, isConnected, config.tokenAddress, config.minimumBalance]);

  return {
    balance,
    isHolder,
    isLoading,
    error,
    isConnected,
    walletAddress: address
  };
}
