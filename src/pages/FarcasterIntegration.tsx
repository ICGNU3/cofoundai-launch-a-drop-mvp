
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FarcasterMiniApp } from '@/components/farcaster/FarcasterMiniApp';
import { ShareablePriceCard } from '@/components/farcaster/ShareablePriceCard';
import { ReferralSystem } from '@/components/farcaster/ReferralSystem';
import { FarcasterFrame } from '@/components/farcaster/FarcasterFrame';
import { ModernNavigation } from '@/components/ModernNavigation';
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
    <div className="min-h-screen bg-background font-inter">
      <ModernNavigation />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl lg:text-6xl font-light tracking-tighter text-text mb-4">
            Farcaster Social Trading
          </h1>
          <p className="text-lg text-text/70 font-light tracking-wide max-w-2xl mx-auto">
            Trade in-feed, share viral price cards, and earn with referrals across the Farcaster ecosystem
          </p>
        </div>

        {/* Token Selector */}
        <div className="flex justify-center mb-8">
          <div className="text-center">
            <label className="text-sm font-medium text-text/80 mb-3 block font-light tracking-wide">
              Select Demo Token
            </label>
            <div className="flex gap-3 justify-center">
              {DEMO_TOKENS.map((token) => (
                <Button
                  key={token.address}
                  variant={selectedToken.address === token.address ? "default" : "outline"}
                  onClick={() => setSelectedToken(token)}
                  className="font-light tracking-wide"
                >
                  {token.symbol}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <Tabs defaultValue="mini-app" className="space-y-8">
          {/* Tab Navigation */}
          <div className="flex justify-center">
            <TabsList className="bg-card border border-border h-14 p-1 font-inter">
              <TabsTrigger 
                value="mini-app" 
                className="flex items-center gap-2 text-text data-[state=active]:bg-accent data-[state=active]:text-black font-light tracking-wide px-6 py-3"
              >
                <Zap className="w-4 h-4" />
                Mini App
              </TabsTrigger>
              <TabsTrigger 
                value="share" 
                className="flex items-center gap-2 text-text data-[state=active]:bg-accent data-[state=active]:text-black font-light tracking-wide px-6 py-3"
              >
                <Share className="w-4 h-4" />
                Share Cards
              </TabsTrigger>
              <TabsTrigger 
                value="referrals" 
                className="flex items-center gap-2 text-text data-[state=active]:bg-accent data-[state=active]:text-black font-light tracking-wide px-6 py-3"
              >
                <Users className="w-4 h-4" />
                Referrals
              </TabsTrigger>
              <TabsTrigger 
                value="frames" 
                className="flex items-center gap-2 text-text data-[state=active]:bg-accent data-[state=active]:text-black font-light tracking-wide px-6 py-3"
              >
                <Frame className="w-4 h-4" />
                Frames
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="mini-app">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="space-y-6">
                <div className="text-center lg:text-left">
                  <h2 className="text-3xl font-light tracking-tighter text-text mb-3">
                    In-Feed Trading Mini App
                  </h2>
                  <p className="text-lg text-text/70 font-light tracking-wide">
                    A compact trading interface designed for Farcaster frames and social feeds.
                  </p>
                </div>
                <div className="flex justify-center lg:justify-start">
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
              </div>
              
              <div className="space-y-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-xl font-light tracking-tighter text-text">Features</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      'Real-time price updates',
                      'One-click trading',
                      'Social sharing integration',
                      'Referral tracking'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0" />
                        <span className="text-text font-light tracking-wide">{feature}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="share">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="space-y-6">
                <div className="text-center lg:text-left">
                  <h2 className="text-3xl font-light tracking-tighter text-text mb-3">
                    Shareable Price Cards
                  </h2>
                  <p className="text-lg text-text/70 font-light tracking-wide">
                    Create viral-ready price cards with custom messages and multiple styles.
                  </p>
                </div>
                <div className="flex justify-center lg:justify-start">
                  <ShareablePriceCard
                    tokenAddress={selectedToken.address}
                    tokenSymbol={selectedToken.symbol}
                    tokenName={selectedToken.name}
                    price={price}
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-xl font-light tracking-tighter text-text">Viral Features</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      'Multiple card styles',
                      'Custom messaging',
                      'Direct Farcaster sharing',
                      'Embedded trading frames'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0" />
                        <span className="text-text font-light tracking-wide">{feature}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="referrals">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="space-y-6">
                <div className="text-center lg:text-left">
                  <h2 className="text-3xl font-light tracking-tighter text-text mb-3">
                    Viral Referral System
                  </h2>
                  <p className="text-lg text-text/70 font-light tracking-wide">
                    Earn rewards by referring friends and building your network.
                  </p>
                </div>
                <div className="flex justify-center lg:justify-start">
                  <ReferralSystem
                    tokenAddress={selectedToken.address}
                    tokenSymbol={selectedToken.symbol}
                    frameData={{
                      castHash: '0xabcd1234',
                      fid: '12345'
                    }}
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-xl font-light tracking-tighter text-text">Referral Benefits</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      'Up to 10% commission',
                      'Tiered reward system',
                      'Custom referral codes',
                      'Viral boost periods'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0" />
                        <span className="text-text font-light tracking-wide">{feature}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="frames">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="space-y-6">
                <div className="text-center lg:text-left">
                  <h2 className="text-3xl font-light tracking-tighter text-text mb-3">
                    Farcaster Frames
                  </h2>
                  <p className="text-lg text-text/70 font-light tracking-wide">
                    Interactive frames that work seamlessly in Farcaster feeds.
                  </p>
                </div>
                <div className="flex justify-center lg:justify-start">
                  <div className="bg-surface/30 p-6 rounded-lg border border-border">
                    <FarcasterFrame
                      tokenAddress={selectedToken.address}
                      tokenSymbol={selectedToken.symbol}
                      tokenName={selectedToken.name}
                      referralCode="NEPLUS-DEMO123"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-xl font-light tracking-tighter text-text">Frame Capabilities</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      'Interactive trading buttons',
                      'Real-time price display',
                      'Referral code integration',
                      'Cross-platform compatibility'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                        <span className="text-text font-light tracking-wide">{feature}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg font-light tracking-tighter text-text">Frame URL</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-xs text-text/50 bg-surface/50 p-3 rounded break-all font-mono">
                      {window.location.origin}/frame/{selectedToken.address}?ref=NEPLUS-DEMO123
                    </div>
                    <Button className="w-full font-light tracking-wide" variant="outline">
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
