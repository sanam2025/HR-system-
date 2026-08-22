import { Search, RefreshCw } from "lucide-react";
import { useLanguage } from '../../../../../i18n/translations/LanguageContext';

interface JobPostingsFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  refetch: () => void;
}

export default function JobPostingsFilters({
  searchTerm,
  setSearchTerm,
  refetch,
}: JobPostingsFiltersProps) {
  const { t } = useLanguage();
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t.hrJobPostings?.searchPlaceholder || 'Search by job title...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700"
        >
          <RefreshCw className="w-4 h-4" /> {t.hrComplaints?.refresh || 'Refresh'}
        </button>
      </div>
    </div>
  );
}
