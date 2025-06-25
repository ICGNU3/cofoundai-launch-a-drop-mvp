
import React from 'react';
import { ZoraTokenLaunchForm } from './ZoraTokenLaunchForm';
import { ZoraRoyaltyTracker } from './ZoraRoyaltyTracker';
import { EnhancedWalletConnection } from './EnhancedWalletConnection';
import { useWallet } from './WalletConnectionProvider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Rocket, BarChart3, Wallet } from 'lucide-react';

export const ZoraTokenLaunchPage: React.FC = () => {
  const { isConnected } = useWallet();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Zora Token Factory
          </h1>
          <p className="text-lg text-gray-600">
            Launch tokens with built-in royalties and liquidity using Zora's audited protocol
          </p>
        </div>

        {/* Wallet Status Banner */}
        <div className="mb-6">
          <EnhancedWalletConnection />
        </div>

        <Tabs defaultValue="launch" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="launch" className="flex items-center gap-2">
              <Rocket className="w-4 h-4" />
              Launch Token
            </TabsTrigger>
            <TabsTrigger value="tracker" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Royalty Tracker
            </TabsTrigger>
          </TabsList>

          <TabsContent value="launch">
            <ZoraTokenLaunchForm />
          </TabsContent>

          <TabsContent value="tracker">
            <ZoraRoyaltyTracker />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
