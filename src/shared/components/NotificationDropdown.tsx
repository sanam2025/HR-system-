import React, { useRef, useEffect, useState } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../hooks/useNotifications';
import type { NotificationItem } from '../hooks/useNotifications';

export default function NotificationDropdown() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const {
    notifications,
    unreadCount,
    markAllAsRead,
    markAsRead,
    deleteNotification
  } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(i18n.language === 'ar' ? 'ar-EG' : 'en-US', {
      hour: 'numeric',
      minute: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getIconColor = (type: NotificationItem['type']) => {
    switch (type) {
      case 'info': return 'bg-blue-100 text-blue-600';
      case 'success': return 'bg-green-100 text-green-600';
      case 'warning': return 'bg-yellow-100 text-yellow-600';
      case 'error': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
        title={t('notifications')}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 end-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute end-0 mt-2 w-80 md:w-96 bg-white rounded-xl shadow-xl border border-gray-100 z-[400] overflow-hidden animate-slide-down">
          <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
            <h3 className="font-bold text-gray-800">{t('notifications')}</h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Check size={14} />
                {t('markAllAsRead')}
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Bell size={32} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm">{t('noNewNotifications')}</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`p-4 flex gap-3 hover:bg-gray-50 transition-colors group cursor-pointer ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
                    onClick={() => {
                      if (!notif.isRead) markAsRead(notif.id);
                    }}
                  >
                    <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 ${getIconColor(notif.type)}`}>
                      <Bell size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm ${!notif.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-800'}`}>
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap mt-1">
                          {formatDate(notif.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notif.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                      title={t('delete')}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
