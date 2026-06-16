// src/core/modules/HR/pages/Interviews/InterviewStats.tsx
import React from 'react';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

interface InterviewStatsProps {
  stats: {
    total: number;
    scheduled: number;
    completed: number;
    cancelled: number;
  };
}

const InterviewStats: React.FC<InterviewStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <Calendar className="w-8 h-8 text-blue-500" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Scheduled</p>
            <p className="text-2xl font-bold">{stats.scheduled}</p>
          </div>
          <Clock className="w-8 h-8 text-yellow-500" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold">{stats.completed}</p>
          </div>
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Cancelled</p>
            <p className="text-2xl font-bold">{stats.cancelled}</p>
          </div>
          <XCircle className="w-8 h-8 text-red-500" />
        </div>
      </div>
    </div>
  );
};

export default InterviewStats;