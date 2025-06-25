
import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, LogOut, Copy, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function WalletConnection() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { toast } = useToast();

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

  if (isConnected && address) {
    return (
      <Card className="bg-surface border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
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
                  <Badge variant="outline" className="text-xs border-green-500 text-green-500">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1" />
                    Connected
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              className="bg-green-500 text-white hover:bg-green-600 gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Connected
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-surface border-border">
      <CardContent className="p-4">
        <div className="text-center">
          <Wallet className="w-12 h-12 mx-auto mb-4 text-text/50" />
          <h3 className="font-semibold mb-2">Connect Your Wallet</h3>
          <p className="text-sm text-text/70 mb-4">
            Connect your wallet to start trading NEPLUS tokens
          </p>
          <div className="space-y-2">
            {connectors.map((connector) => (
              <Button
                key={connector.uid}
                onClick={() => connect({ connector })}
                disabled={isPending}
                className="w-full bg-accent text-black hover:bg-accent/90"
              >
                {isPending ? 'Connecting...' : `Connect ${connector.name}`}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
