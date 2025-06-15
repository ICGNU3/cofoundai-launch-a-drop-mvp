
import { ethers } from 'ethers';
import Safe, { SafeFactory, SafeAccountConfig } from '@safe-global/protocol-kit';
import EthersAdapter from '@safe-global/safe-ethers-lib';

// Creates a Safe wallet and returns its address
export async function createSafe(owner: `0x${string}`): Promise<string> {
  const provider = new ethers.providers.JsonRpcProvider('https://sepolia.base.org');
  const signer = provider.getSigner(owner);

  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer,
  });

  const safeFactory = await SafeFactory.create({ ethAdapter });
  const safeAccountConfig: SafeAccountConfig = {
    owners: [owner],
    threshold: 1,
  };
  const safeSdk: Safe = await safeFactory.deploySafe({ safeAccountConfig });

  return await safeSdk.getAddress(); // returns the new Safe wallet address
}
