
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FarcasterMiniApp } from '@/components/farcaster/FarcasterMiniApp';
import { ShareablePriceCard } from '@/components/farcaster/ShareablePriceCard';
import { ReferralSystem } from '@/components/farcaster/ReferralSystem';
import { FarcasterFrame } from '@/components/farcaster/FarcasterFrame';
import { InteractiveFarcasterFrame } from '@/components/farcaster/InteractiveFarcasterFrame';
import { FarcasterAuthButton } from '@/components/farcaster/FarcasterAuthButton';
import { FarcasterCrossPost } from '@/components/farcaster/FarcasterCrossPost';
import { FarcasterAnalytics } from '@/components/farcaster/FarcasterAnalytics';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { NotificationPreferences } from '@/components/notifications/NotificationPreferences';
import { useNotifications } from '@/hooks/useNotifications';
import ModernNavigation from '@/components/ModernNavigation';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import { Zap, Share, Users, Frame, MessageSquare, BarChart3, Bell, Settings } from 'lucide-react';

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

// Mock Farcaster analytics data
const MOCK_FARCASTER_METRICS = [
  { date: 'Mon', impressions: 1250, frameClicks: 89, likes: 45, recasts: 12, comments: 8, profileViews: 156 },
  { date: 'Tue', impressions: 1580, frameClicks: 112, likes: 67, recasts: 18, comments: 15, profileViews: 203 },
  { date: 'Wed', impressions: 2100, frameClicks: 145, likes: 89, recasts: 25, comments: 22, profileViews: 287 },
  { date: 'Thu', impressions: 1890, frameClicks: 134, likes: 72, recasts: 20, comments: 18, profileViews: 245 },
  { date: 'Fri', impressions: 2350, frameClicks: 178, likes: 105, recasts: 32, comments: 28, profileViews: 321 },
  { date: 'Sat', impressions: 2890, frameClicks: 201, likes: 134, recasts: 41, comments: 35, profileViews: 398 },
  { date: 'Sun', impressions: 2650, frameClicks: 189, likes: 118, recasts: 37, comments: 31, profileViews: 365 }
];

export default function FarcasterIntegration() {
  const [selectedToken, setSelectedToken] = useState(DEMO_TOKENS[0]);
  const [activeTab, setActiveTab] = useState('interactive');
  const { price } = useTokenPrice(selectedToken.address);
  
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  } = useNotifications();

  return (
    <div className="min-h-screen bg-background">
      <ModernNavigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Centered Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Farcaster Social Trading</h1>
          <p className="text-text/70 text-lg">
            Enhanced social features, notifications, and community engagement
          </p>
        </div>

        {/* Centered Token Selector */}
        <div className="flex justify-center mb-6">
          <div className="text-center">
            <label className="text-sm font-medium mb-2 block">Select Token</label>
            <div className="flex gap-2 justify-center">
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
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Centered Tab Navigation */}
          <div className="flex justify-center">
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="interactive" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Interactive
              </TabsTrigger>
              <TabsTrigger value="auth" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Auth
              </TabsTrigger>
              <TabsTrigger value="crosspost" className="flex items-center gap-2">
                <Share className="w-4 h-4" />
                Cross-post
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifications
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-1 min-w-4 h-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="interactive">
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
          </TabsContent>

          <TabsContent value="auth">
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
          </TabsContent>

          <TabsContent value="crosspost">
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
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Farcaster Analytics Dashboard</h2>
                <p className="text-text/70 mb-6">
                  Comprehensive insights into your Farcaster performance and audience engagement.
                </p>
              </div>
              
              <FarcasterAnalytics
                metrics={MOCK_FARCASTER_METRICS}
                totalFollowers={1247}
                weeklyGrowth={23}
              />
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Notification System</h2>
                <p className="text-text/70 mb-6">
                  Stay informed about all your drop activities, earnings, and community interactions.
                </p>
              </div>
              
              <Tabs defaultValue="center" className="space-y-6">
                <div className="flex justify-center">
                  <TabsList>
                    <TabsTrigger value="center" className="flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      Notification Center
                    </TabsTrigger>
                    <TabsTrigger value="preferences" className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Preferences
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="center" className="flex justify-center">
                  <NotificationCenter
                    notifications={notifications}
                    onMarkAsRead={markAsRead}
                    onMarkAllAsRead={markAllAsRead}
                    onDelete={deleteNotification}
                    onClearAll={clearAllNotifications}
                  />
                </TabsContent>

                <TabsContent value="preferences" className="flex justify-center">
                  <NotificationPreferences />
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
