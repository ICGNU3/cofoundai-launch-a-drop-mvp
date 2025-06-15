
import { ethers } from 'ethers';
import SafeFactory, { SafeAccountConfig } from '@safe-global/protocol-kit';
import EthersAdapter from '@safe-global/safe-ethers-lib';

const RPC_URL = 'https://sepolia.base.org';

export async function createSafe(owner: string): Promise<string> {
  // 1. Set up JSON-RPC provider and signer for the owner
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const signer   = provider.getSigner(owner);

  // 2. Initialize the Ethers adapter
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer,
  });

  // 3. Create the Safe factory (constructor, NOT static create method)
  const factory = new SafeFactory({ ethAdapter });

  // 4. Deploy a new Safe with a single owner
  const config: SafeAccountConfig = { owners: [owner], threshold: 1 };
  const safeSdk = await factory.deploySafe({ safeAccountConfig: config });

  // 5. Return the new Safe address
  return safeSdk.getAddress();
}
