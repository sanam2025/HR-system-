// src/core/modules/HR/pages/Leaves/LeaveStats.tsx
import { FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

interface LeaveStatsProps {
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

const LeaveStats = ({ stats }: LeaveStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Requests</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <FileText className="w-8 h-8 text-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-yellow-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <Clock className="w-8 h-8 text-yellow-500" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Approved</p>
            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          </div>
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Rejected</p>
            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          </div>
          <XCircle className="w-8 h-8 text-red-500" />
        </div>
      </div>
    </div>
  );
};

export default LeaveStats;