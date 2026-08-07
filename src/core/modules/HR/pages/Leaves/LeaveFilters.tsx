// src/core/modules/HR/pages/Leaves/LeaveFilters.tsx
import React from 'react';

interface LeaveFiltersProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
}

export default function LeaveFilters({
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
}: LeaveFiltersProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-4">
      {/* تصفية حسب الحالة */}
      <div className="flex-1 min-w-[150px]">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* تصفية حسب النوع */}
      <div className="flex-1 min-w-[150px]">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Type
        </label>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="all">All</option>
          <option value="annual">Annual</option>
          <option value="sick">Sick</option>
        </select>
      </div>
    </div>
  );
}