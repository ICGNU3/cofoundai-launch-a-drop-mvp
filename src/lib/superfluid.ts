

// Utility for Superfluid upgrades using latest SDK methods
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";

/**
 * Upgrade USDC to USDCx (Super Token) using the recommended pattern.
 * @param provider - ethers.js provider (Web3Provider, JsonRpcProvider, etc)
 * @param signer - ethers.js signer (must have USDC balance and approval)
 * @param usdcxAddress - USDCx super token contract address, e.g. "0x..."
 * @param amount - Amount (BigNumber or string, in base units)
 * @param userAddress - The wallet/user address (from signer)
 */
export async function upgradeUSDCx({
  provider,
  signer,
  usdcxAddress,
  amount,
  userAddress,
}: {
  provider: ethers.providers.Provider,
  signer: ethers.Signer,
  usdcxAddress: string,
  amount: string,
  userAddress: string,
}) {
  // Create Superfluid framework
  const sf = await Framework.create({
    chainId: (await provider.getNetwork()).chainId,
    provider,
  });

  // Load the SuperToken
  const usdcx = await sf.loadSuperToken(usdcxAddress);

  // Use correct .upgrade method on SuperToken - returns operation, then exec
  const upgradeOp = (usdcx as any).upgrade({ amount });
  return await upgradeOp.exec(signer);
}

