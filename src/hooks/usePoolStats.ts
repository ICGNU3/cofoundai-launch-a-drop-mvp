
import { useQuery } from '@tanstack/react-query';
import { fetchPoolStats } from '../api/pool-stats';

interface PoolStatsData {
  depth: string;
  volume24h: string;
  feeAPR: string;
  totalVolumeUSD: string;
  totalRoyalties: string;
  unclaimedRoyalties: string;
  lpCount: number;
  recentRoyalties: Array<{
    amount: string;
    blockTime: string;
    payer: string;
  }>;
  dailyStats: Array<{
    date: number;
    volume: string;
    royalties: string;
    swaps: number;
  }>;
  lastUpdated: string;
}

export function usePoolStats(coinAddress: string | null) {
  return useQuery({
    queryKey: ['poolStats', coinAddress],
    queryFn: async (): Promise<PoolStatsData> => {
      if (!coinAddress) {
        throw new Error('Coin address is required');
      }

      return fetchPoolStats(coinAddress);
    },
    enabled: !!coinAddress,
    staleTime: 15000, // 15 seconds
    gcTime: 60000, // 1 minute (formerly cacheTime)
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function formatCurrency(value: string, currency: string = 'USD'): string {
  const num = parseFloat(value);
  if (isNaN(num)) return '0';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(num);
}

export function formatPercentage(value: string): string {
  const num = parseFloat(value);
  if (isNaN(num)) return '0%';
  
  return `${num.toFixed(2)}%`;
}

export function formatNumber(value: string): string {
  const num = parseFloat(value);
  if (isNaN(num)) return '0';
  
  if (num >= 1e9) {
    return `${(num / 1e9).toFixed(2)}B`;
  } else if (num >= 1e6) {
    return `${(num / 1e6).toFixed(2)}M`;
  } else if (num >= 1e3) {
    return `${(num / 1e3).toFixed(2)}K`;
  }
  
  return num.toFixed(2);
}
