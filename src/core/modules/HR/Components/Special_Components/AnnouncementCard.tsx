// src/core/modules/HR/Components/Special_Components/AnnouncementCard.tsx
import React from 'react';
import type { Announcement } from '../../../../../api/service/HrService/Types/AnnouncementsService.types';

interface AnnouncementCardProps {
  announcement: Announcement;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement }) => {
  const getPriorityColor = (status: string) => {
    switch (status) {
      case 'active': return 'border-l-4 border-red-500 bg-red-50';
      case 'scheduled': return 'border-l-4 border-yellow-500 bg-yellow-50';
      case 'draft': return 'border-l-4 border-gray-400 bg-gray-50';
      case 'expired': return 'border-l-4 border-gray-300 bg-gray-100 opacity-60';
      default: return 'border-l-4 border-blue-500 bg-blue-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '';
      case 'scheduled': return '';
      case 'draft': return '';
      case 'expired': return '';
      default: return '';
    }
  };

  return (
    <div className={`p-4 rounded-lg shadow-sm ${getPriorityColor(announcement.status)} transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getStatusIcon(announcement.status)}</span>
            <h4 className="font-semibold text-gray-800">{announcement.title}</h4>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              announcement.status === 'active' ? 'bg-green-100 text-green-700' :
              announcement.status === 'scheduled' ? 'bg-yellow-100 text-yellow-700' :
              announcement.status === 'draft' ? 'bg-gray-100 text-gray-500' :
              'bg-gray-200 text-gray-500'
            }`}>
              {announcement.status}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
            <span> {new Date(announcement.starts_at).toLocaleDateString()}</span>
            {announcement.audience && (
              <span> {announcement.audience}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard;