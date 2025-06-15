import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export type MintingStep = 
  | "ready"
  | "uploading-cover"
  | "generating-art" 
  | "uploading-metadata"
  | "minting-token"
  | "confirming-transaction"
  | "saving-project"
  | "complete"
  | "error";

export const useMintingProcess = () => {
  const [isMinting, setIsMinting] = useState(false);
  const [currentStep, setCurrentStep] = useState<MintingStep>("ready");
  const [mintingStatus, setMintingStatus] = useState<string>("Ready to mint...");
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const mintingSteps = [
    { key: "uploading-cover", label: "Uploading Cover Art", description: "Storing cover image on IPFS..." },
    { key: "uploading-metadata", label: "Uploading Metadata", description: "Storing project data on IPFS..." },
    { key: "minting-token", label: "Minting Zora Coin", description: "Creating your NFT on blockchain..." },
    { key: "confirming-transaction", label: "Confirming Transaction", description: "Waiting for blockchain confirmation..." },
    { key: "saving-project", label: "Finalizing Project", description: "Setting up your project hub..." },
  ];

  async function pinFileToIPFS({ dataURL, name }: { dataURL: string; name: string; }): Promise<{ IpfsHash: string; }> {
    const formData = new FormData();
    formData.append("file", await fetch(dataURL).then(r => r.blob()), name);
    const res = await fetch("/api/pinata/upload", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Pinata upload failed");
    const json = await res.json();
    return { IpfsHash: json.IpfsHash };
  }

  const simulateMinting = async ({
    coverBase64,
    tokenSymbol,
    tokenName = "Drop",
    tokenSupply = 1000000,
    userWallet,
    ...rest
  }: {
    coverBase64: string;
    tokenSymbol: string;
    tokenName?: string;
    tokenSupply?: number;
    userWallet?: string;
    [key: string]: any;
  }): Promise<{ tokenAddress: string; txHash: string; coverArtUrl: string; ipfsHash: string }> => {
    setIsMinting(true);
    setCurrentStep("uploading-cover");
    setProgress(10);

    try {
      setMintingStatus("📤 Uploading cover to IPFS...");
      if (!coverBase64) throw new Error("No cover image to upload!");
      const coverName = `${tokenSymbol}-cover.png`;
      const res = await pinFileToIPFS({ dataURL: coverBase64, name: coverName });
      const ipfsHash = res.IpfsHash;
      setProgress(35);

      // --------- ZORA MINTING HERE -----------
      setCurrentStep("uploading-metadata");
      setMintingStatus("⚡ Creating Zora V4 coin...");
      setProgress(55);

      // Compose Zora body as in your instructions
      const zoraBody = {
        chainId: 84532,
        name: tokenName,
        symbol: tokenSymbol,
        totalSupply: tokenSupply,
        uri: `ipfs://${ipfsHash}`,
        creatorAddress: userWallet,
      };

      // Call Supabase Edge Function (never expose Zora key!)
      const zoraRes = await fetch("/functions/v1/mint-zora-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(zoraBody),
      });
      if (!zoraRes.ok) {
        const errText = await zoraRes.text();
        throw new Error(`Zora minting failed: ${errText}`);
      }
      const zoraData = await zoraRes.json();
      if (!zoraData.tokenAddress) throw new Error("No tokenAddress returned from Zora");

      setCurrentStep("minting-token");
      setMintingStatus("🚀 Minting your Zora coin on chain...");
      setProgress(70);
      await new Promise(resolve => setTimeout(resolve, 1200));

      setCurrentStep("confirming-transaction");
      setMintingStatus("⛽ Confirming on blockchain...");
      setProgress(90);
      await new Promise(resolve => setTimeout(resolve, 800));

      setCurrentStep("saving-project");
      setMintingStatus("💾 Setting up your project hub...");
      setProgress(97);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Compose returned values
      const tokenAddress = zoraData.tokenAddress;
      const txHash = zoraData.txHash || "";
      const coverArtUrl = `https://ipfs.io/ipfs/${ipfsHash}`;

      setCurrentStep("complete");
      setProgress(100);

      return {
        tokenAddress,
        txHash,
        coverArtUrl,
        ipfsHash,
      };
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
    } finally {
      setIsMinting(false);
    }
  };

  const completeMinting = () => {
    setCurrentStep("complete");
    setMintingStatus("🎉 Drop launched successfully!");
    toast({
      title: "Launch Successful! 🚀",
      description: "Your drop is now live and ready to share!",
    });
  };

  const resetMinting = () => {
    setCurrentStep("ready");
    setMintingStatus("Ready to mint...");
    setProgress(0);
    setIsMinting(false);
  };

  return {
    isMinting,
    currentStep,
    mintingStatus,
    progress,
    mintingSteps,
    simulateMinting,
    completeMinting,
    resetMinting,
  };
};
