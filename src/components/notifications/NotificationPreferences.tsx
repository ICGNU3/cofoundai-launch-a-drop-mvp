
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Settings, Mail, Smartphone, Bell } from 'lucide-react';

interface NotificationPreference {
  id: string;
  label: string;
  description: string;
  inApp: boolean;
  email: boolean;
  push: boolean;
  category: 'activity' | 'financial' | 'social' | 'platform';
}

export function NotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      id: 'new_supporter',
      label: 'New Supporter',
      description: 'When someone supports your drop',
      inApp: true,
      email: true,
      push: false,
      category: 'activity'
    },
    {
      id: 'payment_received',
      label: 'Payment Received',
      description: 'When you receive payments or royalties',
      inApp: true,
      email: true,
      push: true,
      category: 'financial'
    },
    {
      id: 'milestone_achieved',
      label: 'Milestone Achieved',
      description: 'When your project reaches a milestone',
      inApp: true,
      email: false,
      push: true,
      category: 'activity'
    },
    {
      id: 'community_message',
      label: 'Community Messages',
      description: 'New messages in your project community',
      inApp: true,
      email: false,
      push: false,
      category: 'social'
    },
    {
      id: 'farcaster_interaction',
      label: 'Farcaster Interactions',
      description: 'Likes, recasts, and comments on your casts',
      inApp: true,
      email: false,
      push: false,
      category: 'social'
    },
    {
      id: 'platform_updates',
      label: 'Platform Updates',
      description: 'Important announcements and new features',
      inApp: true,
      email: true,
      push: false,
      category: 'platform'
    }
  ]);

  const { toast } = useToast();

  const updatePreference = (id: string, channel: 'inApp' | 'email' | 'push', value: boolean) => {
    setPreferences(prev => prev.map(pref => 
      pref.id === id ? { ...pref, [channel]: value } : pref
    ));
  };

  const savePreferences = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Preferences Saved",
      description: "Your notification preferences have been updated.",
    });
  };

  const categoryLabels = {
    activity: 'Activity & Engagement',
    financial: 'Financial',
    social: 'Social',
    platform: 'Platform'
  };

  const groupedPreferences = preferences.reduce((acc, pref) => {
    if (!acc[pref.category]) acc[pref.category] = [];
    acc[pref.category].push(pref);
    return acc;
  }, {} as Record<string, NotificationPreference[]>);

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Notification Preferences
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Channel Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-surface/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-accent" />
            <div>
              <div className="font-medium">In-App</div>
              <Badge variant="default">Always Available</Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-500" />
            <div>
              <div className="font-medium">Email</div>
              <Badge variant="secondary">Connected</Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-purple-500" />
            <div>
              <div className="font-medium">Push</div>
              <Badge variant="outline">Coming Soon</Badge>
            </div>
          </div>
        </div>

        {/* Preferences by Category */}
        {Object.entries(groupedPreferences).map(([category, prefs]) => (
          <div key={category} className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              {categoryLabels[category as keyof typeof categoryLabels]}
            </h3>
            
            <div className="space-y-4">
              {prefs.map((pref) => (
                <div key={pref.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{pref.label}</div>
                    <div className="text-sm text-text/70">{pref.description}</div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    {/* In-App */}
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-text/70" />
                      <Switch
                        checked={pref.inApp}
                        onCheckedChange={(value) => updatePreference(pref.id, 'inApp', value)}
                      />
                    </div>
                    
                    {/* Email */}
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-text/70" />
                      <Switch
                        checked={pref.email}
                        onCheckedChange={(value) => updatePreference(pref.id, 'email', value)}
                      />
                    </div>
                    
                    {/* Push (disabled for now) */}
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-text/70" />
                      <Switch
                        checked={pref.push}
                        onCheckedChange={(value) => updatePreference(pref.id, 'push', value)}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={savePreferences}>
            Save Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
