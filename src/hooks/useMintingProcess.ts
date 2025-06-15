
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export type MintingStep = 
  | "ready"
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
    // Cover upload step is now not generative, just upload to Pinata
    { key: "uploading-cover", label: "Uploading Cover Art", description: "Storing cover image on IPFS..." },
    { key: "uploading-metadata", label: "Uploading Metadata", description: "Storing project data on IPFS..." },
    { key: "minting-token", label: "Minting Zora Coin", description: "Creating your NFT on blockchain..." },
    { key: "confirming-transaction", label: "Confirming Transaction", description: "Waiting for blockchain confirmation..." },
    { key: "saving-project", label: "Finalizing Project", description: "Setting up your project hub..." },
  ];

  // Pinata upload util (assume available globally or inject via context/util)
  async function pinFileToIPFS({ dataURL, name }: { dataURL: string; name: string; }): Promise<{ IpfsHash: string; }> {
    // Use fetch to call your Pinata upload endpoint or direct API
    // This is a placeholder; replace with your app implementation.
    // Example:
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

  // Adapted simulateMinting to require props for coverBase64, tokenSymbol
  const simulateMinting = async ({
    coverBase64,
    tokenSymbol,
    ...rest
  }: {
    coverBase64: string;
    tokenSymbol: string;
    [key: string]: any;
  }): Promise<{ tokenAddress: string; txHash: string; coverArtUrl: string; ipfsHash: string }> => {
    setIsMinting(true);
    setCurrentStep("uploading-cover");
    setProgress(10);

    try {
      // 1. Upload Cover Art to Pinata
      setMintingStatus("📤 Uploading cover to IPFS...");
      let ipfsHash: string;
      if (!coverBase64) throw new Error("No cover image to upload!");
      const coverName = `${tokenSymbol}-cover.png`;
      const res = await pinFileToIPFS({ dataURL: coverBase64, name: coverName });
      ipfsHash = res.IpfsHash;
      setProgress(35);

      // 2. Upload metadata (use IPFS hash in token URI)
      setCurrentStep("uploading-metadata");
      setMintingStatus("📡 Uploading metadata to IPFS...");
      setProgress(55);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 3. Mint Token: pass "uri": "ipfs://"+ipfsHash to Zora mint API
      setCurrentStep("minting-token");
      setMintingStatus("🚀 Minting your Zora coin...");
      setProgress(70);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 4. Confirm
      setCurrentStep("confirming-transaction");
      setMintingStatus("⛽ Confirming on blockchain...");
      setProgress(90);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 5. Project saving
      setCurrentStep("saving-project");
      setMintingStatus("💾 Setting up your project hub...");
      setProgress(97);
      await new Promise(resolve => setTimeout(resolve, 800));

      // Generate mock data (replace as needed)
      const mockTokenAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      const coverArtUrl = `https://ipfs.io/ipfs/${ipfsHash}`;

      setCurrentStep("complete");
      setProgress(100);

      return {
        tokenAddress: mockTokenAddress,
        txHash: mockTxHash,
        coverArtUrl,
        ipfsHash
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
