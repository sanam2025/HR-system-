import { useState } from 'react';
import { mockEmployees } from '../../../data/mockData';
import { Search, CheckCircle2, XCircle, AlertTriangle, ClipboardList } from 'lucide-react';
import { useLanguage } from '../../../i18n/translations/LanguageContext';

const statusInfo: Record<string, { labelAr: string; labelEn: string; colorClass: string }> = {
  'حاضر': { labelAr: 'حاضر', labelEn: 'Present', colorClass: 'bg-green-50 text-green-700 border border-green-200' },
  'Present': { labelAr: 'حاضر', labelEn: 'Present', colorClass: 'bg-green-50 text-green-700 border border-green-200' },
  'غائب': { labelAr: 'غائب', labelEn: 'Absent', colorClass: 'bg-red-50 text-red-600 border border-red-200' },
  'Absent': { labelAr: 'غائب', labelEn: 'Absent', colorClass: 'bg-red-50 text-red-600 border border-red-200' },
  'تأخير': { labelAr: 'تأخير', labelEn: 'Late', colorClass: 'bg-yellow-50 text-yellow-700 border border-yellow-200' },
  'Late': { labelAr: 'تأخير', labelEn: 'Late', colorClass: 'bg-yellow-50 text-yellow-700 border border-yellow-200' },
  'إجازة': { labelAr: 'إجازة', labelEn: 'On Leave', colorClass: 'bg-blue-50 text-blue-700 border border-blue-200' },
  'On Leave': { labelAr: 'إجازة', labelEn: 'On Leave', colorClass: 'bg-blue-50 text-blue-700 border border-blue-200' },
  'Leave': { labelAr: 'إجازة', labelEn: 'On Leave', colorClass: 'bg-blue-50 text-blue-700 border border-blue-200' },
};

// Generates dynamic attendance records per employee to make UI interactive and realistic
const getEmployeeAttendance = (empId: number) => {
  const base = [
    { date: '2026-05-11', checkIn: '08:05', checkOut: '17:00', status: 'حاضر', delay: 5, earlyLeave: 0 },
    { date: '2026-05-10', checkIn: '08:30', checkOut: '17:00', status: 'تأخير', delay: 30, earlyLeave: 0 },
    { date: '2026-05-09', checkIn: '08:00', checkOut: '17:00', status: 'حاضر', delay: 0, earlyLeave: 0 },
    { date: '2026-05-08', checkIn: null, checkOut: null, status: 'غائب', delay: 0, earlyLeave: 0 },
    { date: '2026-05-07', checkIn: '08:10', checkOut: '16:30', status: 'حاضر', delay: 10, earlyLeave: 30 },
    { date: '2026-05-06', checkIn: '08:00', checkOut: '17:00', status: 'حاضر', delay: 0, earlyLeave: 0 },
    { date: '2026-05-05', checkIn: '09:00', checkOut: '17:00', status: 'تأخير', delay: 60, earlyLeave: 0 },
  ];

  if (empId === 1) return base;
  if (empId === 2) { // Sara: always present, no delays
    return base.map(r => r.status === 'غائب' || r.status === 'تأخير' 
      ? { ...r, status: 'حاضر', checkIn: '08:00', checkOut: '17:00', delay: 0, earlyLeave: 0 } 
      : r
    );
  }
  if (empId === 3) { // Mohamed: high absence rate
    return base.map((r, idx) => idx % 2 === 0 
      ? { ...r, status: 'غائب', checkIn: null, checkOut: null, delay: 0, earlyLeave: 0 } 
      : r
    );
  }
  if (empId === 4) { // Layla: present with some early leaves
    return base.map((r, idx) => r.status === 'غائب' 
      ? { ...r, status: 'حاضر', checkIn: '08:00', checkOut: '17:00', delay: 0, earlyLeave: 0 } 
      : idx === 3 ? { ...r, earlyLeave: 45 } : r
    );
  }
  if (empId === 5) { // Khalid: high lateness rate
    return base.map((r, idx) => idx % 2 === 1 
      ? { ...r, status: 'تأخير', checkIn: '08:45', checkOut: '17:00', delay: 45 } 
      : r
    );
  }
  // Nour: app developer, mostly present
  return base.map((r, idx) => idx === 0 ? { ...r, status: 'حاضر', checkIn: '08:00', delay: 0 } : r);
};

