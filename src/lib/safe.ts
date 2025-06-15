
import { getDefaultProvider, ethers } from "ethers";
import EthersAdapter from "@safe-global/protocol-kit/dist/src/adapters/ethers";
import Safe, { SafeAccountConfig } from "@safe-global/protocol-kit";

// Creates a Safe wallet and returns its address
export async function createSafe(owner: `0x${string}`): Promise<string> {
  const provider = getDefaultProvider("https://sepolia.base.org");
  const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: provider });
  // Use the static create method per SDK v6
  const safeFactory = await Safe.create({ ethAdapter });
  const safeAccountConfig: SafeAccountConfig = {
    owners: [owner],
    threshold: 1,
  };
  // Deploy the Safe with the configuration
  const safe = await safeFactory.deploySafe({ safeAccountConfig });
  return await safe.getAddress();
}
