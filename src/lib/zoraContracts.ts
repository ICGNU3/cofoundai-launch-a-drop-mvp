
import { ethers } from "ethers";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";

// Zora V4 contract addresses on Base Sepolia testnet
export const ZORA_CONTRACTS = {
  FACTORY: "0x777777C338d93e2C7adf08D102d45CA7CC4Ed021",
  CREATOR_IMPL: "0x3678862f04290E565cCA2EF163BAeb92Bb76790C",
} as const;

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
