
import { getDefaultProvider, ethers } from "ethers";
import EthersAdapter from "@safe-global/protocol-kit/dist/src/adapters/ethers";
import SafeFactory, { SafeAccountConfig } from "@safe-global/protocol-kit";

// Creates a Safe wallet and returns its address
export async function createSafe(owner: `0x${string}`): Promise<string> {
  const provider = getDefaultProvider("https://sepolia.base.org");
  const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: provider });
  const safeFactory = await SafeFactory.create({ ethAdapter });
  const safeAccountConfig: SafeAccountConfig = {
    owners: [owner],
    threshold: 1,
  };
  const safe = await safeFactory.deploySafe({ safeAccountConfig });
  return await safe.getAddress();
}
