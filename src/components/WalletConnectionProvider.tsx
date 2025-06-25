
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: (connectorId?: string) => void;
  disconnect: () => void;
  switchToSupportedChain: () => void;
  chainId: number | undefined;
  isOnSupportedChain: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletConnectionProvider');
  }
  return context;
};

interface WalletConnectionProviderProps {
  children: React.ReactNode;
}

const SUPPORTED_CHAINS = [base.id, baseSepolia.id];

export const WalletConnectionProvider: React.FC<WalletConnectionProviderProps> = ({ children }) => {
  const { address, isConnected, chain } = useAccount();
  const { connect: wagmiConnect, connectors, isPending } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [localAddress, setLocalAddress] = useState<string | null>(null);

  const isOnSupportedChain = chain ? SUPPORTED_CHAINS.includes(chain.id as 8453 | 84532) : false;

  // Load saved address from localStorage on mount
  useEffect(() => {
    const savedAddress = localStorage.getItem('neplus_wallet_address');
    if (savedAddress && !address) {
      setLocalAddress(savedAddress);
    }
  }, [address]);

  // Update local state and localStorage when wallet connects/disconnects
  useEffect(() => {
    if (isConnected && address) {
      setLocalAddress(address);
      localStorage.setItem('neplus_wallet_address', address);
      console.log('Wallet connected:', address, 'Chain:', chain?.name);
    } else {
      setLocalAddress(null);
      localStorage.removeItem('neplus_wallet_address');
      console.log('Wallet disconnected');
    }
  }, [isConnected, address, chain]);

  const connect = (connectorId?: string) => {
    const connector = connectorId 
      ? connectors.find(c => c.id === connectorId) 
      : connectors[0];
    
    if (connector) {
      wagmiConnect({ connector });
    }
  };

  const disconnect = () => {
    wagmiDisconnect();
    setLocalAddress(null);
    localStorage.removeItem('neplus_wallet_address');
  };

  const switchToSupportedChain = () => {
    if (switchChain) {
      // Default to Base mainnet, fallback to Base Sepolia for testing
      switchChain({ chainId: base.id });
    }
  };

  const value: WalletContextType = {
    address: address || localAddress,
    isConnected: isConnected,
    isConnecting: isPending,
    connect,
    disconnect,
    switchToSupportedChain,
    chainId: chain?.id,
    isOnSupportedChain
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
