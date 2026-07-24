import React, { useState, useEffect } from 'react';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    // Mock initial notifications
    const mockData: NotificationItem[] = [
      {
        id: '1',
        title: 'New Leave Request',
        message: 'Ahmad requested 2 days off.',
        type: 'info',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
      },
      {
        id: '2',
        title: 'System Update',
        message: 'The system will be updated tonight at 12:00 AM.',
        type: 'warning',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
      },
      {
        id: '3',
        title: 'Payroll Approved',
        message: 'Payroll for July has been approved.',
        type: 'success',
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      }
    ];
    setNotifications(mockData);
  }, []);

  const unreadCount = React.useMemo(() => {
    return notifications.filter(n => !n.isRead).length;
  }, [notifications]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return {
    notifications,
    unreadCount,
    markAllAsRead,
    markAsRead,
    deleteNotification
  };
}
