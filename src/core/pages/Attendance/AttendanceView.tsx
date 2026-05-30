import { useState } from 'react';
import { mockEmployees, mockAttendance } from '../../../data/mockData';
import { Search } from 'lucide-react';
import { useLanguage } from '../../../i18n/translations/LanguageContext';

const statusColors = {
  'Present': 'bg-green-50 text-green-700',
  'Absent': 'bg-red-50 text-red-600',
  'Late': 'bg-yellow-50 text-yellow-700',
};

export default function AttendanceView() {
  const { t } = useLanguage();
  const [selectedEmp, setSelectedEmp] = useState(mockEmployees[0].id);
  const [query, setQuery] = useState('');

  const filtered = mockEmployees.filter(e => e.name.includes(query) || (e.nameEn || '').toLowerCase().includes(query.toLowerCase()));
  const employee = mockEmployees.find(e => e.id === selectedEmp);

  const present = mockAttendance.filter(r => r.status === 'Present').length;
  const absent = mockAttendance.filter(r => r.status === 'Absent').length;
  const late = mockAttendance.filter(r => r.status === 'Late').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-dark">{t.attendance.title}</h2>
        <p className="text-sm text-brown mt-1">{t.attendance.subtitle}</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: t.attendance.stats.present, value: present, icon: '✅', bg: 'bg-green-50 text-green-700' },
          { label: t.attendance.stats.absent, value: absent, icon: '❌', bg: 'bg-red-50 text-red-600' },
          { label: t.attendance.stats.late, value: late, icon: '⚠️', bg: 'bg-yellow-50 text-yellow-700' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-5 ${s.bg} flex items-center gap-4`}>
            <span className="text-3xl">{s.icon}</span>
            <div>
              <p className="text-2xl font-extrabold">{s.value}</p>
              <p className="text-xs font-semibold opacity-80">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Employee Selector */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-4">
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 mb-3 focus-within:border-green focus-within:ring-2 focus-within:ring-green/10">
            <Search size={14} className="text-gray-400" />
            <input
              type="text"
              placeholder={t.attendance.searchPlaceholder}
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 outline-none text-sm bg-transparent"
              style={{ fontFamily: 'inherit' }}
            />
          </div>
          <div className="space-y-1">
            {filtered.map(emp => (
              <button
                key={emp.id}
                onClick={() => setSelectedEmp(emp.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                  selectedEmp === emp.id
                    ? 'bg-green/10 text-green border border-green/20'
                    : 'hover:bg-gray-50 text-dark'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-green/20 flex items-center justify-center text-green text-sm font-bold flex-shrink-0">
                  {emp.avatar}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{emp.name}</p>
                  <p className="text-[10px] text-gray-400 truncate">{emp.titleEn || emp.title}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="md:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-dark">
              {t.attendance.recordsTitle} <span className="text-green">{employee?.name}</span>
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-xs font-bold text-brown uppercase tracking-wide">
                  {[t.attendance.columns.date, t.attendance.columns.status, t.attendance.columns.checkIn, t.attendance.columns.checkOut, t.attendance.columns.delay, t.attendance.columns.earlyLeave].map((h, i) => (
                    <th key={i} className="px-5 py-3 text-left rtl:text-right">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {mockAttendance.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400">
                      {t.attendance.noRecords}
                    </td>
                  </tr>
                ) : (
                  mockAttendance.map((rec, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5 text-sm text-brown">{rec.date}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[rec.status as keyof typeof statusColors] || ''}`}>
                          {t.employees.status[rec.status.toLowerCase() as keyof typeof t.employees.status] || rec.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-dark">{rec.checkIn || '—'}</td>
                      <td className="px-5 py-3.5 text-sm text-dark">{rec.checkOut || '—'}</td>
                      <td className="px-5 py-3.5 text-sm">
                        {rec.delay > 0 ? (
                          <span className="text-red-500 font-semibold">{rec.delay} {t.attendance.min}</span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-sm">
                        {rec.earlyLeave > 0 ? (
                          <span className="text-orange-500 font-semibold">{rec.earlyLeave} {t.attendance.min}</span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}