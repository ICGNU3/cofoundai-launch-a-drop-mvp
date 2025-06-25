
import { useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { useToast } from '@/hooks/use-toast';
import { ZoraCoinFactory, type ZoraCoinParams, type ZoraCoinInfo } from '@/lib/zoraCoinFactory';

export function useZoraCoinFactory() {
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { address, chain } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { toast } = useToast();

  const createCoin = async (params: Omit<ZoraCoinParams, 'creator'>): Promise<{ hash: string; coinAddress?: string }> => {
    if (!address || !chain || !walletClient) {
      throw new Error('Wallet not connected');
    }

    setIsCreating(true);
    try {
      const factory = new ZoraCoinFactory(chain.id, walletClient);
      
      const result = await factory.createCoin({
        ...params,
        creator: address
      });

      toast({
        title: "Coin Created Successfully!",
        description: `Your ${params.name} (${params.symbol}) token has been deployed.`,
      });

      return result;
    } catch (error: any) {
      console.error('Error creating coin:', error);
      toast({
        title: "Coin Creation Failed",
        description: error.message || "Failed to create coin",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const getCoinInfo = async (coinAddress: string): Promise<ZoraCoinInfo | null> => {
    if (!chain) return null;

    setIsLoading(true);
    try {
      const factory = new ZoraCoinFactory(chain.id, walletClient);
      return await factory.getCoinInfo(coinAddress);
    } catch (error) {
      console.error('Error getting coin info:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createCoin,
    getCoinInfo,
    isCreating,
    isLoading,
    isConnected: !!address,
    walletAddress: address,
    chainId: chain?.id
  };
}
