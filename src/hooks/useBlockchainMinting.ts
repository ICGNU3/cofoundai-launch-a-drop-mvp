
import { useState } from "react";
import { useZoraMinting, type ZoraCoinParams } from "@/lib/zoraContracts";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import { supabase } from "@/integrations/supabase/client";

export interface BlockchainMintParams {
  coverBase64: string;
  tokenSymbol: string;
  tokenName: string;
  tokenSupply: number;
  userWallet: string;
}

export function useBlockchainMinting() {
  const [isUploading, setIsUploading] = useState(false);
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);
  const { toast } = useToast();
  const { mintCoin, hash, isPending, isConfirming, isSuccess, error } = useZoraMinting();

  const uploadToIPFS = async (dataURL: string, filename: string): Promise<string> => {
    setIsUploading(true);
    try {
      // For development, create a mock IPFS hash
      const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}`;
      console.log(`Mock IPFS upload for ${filename}:`, mockHash);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return mockHash;
    } catch (error) {
      console.error("IPFS upload error:", error);
      throw new Error("Failed to upload to IPFS");
    } finally {
      setIsUploading(false);
    }
  };

  const mintWithZoraAPI = async (params: {
    chainId: number;
    name: string;
    symbol: string;
    totalSupply: number;
    uri: string;
    creatorAddress: string;
  }) => {
    try {
      console.log("Attempting Zora API mint with params:", params);
      
      const { data, error } = await supabase.functions.invoke('mint-zora-token', {
        body: params
      });

      if (error) {
        throw new Error(`Zora API mint failed: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error("Zora API mint error:", error);
      throw error;
    }
  };

  const startMinting = async (params: BlockchainMintParams) => {
    try {
      // Validate wallet address format
      if (!params.userWallet || !params.userWallet.startsWith('0x')) {
        throw new Error("Invalid wallet address format");
      }

      // Step 1: Upload cover art to IPFS (mock for development)
      toast({ title: "Uploading cover art...", description: "Storing your image on IPFS" });
      const coverHash = await uploadToIPFS(params.coverBase64, `${params.tokenSymbol}-cover.png`);
      setIpfsHash(coverHash);

      // Step 2: Create metadata and upload to IPFS (mock for development)
      const metadata = {
        name: params.tokenName,
        description: `${params.tokenName} - A NEPLUS creation token`,
        image: `ipfs://${coverHash}`,
        external_url: window.location.origin,
        attributes: [
          { trait_type: "Symbol", value: params.tokenSymbol },
          { trait_type: "Supply", value: params.tokenSupply.toString() },
          { trait_type: "Platform", value: "NEPLUS" }
        ]
      };

      const metadataHash = `Qm${Math.random().toString(36).substring(2, 15)}`;
      const metadataUri = `ipfs://${metadataHash}`;
      console.log("Mock metadata upload:", metadataUri);

      // Step 3: Try Zora API first, then fallback to direct blockchain interaction
      toast({ title: "Minting token...", description: "Creating your token via Zora API" });
      
      try {
        const zoraResult = await mintWithZoraAPI({
          chainId: 999999999, // Zora Sepolia
          name: params.tokenName,
          symbol: params.tokenSymbol,
          totalSupply: params.tokenSupply,
          uri: metadataUri,
          creatorAddress: params.userWallet,
        });

        console.log("Zora API mint successful:", zoraResult);
        
        return {
          coverHash,
          metadataUri,
          ipfsHash: coverHash,
          tokenAddress: zoraResult.tokenAddress,
          txHash: zoraResult.txHash || "zora-api-mint",
        };
      } catch (zoraError) {
        console.warn("Zora API failed, falling back to direct blockchain mint:", zoraError);
        
        // Fallback to direct blockchain minting
        toast({ title: "Minting on blockchain...", description: "Creating your token directly on chain" });
        
        const zoraCoinParams: ZoraCoinParams = {
          name: params.tokenName,
          symbol: params.tokenSymbol,
          initialSupply: ethers.parseUnits(params.tokenSupply.toString(), 18),
          creator: params.userWallet as `0x${string}`,
          uri: metadataUri,
        };

        await mintCoin(zoraCoinParams);

        return {
          coverHash,
          metadataUri,
          ipfsHash: coverHash,
        };
      }
    } catch (error) {
      console.error("Minting error:", error);
      toast({
        title: "Minting failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    startMinting,
    isUploading,
    ipfsHash,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}
