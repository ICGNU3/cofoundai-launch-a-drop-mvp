
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InteractiveFarcasterFrame } from '@/components/farcaster/InteractiveFarcasterFrame';

interface Token {
  address: string;
  symbol: string;
  name: string;
}

interface InteractiveTabProps {
  selectedToken: Token;
}

export function InteractiveTab({ selectedToken }: InteractiveTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="text-center lg:text-left">
        <h2 className="text-2xl font-bold mb-4">Interactive Farcaster Frames</h2>
        <p className="text-text/70 mb-6">
          Fully interactive frames with likes, comments, shares, and direct purchase actions within Farcaster feeds.
        </p>
        <div className="flex justify-center lg:justify-start">
          <div className="bg-gray-100 p-4 rounded-lg">
            <InteractiveFarcasterFrame
              tokenAddress={selectedToken.address}
              tokenSymbol={selectedToken.symbol}
              tokenName={selectedToken.name}
              frameData={{
                castHash: '0xabcd1234',
                fid: '12345',
                messageBytes: '0x...'
              }}
              onInteraction={(action) => console.log('Frame interaction:', action)}
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Interactive Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span>Like and heart interactions</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>Comment and discussion threads</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Direct purchase within frame</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span>Community joining actions</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              <span>Real-time engagement stats</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
