
import React from 'react';
import { IntegrationTestSuite } from '@/components/IntegrationTestSuite';
import { StreamlinedWizardButton } from '@/components/StreamlinedWizardButton';
import { usePrivy } from '@privy-io/react-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const DevTools: React.FC = () => {
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address || null;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">NEPLUS Development Tools</h1>
          <p className="text-text/70">Test and validate app functionality</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <StreamlinedWizardButton 
                walletAddress={walletAddress}
                variant="outline"
                className="w-full"
              >
                Test Project Creation
              </StreamlinedWizardButton>
              
              <div className="text-sm text-text/70">
                <p><strong>Wallet:</strong> {walletAddress || 'Not connected'}</p>
                <p><strong>Auth:</strong> {user ? 'Authenticated' : 'Not authenticated'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Environment Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <span>Privy App ID:</span>
                <span className={import.meta.env.VITE_PRIVY_APP_ID ? 'text-green-600' : 'text-red-600'}>
                  {import.meta.env.VITE_PRIVY_APP_ID ? '✓ Set' : '✗ Missing'}
                </span>
                
                <span>Supabase URL:</span>
                <span className={import.meta.env.VITE_SUPABASE_URL ? 'text-green-600' : 'text-red-600'}>
                  {import.meta.env.VITE_SUPABASE_URL ? '✓ Set' : '✗ Missing'}
                </span>
                
                <span>Chain ID:</span>
                <span className={import.meta.env.VITE_CHAIN_ID ? 'text-green-600' : 'text-red-600'}>
                  {import.meta.env.VITE_CHAIN_ID || '✗ Missing'}
                </span>
                
                <span>RPC URL:</span>
                <span className={import.meta.env.VITE_RPC_URL ? 'text-green-600' : 'text-red-600'}>
                  {import.meta.env.VITE_RPC_URL ? '✓ Set' : '✗ Missing'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <IntegrationTestSuite />
      </div>
    </div>
  );
};
