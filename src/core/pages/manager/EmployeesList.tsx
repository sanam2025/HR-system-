import { useState } from 'react';
import { mockEmployees } from '../../../data/mockData';
import EmployeeCard from '../manager/EmployeeCard';
import { Search } from 'lucide-react';

export default function EmployeesList() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const filterOptions = [
    { key: 'all',    label: 'الكل' },
    { key: 'حاضر',  label: 'حاضر' },
    { key: 'غائب',  label: 'غائب' },
    { key: 'تأخير', label: 'تأخير' },
  ];

  const filtered = mockEmployees.filter(e => {
    const matchSearch = e.name.includes(query) || e.title.includes(query);
    const matchFilter = filter === 'all' || e.todayStatus === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-dark">قائمة الموظفين</h2>
          <p className="text-sm text-brown mt-1">{mockEmployees.length} موظف</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-green focus-within:ring-2 focus-within:ring-green/10 transition-all">
          <Search size={16} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="ابحث عن موظف..."
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
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4 opacity-40">👤</div>
          <p className="font-semibold text-gray-500 text-lg">لا يوجد موظفون</p>
          <p className="text-sm mt-1">حاول تغيير كلمة البحث أو الفلتر</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(emp => <EmployeeCard key={emp.id} employee={emp} />)}
        </div>
      )}
    </div>
  );
}