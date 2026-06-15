// src/core/modules/HR/pages/JobPostings/JobPostingsStats.tsx

import type { JobPosting } from "../../../../../api/service/HrService/Types/JobPostingsService.types";

interface JobPostingsStatsProps {
  postings: JobPosting[];
}

export default function JobPostingsStats({ postings }: JobPostingsStatsProps) {
  const stats = {
    total: postings.length,
    open: postings.filter(p => p.status === 'open').length,
    closed: postings.filter(p => p.status === 'closed').length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white rounded-xl shadow-sm p-4">
        <p className="text-xs text-gray-400 uppercase tracking-wider">Total</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total}</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-4">
        <p className="text-xs text-gray-400 uppercase tracking-wider">Open</p>
        <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.open}</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-4">
        <p className="text-xs text-gray-400 uppercase tracking-wider">Closed</p>
        <p className="text-2xl font-bold text-gray-600 mt-1">{stats.closed}</p>
      </div>
    </div>
  );
}