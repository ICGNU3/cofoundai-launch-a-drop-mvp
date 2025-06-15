
import { useState } from "react";
import { ethers } from "ethers";

export function useWallet(setField: (k: string, v: any) => void) {
  const [walletProvider, setWalletProvider] = useState<any>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  async function handleConnectWallet() {
    if ((window as any).ethereum) {
      try {
        await (window as any).ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider((window as any).ethereum, "any");
        setWalletProvider(provider);
        const net = await provider.getNetwork();
        if (net.chainId !== 84532) {
          alert("Please switch your wallet to Base Sepolia (chainId 84532).");
          return;
        }
        const signer = provider.getSigner();
        setSigner(signer);
        const address = await signer.getAddress();
        setField("walletAddress", address);
      } catch (err) {
        alert("Failed to connect wallet.");
      }
    } else {
      alert("MetaMask or compatible wallet not installed.");
    }
  }

  return { walletProvider, signer, handleConnectWallet, setSigner };
}
