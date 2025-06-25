
import { http, createConfig } from 'wagmi'
import { base, mainnet, baseSepolia } from 'wagmi/chains'
import { metaMask, coinbaseWallet, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [mainnet, base, baseSepolia],
  connectors: [
    metaMask(),
    coinbaseWallet({
      appName: 'NEPLUS Token Factory',
      appLogoUrl: '/favicon.svg'
    }),
    walletConnect({
      projectId: '2f5a2e3c9b8a7e1d4f6c8a9b2e5f7d1a' // You'll need to get this from WalletConnect Cloud
    })
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
})
