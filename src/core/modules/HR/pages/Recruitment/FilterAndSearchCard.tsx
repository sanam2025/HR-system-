import { Search, RefreshCw } from "lucide-react";
import type { FilterStatus } from "./Recruitment";
import { useLanguage } from '../../../../../i18n/translations/LanguageContext';

interface FilterAndSearchCardProps {
  statusFilter: FilterStatus;
  setStatusFilter: (value: FilterStatus) => void;
  refetch: () => void;
}

export default function FilterAndSearchCard({
  statusFilter,
  setStatusFilter,
  refetch,
}: FilterAndSearchCardProps) {
  const { t, lang } = useLanguage();
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400`} />
          <input
            type="text"
            placeholder={t.hrRecruitment?.searchPlaceholder || 'Search by job title...'}
            className={`w-full ${lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">{t.hrRecruitment?.filterAll || 'All Status'}</option>
          <option value="pending">{t.hrRecruitment?.stats?.pending || 'Pending'}</option>
          <option value="approved">{t.hrRecruitment?.stats?.approved || 'Approved'}</option>
          <option value="rejected">{t.hrRecruitment?.stats?.rejected || 'Rejected'}</option>
        </select>

        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          {t.hrComplaints?.refresh || 'Refresh'}
        </button>
      </div>
    </div>
  );
}