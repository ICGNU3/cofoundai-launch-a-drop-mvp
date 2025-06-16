
import React from 'react';
import { useAccount, useConnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, AlertCircle } from 'lucide-react';

interface WalletConnectionCheckProps {
  children: React.ReactNode;
  requiredChainId?: number;
}

export const WalletConnectionCheck: React.FC<WalletConnectionCheckProps> = ({ 
  children, 
  requiredChainId = 84532 // Base Sepolia
}) => {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors } = useConnect();

  if (!isConnected || !address) {
    return (
      <Card className="bg-surface border-border">
        <CardContent className="p-6 text-center">
          <Wallet className="w-12 h-12 mx-auto mb-4 text-text/50" />
          <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
          <p className="text-text/70 mb-4">
            You need to connect your wallet to mint tokens on the blockchain.
          </p>
          <div className="space-y-2">
            {connectors.map((connector) => (
              <Button
                key={connector.uid}
                onClick={() => connect({ connector })}
                className="w-full bg-accent text-black hover:bg-accent/90"
              >
                Connect {connector.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (chain?.id !== requiredChainId) {
    return (
      <Card className="bg-surface border-border">
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-orange-500" />
          <h3 className="text-lg font-semibold mb-2">Wrong Network</h3>
          <p className="text-text/70 mb-4">
            Please switch to Base Sepolia testnet to mint tokens.
          </p>
          <p className="text-sm text-text/50">
            Current network: {chain?.name || 'Unknown'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};
