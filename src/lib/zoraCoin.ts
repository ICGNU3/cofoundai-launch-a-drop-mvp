
import { ethers } from "ethers";

export interface CoinDeploymentParams {
  name: string;
  symbol: string;
  supply: number;
  royaltyBps?: number; // Default 500 = 5%
  creator?: string;
}

export const defaultCoinParams: CoinDeploymentParams = {
  name: "NEPLUS Coin",
  symbol: "NPLUS",
  supply: 1000000,
  royaltyBps: 500, // 5% default royalty
};

export const CREATOR_ROYALTY_HOOK = import.meta.env.VITE_CREATOR_ROYALTY_HOOK || "";

// Hook flags from deployment script - these need to match the hook permissions
export const ROYALTY_HOOK_FLAGS = "0x4000000000000000000000000000000000000000"; // beforeSwap flag

export async function deployCoinWithRoyalties(params: CoinDeploymentParams) {
  const {
    name = defaultCoinParams.name,
    symbol = defaultCoinParams.symbol,
    supply = defaultCoinParams.supply,
    royaltyBps = defaultCoinParams.royaltyBps,
    creator
  } = params;

  // Validate parameters
  if (!creator) {
    throw new Error("Creator address is required for royalty deployment");
  }

  if (!CREATOR_ROYALTY_HOOK) {
    throw new Error("VITE_CREATOR_ROYALTY_HOOK environment variable not set");
  }

  if (royaltyBps && (royaltyBps < 0 || royaltyBps > 10000)) {
    throw new Error("Royalty BPS must be between 0 and 10000");
  }

  try {
    // This would integrate with the Zora protocol
    // For now, this is a placeholder that shows the structure
    const coinDeployment = {
      name,
      symbol,
      totalSupply: supply,
      postDeployHook: CREATOR_ROYALTY_HOOK,
      poolConfig: {
        hookFlags: ROYALTY_HOOK_FLAGS,
        royaltyBps,
        creator
      }
    };

    console.log("Deploying coin with royalty hook:", coinDeployment);
    
    // TODO: Integrate with actual Zora factory contract
    // const zoraFactory = new ethers.Contract(ZORA_FACTORY_ADDRESS, ZORA_FACTORY_ABI, signer);
    // const tx = await zoraFactory.createCoin(coinDeployment);
    // await tx.wait();
    
    return {
      success: true,
      coinAddress: "0x...", // Placeholder
      hookAddress: CREATOR_ROYALTY_HOOK,
      royaltyBps,
      creator
    };
  } catch (error) {
    console.error("Failed to deploy coin with royalties:", error);
    throw new Error(`Coin deployment failed: ${error}`);
  }
}

export function getCoinHelperText(): string {
  return "Deploy your NEPLUS Coin with creator royalties.";
}

// Utility function to calculate royalty amount
export function calculateRoyalty(amount: number, royaltyBps: number): number {
  return Math.floor((amount * royaltyBps) / 10000);
}
