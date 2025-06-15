
import { getDefaultProvider, ethers } from "ethers";
import { EthersAdapter } from "@safe-global/protocol-kit";
import Safe, { type SafeAccountConfig } from "@safe-global/protocol-kit";

// Creates a Safe wallet and returns its address
export async function createSafe(owner: `0x${string}`): Promise<string> {
  const provider = getDefaultProvider("https://sepolia.base.org");
  const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: provider });
  const safeFactory = await Safe.create({
    ethAdapter,
    safeAccountConfig: {
      owners: [owner],
      threshold: 1,
    } as SafeAccountConfig,
  });
  return safeFactory.getAddress();
}
