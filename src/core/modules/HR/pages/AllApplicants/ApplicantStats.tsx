// src/core/modules/HR/pages/AllApplicants/ApplicantStats.tsx
import { Users, Clock, UserCheck, UserX } from "lucide-react";

interface ApplicantStatsProps {
  stats: {
    total: number;
    pending: number;
    reviewed: number;
    rejected: number;
  };
}

const ApplicantStats = ({ stats }: ApplicantStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <Users className="w-8 h-8 text-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-yellow-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </p>
          </div>
          <Clock className="w-8 h-8 text-yellow-500" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-400">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Reviewed</p>
            <p className="text-2xl font-bold text-blue-600">{stats.reviewed}</p>
          </div>
          <UserCheck className="w-8 h-8 text-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Rejected</p>
            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          </div>
          <UserX className="w-8 h-8 text-red-500" />
        </div>
      </div>
    </div>
  );
};

export default ApplicantStats;
