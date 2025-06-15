
import React, { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect, useBalance, WagmiConfig, createConfig, useEnsName } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";
import { mainnet } from "wagmi/chains";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Wallet } from "lucide-react";
import { formatEther } from "viem";

const wagmiConfig = createConfig({
  chains: [mainnet],
  connectors: [
    injected({ shimDisconnect: true }),
    walletConnect({ projectId: "wagmi-example", showQrModal: true }),
  ],
  ssr: false,
});

const USDC_CONTRACT = {
  mainnet: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
};

type Web3WalletModuleProps = {
  open: boolean;
  onClose: () => void;
};

export const Web3WalletModule: React.FC<Web3WalletModuleProps> = ({ open, onClose }) => {
  // Wallet connection/meta
  const { address, isConnected } = useAccount();
  const { connect, connectors, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });

  // Fetch ETH balance
  const { data: ethBalance, refetch: refetchEth } = useBalance({
    address,
    enabled: !!address,
  });

  // Fetch USDC balance
  const { data: usdcBalance, refetch: refetchUsdc } = useBalance({
    address,
    token: USDC_CONTRACT.mainnet,
    enabled: !!address,
  });

  useEffect(() => {
    if (isConnected && address) {
      toast({ title: "Wallet Connected", description: `Connected: ${address}` });
    }
  }, [isConnected, address]);

  return (
    <WagmiConfig config={wagmiConfig}>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <Wallet size={18} className="inline-block mr-2 text-accent" />
              Web3 Wallet
            </DialogTitle>
          </DialogHeader>
          {!isConnected ? (
            <div className="space-y-2">
              <div>Select a wallet:</div>
              {connectors.map((connector) => (
                <Button
                  key={connector.id}
                  disabled={!connector.ready}
                  onClick={() => connect({ connector })}
                  className="w-full mb-1"
                >
                  {connector.name}
                  {!connector.ready && " (unsupported)"}
                  {isLoading &&
                    pendingConnector?.id === connector.id &&
                    " (connecting)"}
                </Button>
              ))}
            </div>
          ) : (
            <div className="space-y-4 mt-2">
              <div className="border rounded p-4 bg-muted/30 space-y-1 text-sm">
                <div>
                  <span className="font-medium">Wallet Address:</span>{" "}
                  <span className="font-mono">{ensName || (address?.slice(0, 6) + "..." + address?.slice(-4))}</span>
                </div>
                <div>
                  <span className="font-medium">ETH Balance:</span>{" "}
                  <span className="font-mono">
                    {ethBalance ? Number(ethBalance.formatted).toFixed(4) : "—"}
                  </span>
                </div>
                <div>
                  <span className="font-medium">USDC Balance:</span>{" "}
                  <span className="font-mono">
                    {usdcBalance ? Number(usdcBalance.formatted).toFixed(2) : "—"}
                  </span>
                </div>
              </div>
              <Button variant="secondary" onClick={() => { disconnect(); toast({ title: "Wallet Disconnected" }); }}>
                Disconnect Wallet
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </WagmiConfig>
  );
};
