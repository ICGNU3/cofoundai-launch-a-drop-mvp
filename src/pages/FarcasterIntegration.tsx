
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FarcasterMiniApp } from '@/components/farcaster/FarcasterMiniApp';
import { ShareablePriceCard } from '@/components/farcaster/ShareablePriceCard';
import { ReferralSystem } from '@/components/farcaster/ReferralSystem';
import { FarcasterFrame } from '@/components/farcaster/FarcasterFrame';
import ModernNavigation from '@/components/ModernNavigation';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import { Zap, Share, Users, Frame } from 'lucide-react';

const DEMO_TOKENS = [
  {
    address: '0x1234567890123456789012345678901234567890',
    symbol: 'FILMX',
    name: 'Film Production Token'
  },
  {
    address: '0x2345678901234567890123456789012345678901',
    symbol: 'MUSICX',
    name: 'Music Creation Token'
  }
];

export default function FarcasterIntegration() {
  const [selectedToken, setSelectedToken] = useState(DEMO_TOKENS[0]);
  const { price } = useTokenPrice(selectedToken.address);

  return (
    <div className="min-h-screen bg-background">
      <ModernNavigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Farcaster Social Trading</h1>
          <p className="text-text/70 text-lg">
            Trade in-feed, share viral price cards, and earn with referrals
          </p>
        </div>

        {/* Token Selector */}
        <div className="mb-6">
          <label className="text-sm font-medium mb-2 block">Select Token</label>
          <div className="flex gap-2">
            {DEMO_TOKENS.map((token) => (
              <Button
                key={token.address}
                variant={selectedToken.address === token.address ? "default" : "outline"}
                onClick={() => setSelectedToken(token)}
              >
                {token.symbol}
              </Button>
            ))}
          </div>
        </div>

        <Tabs defaultValue="mini-app" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="mini-app" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Mini App
            </TabsTrigger>
            <TabsTrigger value="share" className="flex items-center gap-2">
              <Share className="w-4 h-4" />
              Share Cards
            </TabsTrigger>
            <TabsTrigger value="referrals" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Referrals
            </TabsTrigger>
            <TabsTrigger value="frames" className="flex items-center gap-2">
              <Frame className="w-4 h-4" />
              Frames
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mini-app">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">In-Feed Trading Mini App</h2>
                <p className="text-text/70 mb-6">
                  A compact trading interface designed for Farcaster frames and social feeds.
                </p>
                <FarcasterMiniApp
                  tokenAddress={selectedToken.address}
                  tokenSymbol={selectedToken.symbol}
                  tokenName={selectedToken.name}
                  frameData={{
                    castHash: '0xabcd1234',
                    fid: '12345',
                    messageBytes: '0x...'
                  }}
                />
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Features</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>Real-time price updates</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>One-click trading</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>Social sharing integration</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>Referral tracking</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="share">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Shareable Price Cards</h2>
                <p className="text-text/70 mb-6">
                  Create viral-ready price cards with custom messages and multiple styles.
                </p>
                <ShareablePriceCard
                  tokenAddress={selectedToken.address}
                  tokenSymbol={selectedToken.symbol}
                  tokenName={selectedToken.name}
                  price={price}
                />
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Viral Features</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      <span>Multiple card styles</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      <span>Custom messaging</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      <span>Direct Farcaster sharing</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      <span>Embedded trading frames</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="referrals">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Viral Referral System</h2>
                <p className="text-text/70 mb-6">
                  Earn rewards by referring friends and building your network.
                </p>
                <ReferralSystem
                  tokenAddress={selectedToken.address}
                  tokenSymbol={selectedToken.symbol}
                  frameData={{
                    castHash: '0xabcd1234',
                    fid: '12345'
                  }}
                />
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Referral Benefits</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      <span>Up to 10% commission</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      <span>Tiered reward system</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      <span>Custom referral codes</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      <span>Viral boost periods</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="frames">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Farcaster Frames</h2>
                <p className="text-text/70 mb-6">
                  Interactive frames that work seamlessly in Farcaster feeds.
                </p>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <FarcasterFrame
                    tokenAddress={selectedToken.address}
                    tokenSymbol={selectedToken.symbol}
                    tokenName={selectedToken.name}
                    referralCode="NEPLUS-DEMO123"
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Frame Capabilities</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span>Interactive trading buttons</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span>Real-time price display</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span>Referral code integration</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span>Cross-platform compatibility</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Frame URL</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-text/50 bg-surface/50 p-3 rounded break-all">
                      {window.location.origin}/frame/{selectedToken.address}?ref=NEPLUS-DEMO123
                    </div>
                    <Button className="w-full mt-3" variant="outline">
                      <Share className="w-4 h-4 mr-2" />
                      Share Frame
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
