
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { WalletConnectionCheck } from './WalletConnectionCheck';
import { useZoraCoinFactory } from '@/hooks/useZoraCoinFactory';
import { Loader, Rocket, CheckCircle } from 'lucide-react';

interface TokenFormData {
  name: string;
  symbol: string;
  initialSupply: string;
  description: string;
}

export const ZoraTokenLaunchForm: React.FC = () => {
  const [formData, setFormData] = useState<TokenFormData>({
    name: '',
    symbol: '',
    initialSupply: '1000000',
    description: ''
  });
  const [launchResult, setLaunchResult] = useState<{ hash: string; coinAddress?: string } | null>(null);

  const { createCoin, isCreating, isConnected, walletAddress, chainId } = useZoraCoinFactory();

  const handleInputChange = (field: keyof TokenFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLaunch = async () => {
    try {
      const result = await createCoin({
        name: formData.name,
        symbol: formData.symbol,
        initialSupply: formData.initialSupply,
        uri: formData.description ? `data:text/plain;charset=utf-8,${encodeURIComponent(formData.description)}` : undefined
      });
      
      setLaunchResult(result);
    } catch (error) {
      console.error('Launch failed:', error);
    }
  };

  const isFormValid = formData.name && formData.symbol && formData.initialSupply && parseInt(formData.initialSupply) > 0;

  if (launchResult) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-6 h-6" />
            Token Launched Successfully!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Launch Details</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Token Name:</span> {formData.name}
              </div>
              <div>
                <span className="font-medium">Symbol:</span> {formData.symbol}
              </div>
              <div>
                <span className="font-medium">Initial Supply:</span> {parseInt(formData.initialSupply).toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Transaction Hash:</span>
                <code className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">{launchResult.hash}</code>
              </div>
              {launchResult.coinAddress && (
                <div>
                  <span className="font-medium">Token Contract:</span>
                  <code className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">{launchResult.coinAddress}</code>
                </div>
              )}
            </div>
          </div>
          
          <Button 
            onClick={() => setLaunchResult(null)} 
            variant="outline" 
            className="w-full"
          >
            Launch Another Token
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <WalletConnectionCheck requiredChainId={chainId}>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="w-6 h-6" />
            Launch Token with Zora
          </CardTitle>
          <p className="text-sm text-gray-600">
            Create your token using Zora's audited Coin Factory with built-in royalties and liquidity support.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {isConnected && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm">
                <span className="font-medium">Connected Wallet:</span> {walletAddress}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                This wallet will be set as the token creator and royalty recipient.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tokenName">Token Name *</Label>
              <Input
                id="tokenName"
                placeholder="e.g., My Creator Token"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tokenSymbol">Token Symbol *</Label>
              <Input
                id="tokenSymbol"
                placeholder="e.g., MCT"
                value={formData.symbol}
                onChange={(e) => handleInputChange('symbol', e.target.value.toUpperCase())}
                maxLength={10}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="initialSupply">Initial Supply *</Label>
            <Input
              id="initialSupply"
              type="number"
              placeholder="1000000"
              value={formData.initialSupply}
              onChange={(e) => handleInputChange('initialSupply', e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Total number of tokens to create initially
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe your token and its purpose..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <h4 className="font-medium text-sm mb-1">Zora Features Included:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Built-in creator royalties (5% default)</li>
              <li>• Automatic liquidity provisioning</li>
              <li>• Audited smart contracts</li>
              <li>• Integration with Zora ecosystem</li>
            </ul>
          </div>

          <Button
            onClick={handleLaunch}
            disabled={!isFormValid || isCreating}
            className="w-full"
          >
            {isCreating ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Launching Token...
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4 mr-2" />
                Launch Token
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </WalletConnectionCheck>
  );
};
