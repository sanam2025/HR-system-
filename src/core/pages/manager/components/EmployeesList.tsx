import { useState, useEffect } from 'react';
import { getManagerEmployees } from '../../../../api/manager';
import EmployeeCard from './EmployeeCard';
import { Search, Loader2 } from 'lucide-react';
import { useLanguage } from '../../../../i18n/translations/LanguageContext';

export default function EmployeesList() {
  const { t, isRTL } = useLanguage();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const res = await getManagerEmployees();
        const data = Array.isArray(res) ? res : (res?.data || []);
        
        // Map API data to the format expected by the UI
        const mappedData = data.map((emp: any) => ({
          id: emp.id,
          profile_id: emp.profile_id,
          name: emp.name,
          title: emp.title || 'موظف', // Fallback if API doesn't provide title
          department: emp.department || 'القسم',
          email: emp.email,
          avatar: emp.name ? emp.name.charAt(0).toUpperCase() : 'م',
          // Backend doesn't provide todayStatus or avgRating in this API yet, so we use placeholders
          todayStatus: 'حاضر', 
          avgRating: '0.0'
        }));
        setEmployees(mappedData);
      } catch (err) {
        setError('فشل في جلب قائمة الموظفين من الخادم');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const filterOptions = [
    { key: 'all', label: t.employees.filterAll },
    { key: 'Present', label: t.employees.status.present },
    { key: 'Absent', label: t.employees.status.absent },
    { key: 'Late', label: t.employees.status.late },
  ];

  const arToEnEmpStatus: Record<string, string> = { 'حاضر': 'Present', 'غائب': 'Absent', 'تأخير': 'Late' };
  
  const normalizedEmployees = employees.map(e => ({
    ...e,
    title: (e.title === 'موظف' || !e.title) ? (isRTL ? 'موظف' : 'Employee') : e.title,
    todayStatus: (isRTL ? e.todayStatus : (arToEnEmpStatus[e.todayStatus] || e.todayStatus))
  }));

  const filtered = normalizedEmployees.filter(e => {
    const matchSearch = e.name?.toLowerCase().includes(query.toLowerCase())
     || e.title?.toLowerCase().includes(query.toLowerCase());
    const matchFilter = filter === 'all' || e.todayStatus === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-dark">{t.employees.listTitle}</h2>
          <p className="text-sm text-brown mt-1">{employees.length} {t.employees.employeesCount}</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-green focus-within:ring-2 focus-within:ring-green/10 transition-all">
          <Search size={16} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder={t.employees.searchPlaceholder}
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 outline-none text-sm bg-transparent text-dark placeholder:text-gray-400"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filterOptions.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border
                ${filter === f.key
                  ? 'bg-green text-white border-green shadow-sm'
                  : 'bg-white text-brown border-gray-200 hover:border-green/50'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20 text-green">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">
          <p className="font-semibold">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="font-semibold text-gray-500 text-lg">{t.employees.noEmployees}</p>
          <p className="text-sm mt-1">{t.employees.tryChanging}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(emp => <EmployeeCard key={emp.id} employee={emp} />)}
        </div>
      )}
    </div>
  );
}