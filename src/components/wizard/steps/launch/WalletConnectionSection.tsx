
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Wallet } from "lucide-react";
import { useAccount, useConnect } from 'wagmi';

interface WalletConnectionSectionProps {
  walletAddress: string | null;
}

export const WalletConnectionSection: React.FC<WalletConnectionSectionProps> = ({ walletAddress }) => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();

  const effectiveWalletAddress = address || walletAddress;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Wallet Connection & Launch Readiness</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!effectiveWalletAddress ? (
            <div className="p-4 border border-border rounded-lg bg-surface/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-5 h-5 rounded-full border-2 border-red-500"></div>
                <span className="text-sm font-medium">Wallet Connection Required</span>
              </div>
              <p className="text-xs text-text/60 mb-4">
                Connect your wallet to deploy your project to the blockchain
              </p>
              <div className="space-y-2">
                {connectors.map((connector) => (
                  <Button
                    key={connector.uid}
                    onClick={() => connect({ connector })}
                    disabled={isPending}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <Wallet className="w-4 h-4" />
                    {isPending ? 'Connecting...' : `Connect ${connector.name}`}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm">Wallet Connected</span>
                <span className="text-xs text-text/60 font-mono">
                  {effectiveWalletAddress.slice(0, 6)}...{effectiveWalletAddress.slice(-4)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm">Project Configuration Complete</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm">Ready for Blockchain Deployment</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
