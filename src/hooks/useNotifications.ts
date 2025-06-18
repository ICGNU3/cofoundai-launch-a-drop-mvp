
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Notification } from '@/components/notifications/NotificationCenter';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock data for demonstration
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'supporter',
      title: 'New Supporter!',
      message: 'Sarah Johnson just supported your "Indie Film Project" with $50',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      read: false,
      actionUrl: '/project/indie-film'
    },
    {
      id: '2',
      type: 'payment',
      title: 'Payment Received',
      message: 'You received $25 in royalties from "Music Album Drop"',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      read: false,
      actionUrl: '/analytics'
    },
    {
      id: '3',
      type: 'farcaster',
      title: 'Farcaster Engagement',
      message: 'Your latest cast about "Art Collection" got 15 likes and 3 recasts',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      read: true
    },
    {
      id: '4',
      type: 'milestone',
      title: 'Milestone Achieved!',
      message: 'Your "Game Development" project reached 100 supporters',
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      read: true,
      actionUrl: '/project/game-dev'
    },
    {
      id: '5',
      type: 'community',
      title: 'New Community Message',
      message: 'Alex posted in your "Digital Art" project community',
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
      read: true,
      actionUrl: '/project/digital-art/community'
    }
  ];

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch from Supabase
      // For now, we'll use mock data
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));

    // In a real implementation, this would update the database
    try {
      console.log('Marking notification as read:', id);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);

    // In a real implementation, this would update the database
    try {
      console.log('Marking all notifications as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, []);

  const deleteNotification = useCallback(async (id: string) => {
    const notification = notifications.find(n => n.id === id);
    setNotifications(prev => prev.filter(n => n.id !== id));
    
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }

    // In a real implementation, this would delete from the database
    try {
      console.log('Deleting notification:', id);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, [notifications]);

  const clearAllNotifications = useCallback(async () => {
    setNotifications([]);
    setUnreadCount(0);

    // In a real implementation, this would clear all from the database
    try {
      console.log('Clearing all notifications');
    } catch (error) {
      console.error('Error clearing all notifications:', error);
    }
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    if (!newNotification.read) {
      setUnreadCount(prev => prev + 1);
    }
  }, []);

  // Set up real-time notifications listener
  useEffect(() => {
    loadNotifications();

    // In a real implementation, you would set up a WebSocket or Supabase realtime subscription here
    // For now, we'll simulate periodic updates
    const interval = setInterval(() => {
      // Simulate receiving a new notification occasionally
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        const types: Notification['type'][] = ['supporter', 'payment', 'milestone', 'community', 'farcaster'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        addNotification({
          type: randomType,
          title: 'New Activity',
          message: 'Something interesting happened with your project!',
          timestamp: new Date(),
          read: false
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [loadNotifications, addNotification]);

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    addNotification,
    refresh: loadNotifications
  };
};
