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
  const sf = await Framework.create({
    chainId: 84532,
    provider,
  });

  // Load USDCx SuperToken contract address (we need the raw address)
  const usdcx = await sf.loadSuperToken(usdcxAddress);

  // Use ABI for upgrade on USDCx contract
  const USDCX_ABI = [
    "function upgrade(uint256 amount) external",
    "function transfer(address to, uint256 amount) public returns (bool)",
  ];
  const usdcxContract = new ethers.Contract(usdcxAddress, USDCX_ABI, signer);

  // Perform the upgrade (from USDC → USDCx)
  await usdcxContract.upgrade(amount);

  // Transfer upgraded USDCx to the escrow
  await usdcxContract.transfer(escrowAddress, amount);
}
