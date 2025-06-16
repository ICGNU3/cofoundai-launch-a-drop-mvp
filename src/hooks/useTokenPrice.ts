
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface TokenPrice {
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  lastUpdated: number;
}

interface PriceData {
  [tokenAddress: string]: TokenPrice;
}

// Mock price data for demo - replace with real API calls
const MOCK_PRICES: PriceData = {
  'ETH': {
    price: 3245.67,
    priceChange24h: 2.34,
    volume24h: 15234567,
    marketCap: 389234567890,
    lastUpdated: Date.now()
  },
  'USDC': {
    price: 1.00,
    priceChange24h: 0.01,
    volume24h: 8934567,
    marketCap: 32234567890,
    lastUpdated: Date.now()
  }
};

export function useTokenPrice(tokenAddress: string) {
  const [price, setPrice] = useState<TokenPrice | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Simulate real-time price updates
  useEffect(() => {
    if (!tokenAddress) return;

    const updatePrice = () => {
      const basePrice = MOCK_PRICES[tokenAddress] || MOCK_PRICES['ETH'];
      const volatility = 0.02; // 2% volatility
      const change = (Math.random() - 0.5) * volatility;
      
      setPrice(prev => ({
        ...basePrice,
        price: basePrice.price * (1 + change),
        priceChange24h: prev?.priceChange24h || basePrice.priceChange24h,
        lastUpdated: Date.now()
      }));
    };

    // Initial price
    updatePrice();
    setIsConnected(true);

    // Update every 3 seconds for demo
    const interval = setInterval(updatePrice, 3000);

    return () => {
      clearInterval(interval);
      setIsConnected(false);
    };
  }, [tokenAddress]);

  return {
    price,
    isConnected,
    isLoading: !price
  };
}

export function useRealTimePrices(tokenAddresses: string[]) {
  return useQuery({
    queryKey: ['realTimePrices', tokenAddresses],
    queryFn: async () => {
      // In a real implementation, this would call a price API like CoinGecko or DEX aggregator
      const prices: PriceData = {};
      
      for (const address of tokenAddresses) {
        const basePrice = MOCK_PRICES[address] || MOCK_PRICES['ETH'];
        const volatility = 0.01;
        const change = (Math.random() - 0.5) * volatility;
        
        prices[address] = {
          ...basePrice,
          price: basePrice.price * (1 + change),
          lastUpdated: Date.now()
        };
      }
      
      return prices;
    },
    refetchInterval: 5000, // Update every 5 seconds
    staleTime: 1000, // Consider stale after 1 second
  });
}
