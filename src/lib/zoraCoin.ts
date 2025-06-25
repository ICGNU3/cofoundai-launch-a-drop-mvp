// Legacy file - keeping minimal exports for backward compatibility
// All token creation now handled by ZoraCoinFactory

export interface CoinDeploymentParams {
  name: string;
  symbol: string;
  supply: number;
  creator?: string;
}

export const defaultCoinParams: CoinDeploymentParams = {
  name: "NEPLUS Coin",
  symbol: "NPLUS",
  supply: 1000000,
};

export function getCoinHelperText(): string {
  return "Deploy your token using Zora's audited Coin Factory with built-in royalties.";
}

// Utility function to calculate royalty amount (5% fixed rate with Zora)
export function calculateRoyalty(amount: number): number {
  return Math.floor((amount * 500) / 10000); // 5% royalty
}

// Deprecated - use ZoraCoinFactory instead
export async function deployCoinWithRoyalties(params: CoinDeploymentParams) {
  console.warn('deployCoinWithRoyalties is deprecated. Use ZoraCoinFactory instead.');
  throw new Error('This function has been deprecated. Please use the new ZoraCoinFactory.');
}
