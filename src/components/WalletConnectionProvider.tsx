
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: (connectorId?: string) => void;
  disconnect: () => void;
  chainId: number | undefined;
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

export const WalletConnectionProvider: React.FC<WalletConnectionProviderProps> = ({ children }) => {
  const { address, isConnected, chain } = useAccount();
  const { connect: wagmiConnect, connectors, isPending } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const [localAddress, setLocalAddress] = useState<string | null>(null);

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
      console.log('Wallet connected:', address);
    } else {
      setLocalAddress(null);
      localStorage.removeItem('neplus_wallet_address');
      console.log('Wallet disconnected');
    }
  }, [isConnected, address]);

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

  const value: WalletContextType = {
    address: address || localAddress,
    isConnected: isConnected,
    isConnecting: isPending,
    connect,
    disconnect,
    chainId: chain?.id
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
