
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Wallet, LogOut, Copy, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from './WalletConnectionProvider';
import { useConnect } from 'wagmi';

export function EnhancedWalletConnection() {
  const { address, isConnected, isConnecting, disconnect, chainId } = useWallet();
  const { connectors } = useConnect();
  const { toast } = useToast();
  const [showConnectModal, setShowConnectModal] = useState(false);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getChainName = (id: number | undefined) => {
    switch (id) {
      case 1: return 'Ethereum';
      case 8453: return 'Base';
      case 84532: return 'Base Sepolia';
      default: return 'Unknown';
    }
  };

  const handleConnectorClick = (connector: any) => {
    connector.connect();
    setShowConnectModal(false);
  };

  if (isConnected && address) {
    return (
      <Card className="bg-surface border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <Wallet className="w-5 h-5 text-black" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{formatAddress(address)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyAddress}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1" />
                    {getChainName(chainId)}
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={disconnect}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-surface border-border">
        <CardContent className="p-4">
          <div className="text-center">
            <Wallet className="w-12 h-12 mx-auto mb-4 text-text/50" />
            <h3 className="font-semibold mb-2">Connect Your Wallet</h3>
            <p className="text-sm text-text/70 mb-4">
              Connect your wallet to create and manage tokens
            </p>
            <Button
              onClick={() => setShowConnectModal(true)}
              disabled={isConnecting}
              className="w-full bg-accent text-black hover:bg-accent/90 gap-2"
            >
              {isConnecting ? (
                'Connecting...'
              ) : (
                <>
                  <Wallet className="w-4 h-4" />
                  Connect Wallet
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showConnectModal} onOpenChange={setShowConnectModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Wallet</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {connectors.map((connector) => (
              <Button
                key={connector.uid}
                onClick={() => handleConnectorClick(connector)}
                variant="outline"
                className="w-full justify-start gap-3 h-12"
              >
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <Wallet className="w-4 h-4" />
                </div>
                {connector.name}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
