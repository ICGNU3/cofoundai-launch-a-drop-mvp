// src/lib/safe.ts

import { ethers } from 'ethers';
import SafeFactory from '@safe-global/protocol-kit';
import type { SafeAccountConfig } from '@safe-global/protocol-kit';
import EthersAdapter from '@safe-global/safe-ethers-lib';

const RPC_URL = 'https://sepolia.base.org';

export async function createSafe(owner: string): Promise<string> {
  // 1. Set up JSON-RPC provider and signer
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  // If you're in-browser with MetaMask:
  // const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
  // Otherwise, fall back to provider signer (ensure private key handling if needed):
  const signer = provider.getSigner();

  // 2. Initialize the Ethers adapter
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer,
  });

  // 3. Create the Safe factory via the constructor for SafeFactory v6+
  const factory = new SafeFactory({ ethAdapter });

  // 4. Deploy a new Safe with a single owner
  const safeAccountConfig: SafeAccountConfig = {
    owners: [owner],
    threshold: 1,
  };
  const safeSdk = await factory.deploySafe({ safeAccountConfig });

  // 5. Return the new Safe address
  return safeSdk.getAddress();
}
