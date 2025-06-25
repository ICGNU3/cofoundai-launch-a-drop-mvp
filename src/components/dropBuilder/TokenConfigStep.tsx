
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, Hash, Users, Lock } from 'lucide-react';
import { TokenConfig } from '@/hooks/useDropBuilder';
import { PaymentGate } from '../PaymentGate';

interface TokenConfigStepProps {
  tokenConfig: TokenConfig;
  onConfigUpdate: (config: TokenConfig) => void;
  canUseAdvanced: boolean;
}

export const TokenConfigStep: React.FC<TokenConfigStepProps> = ({
  tokenConfig,
  onConfigUpdate,
  canUseAdvanced
}) => {
  const updateField = (field: keyof TokenConfig, value: string) => {
    onConfigUpdate({ ...tokenConfig, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Configure Your Token</h2>
        <p className="text-gray-600">
          Set up the details for your project's token
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Token Name */}
        <div className="space-y-2">
          <Label htmlFor="token-name" className="flex items-center gap-2">
            <Coins className="w-4 h-4" />
            Token Name
          </Label>
          <Input
            id="token-name"
            placeholder="My Creative Project"
            value={tokenConfig.name}
            onChange={(e) => updateField('name', e.target.value)}
          />
          <p className="text-sm text-gray-500">
            The full name of your token (e.g., "Awesome Music Project")
          </p>
        </div>

        {/* Token Symbol */}
        <div className="space-y-2">
          <Label htmlFor="token-symbol" className="flex items-center gap-2">
            <Hash className="w-4 h-4" />
            Token Symbol
          </Label>
          <Input
            id="token-symbol"
            placeholder="AMP"
            value={tokenConfig.symbol}
            onChange={(e) => updateField('symbol', e.target.value.toUpperCase())}
            className="uppercase"
            maxLength={10}
          />
          <p className="text-sm text-gray-500">
            Short identifier (3-10 characters, e.g., "AMP")
          </p>
        </div>

        {/* Total Supply */}
        <div className="space-y-2">
          <Label htmlFor="total-supply" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Total Supply
          </Label>
          <Input
            id="total-supply"
            type="number"
            placeholder="1000000"
            value={tokenConfig.totalSupply}
            onChange={(e) => updateField('totalSupply', e.target.value)}
          />
          <p className="text-sm text-gray-500">
            Total number of tokens to create
          </p>
        </div>

        {/* Initial Price */}
        <div className="space-y-2">
          <Label htmlFor="price">Initial Price (ETH)</Label>
          <Input
            id="price"
            type="number"
            step="0.001"
            placeholder="0.001"
            value={tokenConfig.price}
            onChange={(e) => updateField('price', e.target.value)}
          />
          <p className="text-sm text-gray-500">
            Starting price per token in ETH
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Project Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your creative project, its goals, and what supporters can expect..."
          value={tokenConfig.description}
          onChange={(e) => updateField('description', e.target.value)}
          rows={4}
        />
        <p className="text-sm text-gray-500">
          Tell your story and explain what this project means to you
        </p>
      </div>

      {/* Advanced Features Gate */}
      {!canUseAdvanced && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <Lock className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <p className="text-sm text-gray-600">
              Advanced token customization features are available with Pro Launch
            </p>
            <PaymentGate 
              requiredTier="pro" 
              featureName="Advanced Token Customization"
            >
              <></>
            </PaymentGate>
          </CardContent>
        </Card>
      )}

      {/* Preview Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-lg">Token Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Name:</span> {tokenConfig.name || 'Not set'}
            </div>
            <div>
              <span className="font-medium">Symbol:</span> {tokenConfig.symbol || 'Not set'}
            </div>
            <div>
              <span className="font-medium">Supply:</span> {tokenConfig.totalSupply ? Number(tokenConfig.totalSupply).toLocaleString() : 'Not set'}
            </div>
            <div>
              <span className="font-medium">Price:</span> {tokenConfig.price || '0'} ETH
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
