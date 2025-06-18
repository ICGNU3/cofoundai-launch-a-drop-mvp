
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FarcasterCrossPost } from '@/components/farcaster/FarcasterCrossPost';

interface Token {
  address: string;
  symbol: string;
  name: string;
}

interface CrossPostTabProps {
  selectedToken: Token;
}

export function CrossPostTab({ selectedToken }: CrossPostTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Cross-post to Farcaster</h2>
        <p className="text-text/70 mb-6">
          Create and schedule posts about your drops with custom messaging and interactive frames.
        </p>
        <FarcasterCrossPost
          projectId={selectedToken.address}
          projectTitle={selectedToken.name}
          projectType="Token Drop"
          dropUrl={`${window.location.origin}/trade/${selectedToken.address}`}
        />
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Cross-posting Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Custom cast composer</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Interactive frame embedding</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Preview image generation</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Scheduling capabilities</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Template library</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
