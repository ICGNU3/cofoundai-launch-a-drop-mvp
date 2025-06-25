
import { useCallback } from "react";
import { getCoinHelperText, defaultCoinParams } from "@/lib/zoraCoin";
import { useZoraCoinFactory } from "@/hooks/useZoraCoinFactory";
import type { MintingWorkflowParams } from "./types";

interface MintingActionsCallbacks {
  setCoverIpfs: (ipfs: string) => void;
  setProjectId: (id: string) => void;
  setLoadingMint: (loading: boolean) => void;
  setPoolAddress: (address: string) => void;
  setLastError: (error: string | null) => void;
}

export function useMintingActions(
  params: MintingWorkflowParams,
  callbacks: MintingActionsCallbacks
) {
  const { createCoin, isCreating } = useZoraCoinFactory();

  const handleMintFlow = useCallback(async () => {
    const { 
      setCoverIpfs, 
      setProjectId, 
      setLoadingMint, 
      setPoolAddress,
      setLastError 
    } = callbacks;

    try {
      setLoadingMint(true);
      setLastError(null);

      console.log('Starting Zora token creation flow with params:', params);

      // Use project data to create coin parameters
      const coinParams = {
        name: params.projectData?.projectIdea || defaultCoinParams.name,
        symbol: params.projectData?.projectType?.toUpperCase().slice(0, 4) || defaultCoinParams.symbol,
        initialSupply: defaultCoinParams.supply.toString(),
        uri: params.projectData?.projectIdea ? 
          `data:text/plain;charset=utf-8,${encodeURIComponent(params.projectData.projectIdea)}` : 
          undefined
      };

      console.log('Creating coin with parameters:', coinParams);

      // Create the coin using Zora's factory
      const result = await createCoin(coinParams);
      
      console.log('Coin creation result:', result);

      // Set mock values for compatibility with existing UI
      setCoverIpfs('QmMockCoverIpfsHash');
      setProjectId(result.hash); // Use transaction hash as project ID
      setPoolAddress(result.coinAddress || '0x0000000000000000000000000000000000000000');

      return result;
    } catch (error: any) {
      console.error('Error in mint flow:', error);
      setLastError(error.message || 'Failed to create token');
      throw error;
    } finally {
      setLoadingMint(false);
    }
  }, [params, callbacks, createCoin]);

  return {
    handleMintFlow,
    isCreating,
    helperText: getCoinHelperText()
  };
}
