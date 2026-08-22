import React from "react";
import { Search } from "lucide-react";
import { useLanguage } from "../../../../../i18n/translations/LanguageContext";

interface ApplicantFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

const ApplicantFilters: React.FC<ApplicantFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}) => {
  const { isRTL } = useLanguage();

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
        <input
          type="text"
          placeholder={isRTL ? 'البحث بالاسم أو البريد الإلكتروني...' : 'Search by name or email...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
        />
      </div>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
      >
        <option value="all">{isRTL ? 'جميع الحالات' : 'All Status'}</option>
        <option value="pending">{isRTL ? 'قيد الانتظار' : 'Pending'}</option>
        <option value="reviewed">{isRTL ? 'تمت المراجعة' : 'Reviewed'}</option>
        <option value="accepted">{isRTL ? 'مقبول' : 'Accepted'}</option>
        <option value="rejected">{isRTL ? 'مرفوض' : 'Rejected'}</option>
      </select>
    </div>
  );
};

export default ApplicantFilters;
