
import { ethers } from 'ethers';
// Import from top-level: Safe, SafeFactory, SafeAccountConfig
import Safe, { SafeFactory, SafeAccountConfig } from '@safe-global/protocol-kit';
import EthersAdapter from '@safe-global/safe-ethers-lib';

const RPC = 'https://sepolia.base.org'; // Base Sepolia

export async function createSafe(owner: `0x${string}`) {
  // 1. Provider + signer for owner
  const provider = new ethers.providers.JsonRpcProvider(RPC);
  const signer   = provider.getSigner(owner);

  // 2. Ethers adapter
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer
  });

  // 3. Safe factory (via named export, using create)
  const safeFactory = await SafeFactory.create({ ethAdapter });

  // 4. Deploy a 1-owner Safe
  const config: SafeAccountConfig = { owners: [owner], threshold: 1 };
  const safeSdk = await safeFactory.deploySafe({ safeAccountConfig: config });

  return safeSdk.getAddress(); // Smart-wallet address
}
