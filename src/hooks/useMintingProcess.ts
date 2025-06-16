
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useBlockchainMinting } from "./useBlockchainMinting";

export type MintingStep = 
  | "ready"
  | "uploading-cover"
  | "uploading-metadata"
  | "minting-token"
  | "confirming-transaction"
  | "saving-project"
  | "complete"
  | "error";

export const useMintingProcess = () => {
  const [currentStep, setCurrentStep] = useState<MintingStep>("ready");
  const [mintingStatus, setMintingStatus] = useState<string>("Ready to mint...");
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  
  const {
    startMinting,
    isUploading,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error,
    ipfsHash
  } = useBlockchainMinting();

  const mintingSteps = [
    { key: "uploading-cover", label: "Uploading Cover Art", description: "Storing cover image on IPFS..." },
    { key: "uploading-metadata", label: "Uploading Metadata", description: "Storing project metadata on IPFS..." },
    { key: "minting-token", label: "Minting Zora Coin", description: "Creating your token on blockchain..." },
    { key: "confirming-transaction", label: "Confirming Transaction", description: "Waiting for blockchain confirmation..." },
    { key: "saving-project", label: "Finalizing Project", description: "Setting up your project hub..." },
  ];

  const simulateMinting = async ({
    coverBase64,
    tokenSymbol,
    tokenName = "NEPLUS Coin",
    tokenSupply = 1000000,
    userWallet,
  }: {
    coverBase64: string;
    tokenSymbol: string;
    tokenName?: string;
    tokenSupply?: number;
    userWallet?: string;
  }): Promise<{ tokenAddress: string; txHash: string; coverArtUrl: string; ipfsHash: string }> => {
    
    if (!userWallet) {
      throw new Error("Wallet address is required for minting");
    }

    try {
      setCurrentStep("uploading-cover");
      setMintingStatus("📤 Uploading cover to IPFS...");
      setProgress(10);

      const result = await startMinting({
        coverBase64,
        tokenSymbol,
        tokenName,
        tokenSupply,
        userWallet,
      });

      // Update progress based on blockchain transaction state
      if (isUploading) {
        setCurrentStep("uploading-metadata");
        setMintingStatus("📋 Uploading metadata...");
        setProgress(35);
      }

      if (isPending) {
        setCurrentStep("minting-token");
        setMintingStatus("⛽ Waiting for wallet confirmation...");
        setProgress(55);
      }

      if (isConfirming) {
        setCurrentStep("confirming-transaction");
        setMintingStatus("⏳ Confirming on blockchain...");
        setProgress(80);
      }

      if (isSuccess && hash) {
        setCurrentStep("saving-project");
        setMintingStatus("💾 Setting up your project hub...");
        setProgress(95);

        // Wait a bit for the transaction to be fully processed
        await new Promise(resolve => setTimeout(resolve, 2000));

        setCurrentStep("complete");
        setProgress(100);

        return {
          tokenAddress: "0x" + hash.slice(-40), // Extract contract address from tx hash (simplified)
          txHash: hash,
          coverArtUrl: `https://ipfs.io/ipfs/${result.ipfsHash}`,
          ipfsHash: result.ipfsHash,
        };
      }

      throw new Error("Transaction failed or was cancelled");

    } catch (error) {
      console.error("Minting error:", error);
      setCurrentStep("error");
      setMintingStatus("❌ Minting failed");
      
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Mint Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const completeMinting = () => {
    setCurrentStep("complete");
    setMintingStatus("🎉 Token launched successfully!");
    toast({
      title: "Launch Successful! 🚀",
      description: "Your token is now live on the blockchain!",
    });
  };

  const resetMinting = () => {
    setCurrentStep("ready");
    setMintingStatus("Ready to mint...");
    setProgress(0);
  };

  return {
    isMinting: isPending || isConfirming,
    currentStep,
    mintingStatus,
    progress,
    mintingSteps,
    simulateMinting,
    completeMinting,
    resetMinting,
    // Expose blockchain state
    blockchainError: error,
    transactionHash: hash,
  };
};
