import { Search, Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LeaveFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
}

const LeaveFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
}: LeaveFiltersProps) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('searchByName') || "Search by name..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">{t('allStatus') || 'All Status'}</option>
          <option value="pending">{t('pending') || 'Pending'}</option>
          <option value="approved">{t('approved') || 'Approved'}</option>
          <option value="rejected">{t('rejected') || 'Rejected'}</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">{t('allTypes') || 'All Types'}</option>
          <option value="annual">{t('annual') || 'Annual'}</option>
          <option value="sick">{t('sick') || 'Sick'}</option>
          <option value="emergency">{t('emergency') || 'Emergency'}</option>
          <option value="unpaid">{t('unpaid') || 'Unpaid'}</option>
        </select>

        <div className="flex items-center gap-2 text-gray-500">
          <Filter className="w-4 h-4" />
          <span className="text-sm">{t('filtersApplied') || 'Filters applied'}</span>
        </div>
      </div>
    </div>
  );
};

export default LeaveFilters;