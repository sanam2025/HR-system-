import React, { useState, useEffect } from 'react';
export interface NotificationItem {
  id: string; title: string; message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean; createdAt: string;
}
export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  useEffect(() => {
    setNotifications([
      { id:'1', title:'New Leave Request', message:'Ahmad requested 2 days off.', type:'info', isRead:false, createdAt: new Date(Date.now()-300000).toISOString() },
      { id:'2', title:'System Update', message:'System will update at midnight.', type:'warning', isRead:false, createdAt: new Date(Date.now()-3600000).toISOString() },
      { id:'3', title:'Payroll Approved', message:'July payroll approved.', type:'success', isRead:true, createdAt: new Date(Date.now()-86400000).toISOString() }
    ]);
  }, []);
  const unreadCount = React.useMemo(() => notifications.filter(n=>!n.isRead).length, [notifications]);
  const markAllAsRead = () => setNotifications(p => p.map(n => ({...n, isRead:true})));
  const markAsRead = (id: string) => setNotifications(p => p.map(n => n.id===id ? {...n,isRead:true} : n));
  const deleteNotification = (id: string) => setNotifications(p => p.filter(n=>n.id!==id));
  return { notifications, unreadCount, markAllAsRead, markAsRead, deleteNotification };
}
