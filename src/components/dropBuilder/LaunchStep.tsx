
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Rocket, CheckCircle, AlertCircle, ExternalLink, Copy } from 'lucide-react';
import { DropData } from '@/hooks/useDropBuilder';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const handleLaunch = async () => {
    try {
      await onLaunch();
      // Simulate contract deployment
      const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
      setContractAddress(mockAddress);
      setIsLaunched(true);
    } catch (error) {
      console.error('Launch failed:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Address copied to clipboard",
    });
  };

  if (isLaunched) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>
        
        <div>
          <h2 className="text-3xl font-bold text-green-800 mb-2">
            🎉 Drop Launched Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Your creative project is now live on the blockchain
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Contract Details</CardTitle>
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
            
            <div className="flex gap-3">
              <Button className="flex-1" asChild>
                <a href={`https://etherscan.io/address/${contractAddress}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Etherscan
                </a>
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <a href={`https://zora.co/collect/${contractAddress}`} target="_blank" rel="noopener noreferrer">
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
        <h2 className="text-2xl font-bold mb-2">Launch Your Drop</h2>
        <p className="text-gray-600">
          Deploy your project to the blockchain and make it live
        </p>
      </div>

      {/* Pre-launch Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Pre-Launch Checklist</CardTitle>
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
            <span>Project details finalized</span>
          </div>
        </CardContent>
      </Card>

      {/* Launch Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Launch Summary</CardTitle>
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
              <p className="text-sm text-gray-600">Total Supply</p>
              <p className="font-medium">{Number(dropData.tokenConfig.totalSupply).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Initial Price</p>
              <p className="font-medium">{dropData.tokenConfig.price} ETH</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gas Estimate */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Estimated gas cost: ~0.05 ETH (varies with network conditions). 
          Make sure you have sufficient ETH in your wallet.
        </AlertDescription>
      </Alert>

      {/* Launch Button */}
      <div className="text-center">
        <Button
          size="lg"
          onClick={handleLaunch}
          disabled={isLaunching}
          className="px-12 py-4 text-lg bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
        >
          {isLaunching ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Launching...
            </>
          ) : (
            <>
              <Rocket className="w-5 h-5 mr-3" />
              Launch Drop
            </>
          )}
        </Button>
        
        {isLaunching && (
          <p className="text-sm text-gray-600 mt-4">
            This may take a few minutes. Please don't close this window.
          </p>
        )}
      </div>
    </div>
  );
};
