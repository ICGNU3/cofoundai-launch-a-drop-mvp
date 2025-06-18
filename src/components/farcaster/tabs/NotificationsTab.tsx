
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { NotificationPreferences } from '@/components/notifications/NotificationPreferences';
import { Bell, Settings } from 'lucide-react';
import type { Notification } from '@/components/notifications/NotificationCenter';

interface NotificationsTabProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export function NotificationsTab({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearAll
}: NotificationsTabProps) {
  return (
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
            onMarkAsRead={onMarkAsRead}
            onMarkAllAsRead={onMarkAllAsRead}
            onDelete={onDelete}
            onClearAll={onClearAll}
          />
        </TabsContent>

        <TabsContent value="preferences" className="flex justify-center">
          <NotificationPreferences />
        </TabsContent>
      </Tabs>
    </div>
  );
}
