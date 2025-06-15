
import { ethers } from 'ethers';
import Safe, { SafeAccountConfig, SafeFactory } from '@safe-global/protocol-kit';
import EthersAdapter from '@safe-global/safe-ethers-lib';

const RPC = 'https://sepolia.base.org'; // Base Sepolia

export async function createSafe(owner: `0x${string}`) {
  // 1. Provider + signer for owner
  const provider = new ethers.providers.JsonRpcProvider(RPC);
  const signer = provider.getSigner(owner);

  // 2. Ethers adapter
  const ethAdapter = new EthersAdapter({
    ethers: require('ethers'), // HACK: make "ethers" look like v5 for Safe
    signerOrProvider: signer,
  });

  // 3. Create SafeFactory and deploy new Safe
  const factory = await SafeFactory.create({ ethAdapter });
  const config: SafeAccountConfig = { owners: [owner], threshold: 1 };
  const sdk: Safe = await factory.deploySafe({ safeAccountConfig: config });

  return await sdk.getAddress(); // Smart-wallet address
}
