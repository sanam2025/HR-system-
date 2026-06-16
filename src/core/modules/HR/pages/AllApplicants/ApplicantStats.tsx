// src/core/modules/HR/pages/AllApplicants/ApplicantStats.tsx
import React from "react";
import { Users, Clock, CheckCircle, XCircle } from "lucide-react";

interface ApplicantStatsProps {
  stats: {
    total: number;
    pending: number;
    reviewed: number;
    rejected: number;
    accepted: number;
  };
}

const ApplicantStats: React.FC<ApplicantStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <Users className="w-8 h-8 text-blue-500" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold">{stats.pending}</p>
          </div>
          <Clock className="w-8 h-8 text-yellow-500" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Reviewed</p>
            <p className="text-2xl font-bold">{stats.reviewed}</p>
          </div>
          <CheckCircle className="w-8 h-8 text-blue-500" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Accepted</p>
            <p className="text-2xl font-bold">{stats.accepted}</p>
          </div>
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Rejected</p>
            <p className="text-2xl font-bold">{stats.rejected}</p>
          </div>
          <XCircle className="w-8 h-8 text-red-500" />
        </div>
      </div>
    </div>
  );
};

export default ApplicantStats;
