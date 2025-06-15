
// Fix for incompatible ethers version: use require() instead of direct import in EthersAdapter (Safe expects v5)
import { ethers } from 'ethers';
import SafeFactory, { SafeAccountConfig } from '@safe-global/protocol-kit';
import EthersAdapter from '@safe-global/safe-ethers-lib';

const RPC = 'https://sepolia.base.org'; // Base Sepolia

export async function createSafe(owner: `0x${string}`) {
  // 1. Provider + signer for owner
  const provider = new ethers.providers.JsonRpcProvider(RPC);
  const signer = provider.getSigner(owner);

  // 2. Ethers adapter
  const ethAdapter = new EthersAdapter({
    ethers: require('ethers'), // HACK: make "ethers" look like v5 for Safe
    signerOrProvider: signer
  });

  // 3. Safe factory (use correct static create method)
  const safeFactory = await SafeFactory.create({ ethAdapter });

  // 4. Deploy a 1-owner Safe
  const config: SafeAccountConfig = { owners: [owner], threshold: 1 };
  const safeSdk = await safeFactory.deploySafe({ safeAccountConfig: config });

  return safeSdk.getAddress(); // Smart-wallet address
}
