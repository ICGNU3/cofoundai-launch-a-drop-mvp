
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
 * @param escrowAddress - The escrow wallet address where funds are transferred after upgrade
 */
export async function upgradeUSDCx({
  provider,
  signer,
  usdcxAddress,
  amount,
  userAddress,
  escrowAddress,
}: {
  provider: ethers.providers.Provider,
  signer: ethers.Signer,
  usdcxAddress: string,
  amount: string,
  userAddress: string,
  escrowAddress: string
}) {
  // Create Superfluid framework
  const sf = await Framework.create({
    chainId: 84532,
    provider,
  });

  // Upgrade USDC to USDCx using the Framework's helper
  await sf.upgradeSuperToken({
    superToken: usdcxAddress,
    amount,
    sender: userAddress,
  });

  // Load USDCx SuperToken contract
  const usdcx = await sf.loadSuperToken(usdcxAddress);

  // Transfer upgraded USDCx to the escrowAddress
  await usdcx.connect(signer).transfer(escrowAddress, amount);
}

