
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Rocket, CheckCircle, AlertCircle, ExternalLink, Copy, Wallet } from 'lucide-react';
import { DropData } from '@/hooks/useDropBuilder';
import { useToast } from '@/hooks/use-toast';
import { useAccount, useConnect } from 'wagmi';
import { useZoraTokenDeployment } from '@/hooks/useZoraTokenDeployment';

interface LaunchStepProps {
  dropData: DropData;
  onLaunch: () => void;
  isLaunching: boolean;
}

export const LaunchStep: React.FC<LaunchStepProps> = ({
  dropData,
  onLaunch,
  isLaunching
}) => {
  const [isLaunched, setIsLaunched] = useState(false);
  const [contractAddress, setContractAddress] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const { toast } = useToast();
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors } = useConnect();
  const { 
    deployToken, 
    isDeploying, 
    deploymentResult, 
    deploymentError 
  } = useZoraTokenDeployment();

  const handleLaunch = async () => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to deploy the token",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await deployToken({
        name: dropData.tokenConfig.name,
        symbol: dropData.tokenConfig.symbol,
        description: dropData.tokenConfig.description || '',
        maxSupply: dropData.tokenConfig.totalSupply,
        pricePerToken: dropData.tokenConfig.price,
        creatorAddress: address,
        media: dropData.media
      });

      if (result) {
        setContractAddress(result.contractAddress);
        setTransactionHash(result.transactionHash);
        setIsLaunched(true);
        
        toast({
          title: "🎉 Token Deployed Successfully!",
          description: "Your token is now live on the blockchain",
        });
        
        await onLaunch();
      }
    } catch (error) {
      console.error('Launch failed:', error);
      toast({
        title: "Deployment Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Address copied to clipboard",
    });
  };

  if (!isConnected) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <Wallet className="w-10 h-10 text-blue-600" />
          </div>
        </div>
        
        <div>
          <h2 className="text-3xl font-bold text-blue-800 mb-2">
            Connect Your Wallet
          </h2>
          <p className="text-gray-600 mb-6">
            Connect your wallet to deploy your token to the blockchain
          </p>
        </div>

        <div className="space-y-3">
          {connectors.map((connector) => (
            <Button
              key={connector.uid}
              onClick={() => connect({ connector })}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              Connect {connector.name}
            </Button>
          ))}
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You need to connect your wallet to deploy tokens on the blockchain. 
            Make sure you're on the correct network (Base or Base Sepolia).
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLaunched && contractAddress) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>
        
        <div>
          <h2 className="text-3xl font-bold text-green-800 mb-2">
            🎉 Token Deployed Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Your token is now live on the blockchain
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Deployment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="text-left">
                <p className="text-sm text-gray-600">Contract Address</p>
                <p className="font-mono text-sm">{contractAddress}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(contractAddress)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            
            {transactionHash && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="text-left">
                  <p className="text-sm text-gray-600">Transaction Hash</p>
                  <p className="font-mono text-sm">{transactionHash.slice(0, 20)}...</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(transactionHash)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            )}
            
            <div className="flex gap-3">
              <Button className="flex-1" asChild>
                <a 
                  href={`https://basescan.org/address/${contractAddress}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on BaseScan
                </a>
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <a 
                  href={`https://zora.co/collect/base:${contractAddress}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Zora
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Next Steps</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Share your drop</p>
                  <p className="text-sm text-gray-600">Let your community know about your new project</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Monitor sales</p>
                  <p className="text-sm text-gray-600">Track your drop's performance in the dashboard</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Engage supporters</p>
                  <p className="text-sm text-gray-600">Deliver rewards and build your community</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Deploy Your Token</h2>
        <p className="text-gray-600">
          Deploy your token to the blockchain using Zora Protocol
        </p>
      </div>

      {/* Wallet Status */}
      <Card>
        <CardHeader>
          <CardTitle>Wallet Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Wallet Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Network: {chain?.name || 'Unknown'}</span>
          </div>
        </CardContent>
      </Card>

      {/* Pre-deployment Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Pre-Deployment Checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Media content uploaded ({dropData.media.length} files)</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Token configuration complete</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Supporter rewards defined ({dropData.rewards.length} rewards)</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Wallet connected and ready</span>
          </div>
        </CardContent>
      </Card>

      {/* Deployment Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Deployment Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Token Name</p>
              <p className="font-medium">{dropData.tokenConfig.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Symbol</p>
              <p className="font-medium">{dropData.tokenConfig.symbol}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Max Supply</p>
              <p className="font-medium">{Number(dropData.tokenConfig.totalSupply).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Price per Token</p>
              <p className="font-medium">{dropData.tokenConfig.price} ETH</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {deploymentError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Deployment failed: {deploymentError.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Gas Estimate */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Estimated gas cost: ~0.01-0.05 ETH (varies with network conditions). 
          Make sure you have sufficient ETH in your wallet for gas fees.
        </AlertDescription>
      </Alert>

      {/* Deploy Button */}
      <div className="text-center">
        <Button
          size="lg"
          onClick={handleLaunch}
          disabled={isDeploying || isLaunching}
          className="px-12 py-4 text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          {(isDeploying || isLaunching) ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Deploying...
            </>
          ) : (
            <>
              <Rocket className="w-5 h-5 mr-3" />
              Deploy Token
            </>
          )}
        </Button>
        
        {(isDeploying || isLaunching) && (
          <p className="text-sm text-gray-600 mt-4">
            This may take a few minutes. Please don't close this window.
          </p>
        )}
      </div>
    </div>
  );
};
