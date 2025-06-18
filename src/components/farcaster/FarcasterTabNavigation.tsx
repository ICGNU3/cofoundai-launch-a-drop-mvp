
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Users, Share, BarChart3, Bell } from 'lucide-react';

interface FarcasterTabNavigationProps {
  unreadCount: number;
}

export function FarcasterTabNavigation({ unreadCount }: FarcasterTabNavigationProps) {
  return (
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
  );
}
