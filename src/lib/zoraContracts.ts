
import { ethers } from "ethers";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";

// Zora V4 contract addresses - use environment variables or fallbacks
export const ZORA_CONTRACTS = {
  FACTORY: (import.meta.env.VITE_ZORA_FACTORY_ADDRESS || "0x777777C338d93e2C7adf08D102d45CA7CC4Ed021") as `0x${string}`,
  CREATOR_IMPL: "0x3678862f04290E565cCA2EF163BAeb92Bb76790C" as `0x${string}`,
} as const;

// USDC contract address for Zora Sepolia
export const USDC_ADDRESS = (import.meta.env.VITE_USDC_ADDRESS || "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238") as `0x${string}`;

// Network configuration
export const ZORA_SEPOLIA_CHAIN_ID = parseInt(import.meta.env.VITE_CHAIN_ID || "999999999");
export const ZORA_SEPOLIA_RPC = import.meta.env.VITE_RPC_URL || "https://sepolia.rpc.zora.energy";

// Zora Factory ABI (minimal for coin creation)
export const ZORA_FACTORY_ABI = [
  {
    "inputs": [
      {
        "name": "name",
        "type": "string"
      },
      {
        "name": "symbol", 
        "type": "string"
      },
      {
        "name": "initialSupply",
        "type": "uint256"
      },
      {
        "name": "creator",
        "type": "address"
      },
      {
        "name": "uri",
        "type": "string"
      }
    ],
    "name": "createCoin",
    "outputs": [
      { "name": "coinAddress", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export interface ZoraCoinParams {
  name: string;
  symbol: string;
  initialSupply: bigint;
  creator: `0x${string}`;
  uri: string;
}

export function useZoraMinting() {
  const { address, chain } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const mintCoin = async (params: ZoraCoinParams) => {
    if (!address) throw new Error("Wallet not connected");
    if (!chain) throw new Error("No chain selected");

    // Validate we're on the correct network
    if (chain.id !== ZORA_SEPOLIA_CHAIN_ID) {
      throw new Error(`Please switch to Zora Sepolia testnet (Chain ID: ${ZORA_SEPOLIA_CHAIN_ID})`);
    }

    console.log("Minting coin with params:", params);
    console.log("Using factory address:", ZORA_CONTRACTS.FACTORY);

    return writeContract({
      address: ZORA_CONTRACTS.FACTORY,
      abi: ZORA_FACTORY_ABI,
      functionName: "createCoin",
      args: [
        params.name,
        params.symbol,
        params.initialSupply,
        params.creator,
        params.uri
      ],
      chain,
      account: address,
    });
  };

  return {
    mintCoin,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

// Helper function to validate network configuration
export function validateNetworkConfig(): boolean {
  const requiredVars = [
    'VITE_CHAIN_ID',
    'VITE_RPC_URL',
    'VITE_ZORA_FACTORY_ADDRESS',
    'VITE_USDC_ADDRESS'
  ];

  const missing = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing);
    return false;
  }

  return true;
}
