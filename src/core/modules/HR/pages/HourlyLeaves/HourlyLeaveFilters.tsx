import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface HourlyLeaveFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  depId?: string;
  setDepId?: (value: string) => void;
}

const HourlyLeaveFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  depId,
  setDepId,
}: HourlyLeaveFiltersProps) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {setDepId && (
          <input
            type="number"
            placeholder={t('departmentId') || "Department ID"}
            value={depId || ''}
            onChange={(e) => setDepId(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )}
      </div>
    </div>
  );
};

export default HourlyLeaveFilters;