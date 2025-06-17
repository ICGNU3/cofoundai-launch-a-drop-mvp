
import { http, createConfig } from 'wagmi'
import { zoraSepolia } from 'wagmi/chains'

// Define Zora Sepolia chain configuration
const zoraSepoliaChain = {
  ...zoraSepolia,
  id: 999999999,
  name: 'Zora Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: [import.meta.env.VITE_RPC_URL || 'https://sepolia.rpc.zora.energy'],
    },
    public: {
      http: [import.meta.env.VITE_RPC_URL || 'https://sepolia.rpc.zora.energy'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Zora Sepolia Explorer',
      url: 'https://sepolia.explorer.zora.energy',
    },
  },
  testnet: true,
}

export const config = createConfig({
  chains: [zoraSepoliaChain],
  transports: {
    [zoraSepoliaChain.id]: http(import.meta.env.VITE_RPC_URL || 'https://sepolia.rpc.zora.energy'),
  },
})

// Export the chain for use in other parts of the app
export { zoraSepoliaChain }
