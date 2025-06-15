
import { ethers } from 'ethers';

import Safe, {
  SafeAccountConfig,
  SafeFactory,
} from '@safe-global/protocol-kit';

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

  // 3. Safe factory (public API)
  const safeFactory = await SafeFactory.create({ ethAdapter });

  // 4. Deploy a 1-owner Safe
  const config: SafeAccountConfig = { owners: [owner], threshold: 1 };
  const safeSdk: Safe = await safeFactory.deploySafe({ safeAccountConfig: config });

  return safeSdk.getAddress(); // Smart-wallet address
}
