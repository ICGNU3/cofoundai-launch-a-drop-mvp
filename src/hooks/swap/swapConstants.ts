
// Universal Router address on Base/Zora testnet
export const UNIVERSAL_ROUTER_ADDRESS = "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD";

// Pool Manager address for Uniswap V4 (Base testnet)
export const POOL_MANAGER_ADDRESS = "0x38EB8B22Df3Ae7fb21e92881151B365Df14ba967";

export interface SwapParams {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  recipient?: string;
  slippageTolerance?: number; // in basis points, default 50 = 0.5%
}

export interface PoolCreationParams {
  tokenA: string;
  tokenB: string;
  fee: number; // fee tier in basis points
  initialPrice: string;
  liquidityAmount: string;
}
