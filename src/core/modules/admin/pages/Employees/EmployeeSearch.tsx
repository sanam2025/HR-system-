import { useEffect, useState } from "react";
import { 
  Search, 
  Filter, 
  X,
  Award,
  Users,
} from "lucide-react";
import { useEmployees, useEmployeesSearch, useTopRateEmplyees } from "../../hooks/Employees/useEmployees";
import EmployeeSkeleton from "./EmployeeSkeleton";
import StatsCards from "./stats/StatsCards";
import EmployeeList from "./list/EmployeeList";
import TopEmployeesSection from "./TopEmployeesSection";
import type { UserStatus } from "../../../auth/Types/types";
import type { Employee } from "../../../../../api/Types/types.types";
import { useLanguage } from "../../../../../i18n/translations/LanguageContext";

export default function EmployeeSearch() {
  const { t, lang } = useLanguage();
  const { data: employeesResponse, isLoading } = useEmployees();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: topRate, isLoading: isLoadingTopRate } = useTopRateEmplyees();

  const mergeEmployees = (data: any): Employee[] => {
    if (!data) return [];

    if (Array.isArray(data)) return data;
    
    if (data.admin || data.HR || data.manager || data.employee) {
      return [
        ...(data.admin || []),
        ...(data.HR || []),
        ...(data.manager || []),
        ...(data.employee || [])
      ];
    }
    
    return [];
  };



  const employeesData = mergeEmployees(employeesResponse?.data);
  
  const displayData = searchQuery 
    ? employeesData.filter(emp => {
        const q = searchQuery.toLowerCase();
        const nameMatch = (emp.name || emp.full_name || '').toLowerCase().includes(q);
        const emailMatch = (emp.email || '').toLowerCase().includes(q);
        return nameMatch || emailMatch;
      })
    : employeesData;

  const isDataLoading = isLoading;

  const handleSearch = () => {
    setSearchQuery(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm("");
    setSearchQuery("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };



  if (isLoading) {
    return <EmployeeSkeleton />;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t.adminEmployeeSearch?.title || 'Employee Search'}</h1>
        <p className="text-gray-500 mt-1 text-sm">
          {t.adminEmployeeSearch?.subtitle || 'Search and filter employees'}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input 
              type="text" 
              placeholder={t.adminEmployeeSearch?.searchPlaceholder || 'Search by name, department, or position...'}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            {searchTerm && (
              <button 
                onClick={handleClear}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button 
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            {t.adminEmployeeSearch?.filter || 'Search'}
          </button>
        </div>
        {searchQuery && (
          <div className="mt-3 text-sm text-gray-500">
            Found {displayData?.length || 0} result{displayData?.length !== 1 ? 's' : ''} for "{searchQuery}"
          </div>
        )}
      </div>

      <TopEmployeesSection 
        topRate={topRate}
        isLoadingTopRate={isLoadingTopRate}
      />

      <StatsCards employees={displayData} />
      
      <EmployeeList 
        employees={displayData} 
        isLoading={isDataLoading}
      />
    </div>
  );
}