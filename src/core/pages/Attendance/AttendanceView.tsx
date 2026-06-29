import { useState, useEffect } from 'react';
import { Search, CheckCircle2, XCircle, AlertTriangle, ClipboardList, Loader2 } from 'lucide-react';
import { useLanguage } from '../../../i18n/translations/LanguageContext';
import { ATTENDANCE_STATUS_INFO } from '../../constants';
import { getManagerEmployees, getAttendanceFilter, getAttendanceTodayAnalysis } from '../../../api/manager';

// ── Types ──
type AttendanceRecord = {
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: string;
  delay: number;
  earlyLeave: number;
  empId?: number;
  empName?: string;
  empNameEn?: string;
  empAvatar?: string;
  empTitle?: string;
  empTitleEn?: string;
};

type StatusFilter = 'all' | 'present' | 'absent' | 'late';

// ── Helpers ──
const matchesStatusFilter = (status: string, filter: StatusFilter): boolean => {
  if (filter === 'all') return true;
  if (filter === 'present') return status === 'حاضر' || status === 'Present';
  if (filter === 'absent')  return status === 'غائب'  || status === 'Absent';
  if (filter === 'late')    return status === 'تأخير' || status === 'Late';
  return true;
};

export default function AttendanceView() {
  const { t, lang } = useLanguage();

  const [activeTab, setActiveTab]       = useState<'byEmployee' | 'generalReport'>('byEmployee');
  
  // Data states
  const [employees, setEmployees] = useState<any[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [todayStats, setTodayStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Filter states
  const [selectedEmp, setSelectedEmp]   = useState<number | null>(null);
  const [query, setQuery]               = useState('');
  const [startDate, setStartDate]       = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate]           = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  // 1. Fetch Employees & Today's Analysis on mount
  useEffect(() => {
    const initFetch = async () => {
      try {
        const [empRes, statsRes] = await Promise.all([
          getManagerEmployees(),
          getAttendanceTodayAnalysis()
        ]);
        const emps = Array.isArray(empRes) ? empRes : (empRes?.data || []);
        
        const mappedEmps = emps.map((e: any) => ({
          ...e,
          avatar: e.name ? e.name.charAt(0).toUpperCase() : '👤'
        }));
        
        setEmployees(mappedEmps);
        if (mappedEmps.length > 0) {
          setSelectedEmp(mappedEmps[0].id);
        }
        setTodayStats(statsRes);
      } catch (err) {
        console.error(err);
      }
    };
    initFetch();
  }, []);

  // 2. Fetch records when tab, date, or status changes
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        setError('');
        
        const filterParams = {
           from: startDate,
           to: endDate,
           status: activeTab === 'generalReport' ? statusFilter : 'all'
        };
        
        const res = await getAttendanceFilter(filterParams);
        const data = Array.isArray(res) ? res : (res?.data || []);
        
        const mappedRecords: AttendanceRecord[] = data.map((r: any) => ({
          date: r.date || r.created_at?.split('T')[0] || startDate,
          checkIn: r.check_in || null,
          checkOut: r.check_out || null,
          status: r.status || 'حاضر',
          delay: r.delay_minutes || 0,
          earlyLeave: r.early_leave_minutes || 0,
          empId: r.user?.id,
          empName: r.user?.name || 'بدون اسم',
          empTitle: r.user?.title || 'موظف',
          empAvatar: r.user?.name ? r.user.name.charAt(0).toUpperCase() : '👤'
        }));
        setRecords(mappedRecords);
      } catch (err) {
        setError('تعذر جلب سجلات الحضور');
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [startDate, endDate, statusFilter, activeTab]);

  const filteredEmployees = employees.filter(e =>
    e.name?.includes(query) || (e.nameEn ?? '').toLowerCase().includes(query.toLowerCase())
  );
  
  const employee = employees.find(e => e.id === selectedEmp);
  
  const employeeRecords = records.filter(r => r.empId === selectedEmp);
  
  const filteredRecords = records.filter(r => matchesStatusFilter(r.status, statusFilter));

  const present = todayStats?.present ?? 0;
  const absent  = todayStats?.absent ?? 0;
  const late    = todayStats?.late ?? 0;
  const total   = todayStats?.total ?? 0;

  const summaryCards = [
    { label: t.attendance.stats.present, value: present, icon: CheckCircle2,   bg: 'bg-green-50/60 border border-green-100 text-green-800',   iconBg: 'bg-green-500/10',  iconColor: 'text-green-600'  },
    { label: t.attendance.stats.absent,  value: absent,  icon: XCircle,        bg: 'bg-red-50/60 border border-red-100 text-red-800',          iconBg: 'bg-red-500/10',    iconColor: 'text-red-600'    },
    { label: t.attendance.stats.late,    value: late,    icon: AlertTriangle,  bg: 'bg-yellow-50/60 border border-yellow-100 text-yellow-800', iconBg: 'bg-yellow-500/10', iconColor: 'text-yellow-600' },
    { label: t.attendance.stats.total,   value: total,   icon: ClipboardList,  bg: 'bg-blue-50/60 border border-blue-100 text-blue-800',       iconBg: 'bg-blue-500/10',   iconColor: 'text-blue-600'   },
  ];

  const filterButtons: { id: StatusFilter; label: string }[] = [
    { id: 'all',     label: t.attendance.filter.all     },
    { id: 'present', label: t.attendance.filter.present },
    { id: 'absent',  label: t.attendance.filter.absent  },
    { id: 'late',    label: t.attendance.filter.late    },
  ];

  const getStatusLabel = (status: string) => {
    const info = ATTENDANCE_STATUS_INFO[status];
    return lang === 'ar' ? (info?.labelAr ?? status) : (info?.labelEn ?? status);
  };

  const getStatusColor = (status: string) =>
    ATTENDANCE_STATUS_INFO[status]?.colorClass ?? 'bg-gray-50 text-gray-700 border border-gray-200';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-start">
        <h2 className="text-xl font-extrabold text-dark">{t.attendance.title}</h2>
        <p className="text-sm text-brown mt-1">{t.attendance.subtitle}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {(['byEmployee', 'generalReport'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2.5 px-4 font-bold text-sm border-b-2 transition-all ${
              activeTab === tab
                ? 'border-green text-green font-extrabold'
                : 'border-transparent text-gray-400 hover:text-dark'
            }`}
          >
            {tab === 'byEmployee' ? t.attendance.tabs.byEmployee : t.attendance.tabs.generalReport}
          </button>
        ))}
      </div>

      {/* Summary Stats (Today) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map(s => (
          <div key={s.label} className={`rounded-2xl p-5 ${s.bg} flex items-center justify-between shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200`}>
            <div className="text-start">
              <p className="text-xs font-bold uppercase tracking-wider opacity-85">{s.label}</p>
              <p className="text-3xl font-extrabold mt-1.5">{s.value}</p>
            </div>
            <div className={`rounded-2xl flex items-center justify-center p-3 ${s.iconBg}`} style={{ width: 48, height: 48 }}>
              <s.icon size={22} className={s.iconColor} />
            </div>
          </div>
        ))}
      </div>

      {/* General Report Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 flex flex-wrap gap-6 items-end">
        <div className="flex-1 min-w-[200px] text-start">
          <label className="block text-xs font-bold text-brown uppercase mb-2">{t.attendance.filter.fromDate}</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-dark focus:border-green outline-none"
          />
        </div>
        <div className="flex-1 min-w-[200px] text-start">
          <label className="block text-xs font-bold text-brown uppercase mb-2">{t.attendance.filter.toDate}</label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-dark focus:border-green outline-none"
          />
        </div>
        
        {activeTab === 'generalReport' && (
          <div className="flex-2 min-w-[280px] text-start">
            <label className="block text-xs font-bold text-brown uppercase mb-2">{t.attendance.filter.status}</label>
            <div className="flex flex-wrap gap-1.5">
              {filterButtons.map(btn => (
                <button
                  key={btn.id}
                  onClick={() => setStatusFilter(btn.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                    statusFilter === btn.id
                      ? 'bg-green text-white border-green shadow-sm'
                      : 'bg-white text-brown border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tab Contents */}
      {loading ? (
        <div className="flex justify-center items-center py-20 text-green">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-500 font-semibold">{error}</div>
      ) : activeTab === 'byEmployee' ? (
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
              {filteredEmployees.map(emp => (
                <button
                  key={emp.id}
                  onClick={() => setSelectedEmp(emp.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-start transition-all ${
                    selectedEmp === emp.id
                      ? 'bg-green/10 text-green border border-green/20 font-semibold'
                      : 'hover:bg-gray-50 text-dark'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-green/20 flex items-center justify-center text-green text-sm font-bold flex-shrink-0">
                    {emp.avatar}
                  </div>
                  <div className="min-w-0 text-start">
                    <p className="text-sm font-semibold truncate">
                      {lang === 'en' ? emp.nameEn ?? emp.name : emp.name}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">
                      {lang === 'en' ? emp.titleEn ?? emp.title : emp.title}
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
                {t.attendance.recordsTitle}{' '}
                <span className="text-green">{lang === 'en' ? employee?.nameEn ?? employee?.name : employee?.name}</span>
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-xs font-bold text-brown uppercase tracking-wide">
                    {[t.attendance.columns.date, t.attendance.columns.status, t.attendance.columns.checkIn, t.attendance.columns.checkOut, t.attendance.columns.delay, t.attendance.columns.earlyLeave].map(h => (
                      <th key={h} className="px-5 py-3 text-start">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {employeeRecords.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-gray-400">{t.attendance.noRecords}</td>
                    </tr>
                  ) : (
                    employeeRecords.map((rec, i) => (
                      <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3.5 text-sm text-brown text-start">{rec.date}</td>
                        <td className="px-5 py-3.5 text-start">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(rec.status)}`}>
                            {getStatusLabel(rec.status)}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-dark text-start">{rec.checkIn ?? '—'}</td>
                        <td className="px-5 py-3.5 text-sm text-dark text-start">{rec.checkOut ?? '—'}</td>
                        <td className="px-5 py-3.5 text-sm text-start">
                          {rec.delay > 0
                            ? <span className="text-red-500 font-semibold">{rec.delay} {t.attendance.min}</span>
                            : <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-5 py-3.5 text-sm text-start">
                          {rec.earlyLeave > 0
                            ? <span className="text-orange-500 font-semibold">{rec.earlyLeave} {t.attendance.min}</span>
                            : <span className="text-gray-300">—</span>}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* General Report Table */
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-dark text-start">{t.attendance.tabs.generalReport}</h3>
            <span className="text-xs font-semibold bg-green/10 text-green px-2.5 py-1 rounded-full">
              {filteredRecords.length} {lang === 'ar' ? 'سجل' : 'records'}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-xs font-bold text-brown uppercase tracking-wide">
                  <th className="px-5 py-3 text-start">{t.attendance.employeeCol}</th>
                  <th className="px-5 py-3 text-start">{t.attendance.columns.date}</th>
                  <th className="px-5 py-3 text-start">{t.attendance.columns.status}</th>
                  <th className="px-5 py-3 text-start">{t.attendance.columns.checkIn}</th>
                  <th className="px-5 py-3 text-start">{t.attendance.columns.checkOut}</th>
                  <th className="px-5 py-3 text-start">{t.attendance.columns.delay}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400">{t.attendance.noRecords}</td>
                  </tr>
                ) : (
                  filteredRecords.map((rec, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5 text-start">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green/20 flex items-center justify-center text-green text-sm font-bold flex-shrink-0">
                            {rec.empAvatar}
                          </div>
                          <div className="min-w-0 text-start">
                            <p className="text-sm font-semibold truncate">
                              {lang === 'en' ? rec.empNameEn ?? rec.empName : rec.empName}
                            </p>
                            <p className="text-[10px] text-gray-400 truncate">
                              {lang === 'en' ? rec.empTitleEn ?? rec.empTitle : rec.empTitle}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-brown text-start">{rec.date}</td>
                      <td className="px-5 py-3.5 text-start">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(rec.status)}`}>
                          {getStatusLabel(rec.status)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-dark text-start">{rec.checkIn ?? '—'}</td>
                      <td className="px-5 py-3.5 text-sm text-dark text-start">{rec.checkOut ?? '—'}</td>
                      <td className="px-5 py-3.5 text-sm text-start">
                        {rec.delay != null && rec.delay > 0
                          ? <span className="text-red-500 font-semibold">{rec.delay} {t.attendance.min}</span>
                          : <span className="text-gray-300">—</span>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}