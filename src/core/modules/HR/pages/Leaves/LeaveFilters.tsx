import React from 'react';
import { useLanguage } from '../../../../../i18n/translations/LanguageContext';

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
  const { t } = useLanguage();
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-4">      <div className="flex-1 min-w-[150px]">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t.hrLeaves?.table?.status || 'Status'}
        </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="all">{t.hrLeaves?.statusAll || 'All'}</option>
          <option value="pending">{t.hrLeaves?.statusPending || 'Pending'}</option>
          <option value="approved">{t.hrLeaves?.statusApproved || 'Approved'}</option>
          <option value="rejected">{t.hrLeaves?.statusRejected || 'Rejected'}</option>
        </select>
      </div>      <div className="flex-1 min-w-[150px]">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t.hrLeaves?.table?.type || 'Type'}
        </label>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="all">{t.hrLeaves?.filterAll || 'All'}</option>
          <option value="annual">{t.hrLeaves?.filterAnnual || 'Annual'}</option>
          <option value="sick">{t.hrLeaves?.filterSick || 'Sick'}</option>
        </select>
      </div>
    </div>
  );
}