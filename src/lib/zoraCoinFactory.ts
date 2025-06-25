
import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { base, baseSepolia } from 'viem/chains';
import { useAccount, useWalletClient } from 'wagmi';

// Zora Coin Factory addresses
export const ZORA_COIN_FACTORY = {
  [base.id]: "0x777777C338d93e2C7adf08D102d45CA7CC4Ed021",
  [baseSepolia.id]: "0x777777C338d93e2C7adf08D102d45CA7CC4Ed021",
} as const;

// Zora Coin Factory ABI (simplified for coin creation)
export const ZORA_COIN_FACTORY_ABI = [
  {
    inputs: [
      { name: "name", type: "string" },
      { name: "symbol", type: "string" },
      { name: "initialSupply", type: "uint256" },
      { name: "creator", type: "address" },
      { name: "uri", type: "string" }
    ],
    name: "createCoin",
    outputs: [
      { name: "coinAddress", type: "address" }
    ],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [{ name: "coinAddress", type: "address" }],
    name: "getCoinInfo",
    outputs: [
      { name: "name", type: "string" },
      { name: "symbol", type: "string" },
      { name: "totalSupply", type: "uint256" },
      { name: "creator", type: "address" }
    ],
    stateMutability: "view",
    type: "function"
  }
] as const;

export interface ZoraCoinParams {
  name: string;
  symbol: string;
  initialSupply: string;
  creator: string;
  uri?: string;
}

export interface ZoraCoinInfo {
  name: string;
  symbol: string;
  totalSupply: string;
  creator: string;
  address: string;
}

export class ZoraCoinFactory {
  private chainId: number;
  private walletClient: any;
  private publicClient: any;

  constructor(chainId: number, walletClient?: any) {
    this.chainId = chainId;
    this.walletClient = walletClient;
    
    const chain = chainId === base.id ? base : baseSepolia;
    this.publicClient = createPublicClient({
      chain,
      transport: http()
    });
  }

  async createCoin(params: ZoraCoinParams): Promise<{ hash: string; coinAddress?: string }> {
    if (!this.walletClient) {
      throw new Error("Wallet client not available");
    }

    const factoryAddress = ZORA_COIN_FACTORY[this.chainId as keyof typeof ZORA_COIN_FACTORY];
    if (!factoryAddress) {
      throw new Error("Unsupported chain");
    }

    try {
      const hash = await this.walletClient.writeContract({
        address: factoryAddress,
        abi: ZORA_COIN_FACTORY_ABI,
        functionName: "createCoin",
        args: [
          params.name,
          params.symbol,
          BigInt(params.initialSupply),
          params.creator as `0x${string}`,
          params.uri || ""
        ],
        value: BigInt(0) // May need to adjust based on Zora's fee structure
      });

      return { hash };
    } catch (error) {
      console.error('Error creating coin:', error);
      throw error;
    }
  }

  async getCoinInfo(coinAddress: string): Promise<ZoraCoinInfo> {
    const factoryAddress = ZORA_COIN_FACTORY[this.chainId as keyof typeof ZORA_COIN_FACTORY];
    
    try {
      const result = await this.publicClient.readContract({
        address: factoryAddress,
        abi: ZORA_COIN_FACTORY_ABI,
        functionName: "getCoinInfo",
        args: [coinAddress as `0x${string}`]
      });

      return {
        name: result[0],
        symbol: result[1],
        totalSupply: result[2].toString(),
        creator: result[3],
        address: coinAddress
      };
    } catch (error) {
      console.error('Error getting coin info:', error);
      throw error;
    }
  }
}
