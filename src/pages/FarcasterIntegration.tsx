
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { FarcasterIntegrationHeader } from '@/components/farcaster/FarcasterIntegrationHeader';
import { TokenSelector } from '@/components/farcaster/TokenSelector';
import { FarcasterTabNavigation } from '@/components/farcaster/FarcasterTabNavigation';
import { InteractiveTab } from '@/components/farcaster/tabs/InteractiveTab';
import { AuthTab } from '@/components/farcaster/tabs/AuthTab';
import { CrossPostTab } from '@/components/farcaster/tabs/CrossPostTab';
import { AnalyticsTab } from '@/components/farcaster/tabs/AnalyticsTab';
import { NotificationsTab } from '@/components/farcaster/tabs/NotificationsTab';
import { useNotifications } from '@/hooks/useNotifications';
import ModernNavigation from '@/components/ModernNavigation';

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
        <FarcasterIntegrationHeader />
        <TokenSelector 
          tokens={DEMO_TOKENS}
          selectedToken={selectedToken}
          onTokenSelect={setSelectedToken}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <FarcasterTabNavigation unreadCount={unreadCount} />

          <TabsContent value="interactive">
            <InteractiveTab selectedToken={selectedToken} />
          </TabsContent>

          <TabsContent value="auth">
            <AuthTab />
          </TabsContent>

          <TabsContent value="crosspost">
            <CrossPostTab selectedToken={selectedToken} />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab metrics={MOCK_FARCASTER_METRICS} />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationsTab
              notifications={notifications}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              onDelete={deleteNotification}
              onClearAll={clearAllNotifications}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
