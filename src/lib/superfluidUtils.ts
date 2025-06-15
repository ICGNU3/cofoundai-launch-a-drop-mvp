
import { Framework, type SuperToken } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";

/**
 * Loads the Superfluid Framework and returns the instance.
 */
export async function getSuperfluidFramework(chainId: number, provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider) {
  return await Framework.create({ chainId, provider });
}

/**
 * Loads a SuperToken for a given address.
 */
export async function loadSuperToken(sf: Framework, tokenAddress: string) {
  return await sf.loadSuperToken(tokenAddress);
}

/**
 * Upgrades base tokens (like USDC) to SuperToken (like USDCx).
 */
export async function upgradeToSuperToken(
  sf: Framework,
  superToken: SuperToken,
  amount: string,
  signer: ethers.Signer
) {
  // This method returns a transaction operation, then executes it
  const upgradeOp = superToken.upgrade({ amount });
  return await upgradeOp.exec(signer);
}

/**
 * Transfers SuperToken to receiver.
 */
export async function transferSuperToken(
  superToken: SuperToken,
  receiver: string,
  amount: string,
  signer: ethers.Signer
) {
  const transferOp = superToken.transfer({
    receiver,
    amount,
  });
  return await transferOp.exec(signer);
}

/**
 * Returns flow rate per month, as a stringified BigNumber.
 */
export function calculateFlowRate(total: ethers.BigNumber, percent: number) {
  const secondsInMonth = 30 * 24 * 3600;
  const share = total.mul(Math.floor(percent * 1e6) / 100).div(1e6);
  // Return as string for SDK
  return share.div(secondsInMonth).toString();
}
