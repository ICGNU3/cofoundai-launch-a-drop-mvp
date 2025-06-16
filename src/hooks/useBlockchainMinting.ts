
import { useState } from "react";
import { useZoraMinting, type ZoraCoinParams } from "@/lib/zoraContracts";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";

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
      const formData = new FormData();
      const blob = await fetch(dataURL).then(r => r.blob());
      formData.append("file", blob, filename);

      const response = await fetch("/api/pinata/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload to IPFS");
      }

      const result = await response.json();
      return result.IpfsHash;
    } finally {
      setIsUploading(false);
    }
  };

  const startMinting = async (params: BlockchainMintParams) => {
    try {
      // Step 1: Upload cover art to IPFS
      toast({ title: "Uploading cover art...", description: "Storing your image on IPFS" });
      const coverHash = await uploadToIPFS(params.coverBase64, `${params.tokenSymbol}-cover.png`);
      setIpfsHash(coverHash);

      // Step 2: Create metadata and upload to IPFS
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

      const metadataBlob = new Blob([JSON.stringify(metadata)], { type: "application/json" });
      const metadataFile = new File([metadataBlob], `${params.tokenSymbol}-metadata.json`);
      const metadataFormData = new FormData();
      metadataFormData.append("file", metadataFile);

      const metadataResponse = await fetch("/api/pinata/upload", {
        method: "POST",
        body: metadataFormData,
      });

      if (!metadataResponse.ok) {
        throw new Error("Failed to upload metadata to IPFS");
      }

      const metadataResult = await metadataResponse.json();
      const metadataUri = `ipfs://${metadataResult.IpfsHash}`;

      // Step 3: Mint on Zora using blockchain transaction
      toast({ title: "Minting on blockchain...", description: "Creating your token on Zora" });
      
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
