
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FarcasterAuthButton } from '@/components/farcaster/FarcasterAuthButton';

export function AuthTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="text-center lg:text-left">
        <h2 className="text-2xl font-bold mb-4">Farcaster Authentication</h2>
        <p className="text-text/70 mb-6">
          Streamlined onboarding for Farcaster users with direct login and profile integration.
        </p>
        <div className="flex justify-center lg:justify-start">
          <FarcasterAuthButton
            onAuthSuccess={(user) => console.log('Auth success:', user)}
            onAuthError={(error) => console.error('Auth error:', error)}
          />
        </div>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Benefits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span>One-click Farcaster login</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span>Import existing social graph</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span>Profile verification</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span>Seamless wallet connection</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
