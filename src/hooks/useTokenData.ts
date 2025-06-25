
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createPublicClient, http } from 'viem';
import { base, mainnet } from 'viem/chains';

interface TokenData {
  name: string;
  symbol: string;
  totalSupply: string;
  price: number;
  priceChange24h: number;
  holderCount: number;
  uniswapPoolAddress?: string;
  zoraListingUrl?: string;
}

// ERC20 ABI for basic token info
const ERC20_ABI = [
  {
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export function useTokenData(tokenAddress: string, chainId: number = 8453) {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create public client based on chain
  const getPublicClient = () => {
    const chain = chainId === 1 ? mainnet : base;
    return createPublicClient({
      chain,
      transport: http()
    });
  };

  // Fetch basic token info from blockchain
  const fetchTokenInfo = async () => {
    try {
      const client = getPublicClient();
      
      const [name, symbol, totalSupply] = await Promise.all([
        client.readContract({
          address: tokenAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'name',
        }),
        client.readContract({
          address: tokenAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'symbol',
        }),
        client.readContract({
          address: tokenAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'totalSupply',
        }),
      ]);

      return {
        name: name as string,
        symbol: symbol as string,
        totalSupply: totalSupply.toString(),
      };
    } catch (error) {
      console.error('Error fetching token info:', error);
      throw new Error('Failed to fetch token information');
    }
  };

  // Fetch price data (mock implementation - replace with real API)
  const fetchPriceData = async () => {
    // Mock price data - in production, integrate with:
    // - Zora API for marketplace data
    // - Uniswap subgraph for DEX data
    // - CoinGecko/CoinMarketCap for price data
    return {
      price: Math.random() * 10, // Random price for demo
      priceChange24h: (Math.random() - 0.5) * 20, // Random change for demo
      holderCount: Math.floor(Math.random() * 1000) + 10, // Random holder count
    };
  };

  // Fetch Zora marketplace data (mock implementation)
  const fetchZoraData = async () => {
    // Mock implementation - in production, use Zora API
    // https://docs.zora.co/docs/zora-api/intro
    return {
      zoraListingUrl: `https://zora.co/collect/${chainId === 1 ? 'eth' : 'base'}/${tokenAddress}`,
      uniswapPoolAddress: Math.random() > 0.5 ? `0x${Math.random().toString(16).substr(2, 40)}` : undefined,
    };
  };

  useEffect(() => {
    const loadTokenData = async () => {
      if (!tokenAddress) return;

      setIsLoading(true);
      setError(null);

      try {
        const [basicInfo, priceData, zoraData] = await Promise.all([
          fetchTokenInfo(),
          fetchPriceData(),
          fetchZoraData(),
        ]);

        setTokenData({
          ...basicInfo,
          ...priceData,
          ...zoraData,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load token data');
      } finally {
        setIsLoading(false);
      }
    };

    loadTokenData();
  }, [tokenAddress, chainId]);

  return { tokenData, isLoading, error };
}

// Hook for real-time price updates
export function useTokenPrice(tokenAddress: string) {
  return useQuery({
    queryKey: ['tokenPrice', tokenAddress],
    queryFn: async () => {
      // Mock implementation - replace with real price API
      return {
        price: Math.random() * 10,
        volume24h: Math.random() * 100000,
        marketCap: Math.random() * 1000000,
        priceChange24h: (Math.random() - 0.5) * 20,
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    enabled: !!tokenAddress,
  });
}
