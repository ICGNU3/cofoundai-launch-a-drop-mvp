
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

  // Load USDCx SuperToken contract
  const usdcx = await sf.loadSuperToken(usdcxAddress);

  // Upgrade: use operation then exec with signer
  const upgradeOp = usdcx.upgrade({ amount });
  await upgradeOp.exec(signer);

  // Transfer USDCx to escrow using ERC20 ABI and signer
  const usdcxERC20 = new ethers.Contract(
    usdcx.address,
    ["function transfer(address to, uint256 amount) public returns (bool)"],
    signer
  );
  await usdcxERC20.transfer(escrowAddress, amount);
}

