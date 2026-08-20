import { Search } from 'lucide-react';
import { useLanguage } from '../../../../../i18n/translations/LanguageContext';

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
  const { t, lang } = useLanguage();
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${lang === 'ar' ? 'right-3' : 'left-3'}`} />
          <input
            type="text"
            placeholder={t.hrEmployees?.search || 'Search by name...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">{t.hrLeaves?.statusAll || 'All Status'}</option>
          <option value="pending">{t.hrLeaves?.statusPending || 'Pending'}</option>
          <option value="approved">{t.hrLeaves?.statusApproved || 'Approved'}</option>
          <option value="rejected">{t.hrLeaves?.statusRejected || 'Rejected'}</option>
        </select>

        {setDepId && (
          <input
            type="number"
            placeholder="Department ID"
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