export default function AttendanceView() {
  const { t, lang } = useLanguage();
  const [selectedEmp, setSelectedEmp] = useState(mockEmployees[0].id);
  const [query, setQuery] = useState('');

  const filtered = mockEmployees.filter(e => 
    e.name.includes(query) || 
    (e.nameEn || '').toLowerCase().includes(query.toLowerCase())
  );
  const employee = mockEmployees.find(e => e.id === selectedEmp);

  // Fetch dynamic attendance records based on selected employee
  const attendanceRecords = getEmployeeAttendance(selectedEmp);

  // Calculate statistics correctly matching both Arabic and English status values
  const present = attendanceRecords.filter(r => r.status === 'حاضر' || r.status === 'Present').length;
  const absent = attendanceRecords.filter(r => r.status === 'غائب' || r.status === 'Absent').length;
  const late = attendanceRecords.filter(r => r.status === 'تأخير' || r.status === 'Late').length;
  const total = attendanceRecords.length;

  return (
    <div className="space-y-6">
      <div className="text-start">
        <h2 className="text-xl font-extrabold text-dark">{t.attendance.title}</h2>
        <p className="text-sm text-brown mt-1">{t.attendance.subtitle}</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            label: t.attendance.stats.present, 
            value: present, 
            icon: CheckCircle2, 
            bg: 'bg-green-50/60 border border-green-100 text-green-800', 
            iconBg: 'bg-green-500/10', 
            iconColor: 'text-green-600' 
          },
          { 
            label: t.attendance.stats.absent, 
            value: absent, 
            icon: XCircle, 
            bg: 'bg-red-50/60 border border-red-100 text-red-800', 
            iconBg: 'bg-red-500/10', 
            iconColor: 'text-red-600' 
          },
          { 
            label: t.attendance.stats.late, 
            value: late, 
            icon: AlertTriangle, 
            bg: 'bg-yellow-50/60 border border-yellow-100 text-yellow-800', 
            iconBg: 'bg-yellow-500/10', 
            iconColor: 'text-yellow-600' 
          },
          { 
            label: t.attendance.stats.total, 
            value: total, 
            icon: ClipboardList, 
            bg: 'bg-blue-50/60 border border-blue-100 text-blue-800', 
            iconBg: 'bg-blue-500/10', 
            iconColor: 'text-blue-600' 
          },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-5 ${s.bg} flex items-center justify-between shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200`}>
            <div className="text-start">
              <p className="text-xs font-bold uppercase tracking-wider opacity-80">{s.label}</p>
              <p className="text-3xl font-extrabold mt-1.5">{s.value}</p>
            </div>
            <div className={`rounded-2xl flex items-center justify-center p-3 ${s.iconBg}`} style={{ width: 48, height: 48 }}>
              <s.icon size={22} className={s.iconColor} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Employee Selector */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-4 h-fit">
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 mb-3 focus-within:border-green focus-within:ring-2 focus-within:ring-green/10">
            <Search size={14} className="text-gray-400" />
            <input
              type="text"
              placeholder={t.attendance.searchPlaceholder}
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 outline-none text-sm bg-transparent text-start"
              style={{ fontFamily: 'inherit' }}
            />
          </div>
          <div className="space-y-1 max-h-[400px] overflow-y-auto pr-1">
            {filtered.map(emp => (
              <button
                key={emp.id}
                onClick={() => setSelectedEmp(emp.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-start transition-all ${
                  selectedEmp === emp.id
                    ? 'bg-green/10 text-green border border-green/20'
                    : 'hover:bg-gray-50 text-dark'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-green/20 flex items-center justify-center text-green text-sm font-bold flex-shrink-0">
                  {emp.avatar}
                </div>
                <div className="min-w-0 text-start">
                  <p className="text-sm font-semibold truncate">
                    {lang === 'en' ? emp.nameEn || emp.name : emp.name}
                  </p>
                  <p className="text-[10px] text-gray-400 truncate">
                    {lang === 'en' ? emp.titleEn || emp.title : emp.title}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-dark text-start">
              {t.attendance.recordsTitle} <span className="text-green">{lang === 'en' ? employee?.nameEn || employee?.name : employee?.name}</span>
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-xs font-bold text-brown uppercase tracking-wide">
                  {[
                    t.attendance.columns.date,
                    t.attendance.columns.status,
                    t.attendance.columns.checkIn,
                    t.attendance.columns.checkOut,
                    t.attendance.columns.delay,
                    t.attendance.columns.earlyLeave,
                  ].map(h => (
                    <th key={h} className="px-5 py-3 text-start">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {attendanceRecords.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400">
                      {t.attendance.noRecords}
                    </td>
                  </tr>
                ) : (
                  attendanceRecords.map((rec, i) => {
                    const statusObj = statusInfo[rec.status] || { 
                      labelAr: rec.status, 
                      labelEn: rec.status, 
                      colorClass: 'bg-gray-50 text-gray-700 border border-gray-200' 
                    };
                    const statusLabel = lang === 'ar' ? statusObj.labelAr : statusObj.labelEn;

                    return (
                      <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3.5 text-sm text-brown text-start">{rec.date}</td>
                        <td className="px-5 py-3.5 text-start">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusObj.colorClass}`}>
                            {statusLabel}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-dark text-start">{rec.checkIn || '—'}</td>
                        <td className="px-5 py-3.5 text-sm text-dark text-start">{rec.checkOut || '—'}</td>
                        <td className="px-5 py-3.5 text-sm text-start">
                          {rec.delay > 0 ? (
                            <span className="text-red-500 font-semibold">
                              {rec.delay} {t.attendance.min}
                            </span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-sm text-start">
                          {rec.earlyLeave > 0 ? (
                            <span className="text-orange-500 font-semibold">
                              {rec.earlyLeave} {t.attendance.min}
                            </span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}