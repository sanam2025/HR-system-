import { useState, useEffect } from 'react';
import { Search, CheckCircle2, XCircle, AlertTriangle, ClipboardList, Loader2, LogIn, LogOut, CalendarClock } from 'lucide-react';
import { useLanguage } from '../../../i18n/translations/LanguageContext';
import { ATTENDANCE_STATUS_INFO } from '../../constants';
import { getManagerEmployees, getAttendanceFilter, getAttendanceTodayAnalysis, getAttendanceToday, getMyMonthlyAttendance, submitCheckIn, submitCheckOut } from '../../../api/manager';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../../store/authStore';
import { EmployeesService } from '../../../api/service/HrService/EmployeesService';

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
  const s = status.toLowerCase();
  if (filter === 'present') return s === 'حاضر' || s === 'present';
  if (filter === 'absent')  return s === 'غائب'  || s === 'absent';
  if (filter === 'late')    return s === 'تأخير' || s === 'late';
  return true;
};

const parseMinutes = (val: any): number => {
  if (val === null || val === undefined || val === '' || val === '-') return 0;
  if (typeof val === 'number') return Math.round(val);
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed.includes(':')) {
      const parts = trimmed.split(':').map(Number);
      if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return (parts[0] * 60) + parts[1];
      }
    }
    const n = parseFloat(trimmed);
    return isNaN(n) ? 0 : Math.round(n);
  }
  return 0;
};

const formatTime = (timeVal: any): string | null => {
  if (!timeVal) return null;
  if (typeof timeVal !== 'string') timeVal = String(timeVal);
  const trimmed = timeVal.trim();
  if (!trimmed || trimmed === '-' || trimmed === 'null' || trimmed === 'undefined') return null;

  if (trimmed.includes('T')) {
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    }
    return trimmed.split('T')[1]?.substring(0, 5) || trimmed;
  }
  if (trimmed.includes(' ')) {
    const timePart = trimmed.split(' ')[1];
    return timePart ? timePart.substring(0, 5) : trimmed;
  }
  if (trimmed.includes(':')) {
    return trimmed.substring(0, 5);
  }
  return trimmed;
};

const formatDate = (dateVal: any): string => {
  if (!dateVal) return new Date().toLocaleDateString('en-CA');
  if (typeof dateVal !== 'string') dateVal = String(dateVal);
  const trimmed = dateVal.trim();
  if (trimmed.includes('T')) {
    const d = new Date(trimmed);
    return !isNaN(d.getTime()) ? d.toLocaleDateString('en-CA') : trimmed.split('T')[0];
  }
  if (trimmed.includes(' ')) {
    return trimmed.split(' ')[0];
  }
  return trimmed;
};

export default function AttendanceView() {
  const { t, lang } = useLanguage();
  const { currentUser } = useAuthStore();

  const [activeTab, setActiveTab]       = useState<'byEmployee' | 'generalReport' | 'todayLive'>('byEmployee');
  const qc = useQueryClient();
  
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
        const userRole = currentUser?.role?.toLowerCase() || '';
        const isHrOrAdmin = userRole.includes('hr') || userRole.includes('admin') || userRole.includes('ceo');

        const [empRes, statsRes] = await Promise.all([
          isHrOrAdmin ? EmployeesService.getEmployees() : getManagerEmployees(),
          getAttendanceTodayAnalysis()
        ]);
        let rawEmps = empRes;
        if (rawEmps && !Array.isArray(rawEmps)) {
          rawEmps = rawEmps.data?.data || rawEmps.data?.employees || rawEmps.data || [];
        }
        const emps = Array.isArray(rawEmps) ? rawEmps : [];
        
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
        
        // In byEmployee tab, fetch the full current month to show employee history
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toLocaleDateString('en-CA');
        const todayStr = now.toLocaleDateString('en-CA');

        const from = activeTab === 'byEmployee' ? firstDayOfMonth : startDate;
        const to   = activeTab === 'byEmployee' ? todayStr : endDate;
        
        const filterParams = {
           from,
           to,
           status: activeTab === 'generalReport' ? statusFilter : 'all'
        };
        
        const res = await getAttendanceFilter(filterParams);
        const raw = res?.data?.data || res?.data || res?.attendances || res?.records || res;
        const data = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : []);

        const mappedRecords: AttendanceRecord[] = data.map((r: any) => {
          const empId = r.user?.id ?? r.employee_id ?? r.user_id ?? r.employee?.user_id ?? r.employee?.id ?? r.id;
          const rawStatus = (r.status || 'present').toLowerCase();
          const rawEarlyLeave = r.early_leave_minutes ?? r.early_leave ?? r.early_leave_time ?? r.earlyLeaveMinutes ?? r.earlyLeave ?? r.early_departure ?? r.early_minutes ?? r.early_leave_duration;
          const parsedEarlyLeave = parseMinutes(rawEarlyLeave);

          const rawCheckIn = r.check_in ?? r.attendance?.check_in ?? r.pivot?.check_in ?? r.check_in_time ?? r.checkin ?? r.checkIn ?? r.checkInTime ?? r.time_in ?? r.in_time ?? r.attend_time ?? r.entry_time ?? r.start_time ?? r.clock_in ?? (rawStatus !== 'absent' ? (r.created_at || r.updated_at) : null);
          const rawCheckOut = r.check_out ?? r.attendance?.check_out ?? r.pivot?.check_out ?? r.check_out_time ?? r.checkout ?? r.checkOut ?? r.checkOutTime ?? r.time_out ?? r.out_time ?? r.leave_time ?? r.exit_time ?? r.end_time ?? r.clock_out ?? (parsedEarlyLeave > 0 ? r.updated_at : null);
          const rawDelay = r.delay_minutes ?? r.delay ?? r.delay_time ?? r.late_minutes ?? r.late ?? r.lateMinutes ?? r.delayMinutes ?? r.late_time ?? r.delay_duration ?? r.minutes_late;

          return {
            date: formatDate(r.date || r.attendance_date || r.created_at || rawCheckIn),
            checkIn: formatTime(rawCheckIn),
            checkOut: formatTime(rawCheckOut),
            status: rawStatus,
            delay: parseMinutes(rawDelay),
            earlyLeave: parsedEarlyLeave,
            empId: empId ? Number(empId) : undefined,
            empName: r.user?.full_name ?? r.user?.name ?? r.employee_name ?? r.employeeName ?? r.employee?.name ?? r.name ?? 'بدون اسم',
            empTitle: r.user?.job_title ?? r.user?.title ?? r.employee?.title ?? r.title ?? 'موظف',
            empAvatar: (r.user?.full_name ?? r.user?.name ?? r.employee_name ?? r.employee?.name ?? r.name ?? '👤').charAt(0).toUpperCase()
          };
        });
        setRecords(mappedRecords);
      } catch (err: any) {
        const msg = err?.response?.data?.message || err?.response?.data?.error || err?.message || 'تعذر جلب سجلات الحضور';
        setError(`تعذر جلب سجلات الحضور: ${msg}`);
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
  
  const employeeRecords = records.filter(r => 
    r.empId === selectedEmp || 
    (employee && (
      r.empId === employee.id || 
      (employee.user_id && r.empId === employee.user_id) || 
      (employee.profile_id && r.empId === employee.profile_id)
    ))
  );
  
  const filteredRecords = records.filter(r => 
    matchesStatusFilter(r.status, statusFilter) &&
    (activeTab === 'generalReport' ? (r.date >= startDate && r.date <= endDate) : true)
  );

  // If in byEmployee tab, calculate stats specifically for selected employee;
  // if in generalReport tab, calculate dynamically from filtered records;
  // otherwise use department todayStats
  const empPresentCount = employeeRecords.filter(r => r.status === 'present' || r.status === 'حاضر').length;
  const empAbsentCount  = employeeRecords.filter(r => r.status === 'absent' || r.status === 'غائب').length;
  const empLateCount    = employeeRecords.filter(r => r.status === 'late' || r.status === 'تأخير').length;
  const empTotalCount   = employeeRecords.length;

  const reportPresentCount = filteredRecords.filter(r => r.status === 'present' || r.status === 'حاضر').length;
  const reportAbsentCount  = filteredRecords.filter(r => r.status === 'absent' || r.status === 'غائب').length;
  const reportLateCount    = filteredRecords.filter(r => r.status === 'late' || r.status === 'تأخير').length;
  const reportTotalCount   = filteredRecords.length;

  const present = activeTab === 'byEmployee' 
    ? empPresentCount 
    : (activeTab === 'generalReport' ? reportPresentCount : (todayStats?.present ?? 0));

  const absent = activeTab === 'byEmployee' 
    ? empAbsentCount 
    : (activeTab === 'generalReport' ? reportAbsentCount : (todayStats?.absent ?? 0));

  const late = activeTab === 'byEmployee' 
    ? empLateCount 
    : (activeTab === 'generalReport' ? reportLateCount : (todayStats?.late ?? 0));

  const total = activeTab === 'byEmployee' 
    ? empTotalCount 
    : (activeTab === 'generalReport' ? reportTotalCount : (todayStats?.total ?? 0));

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

  // Extract & translate error message from API response
  const translateApiError = (err: any): string => {
    const msg: string = err?.response?.data?.message || err?.response?.data?.error || err?.message || '';
    // Map common English error messages to Arabic
    if (msg.includes('check in again')) return 'لقد سجّلت حضورك بالفعل هذا اليوم';
    if (msg.includes('check out')) return 'لا يمكن تسجيل الانصراف بدون تسجيل حضور مسبقاً';
    if (msg.includes('already')) return 'تم تسجيل الحضور مسبقاً';
    if (msg.includes('not allowed')) return 'غير مسموح بهذا الإجراء حالياً';
    if (msg.includes('unauthorized') || msg.includes('Unauthorized')) return 'غير مصرح لك بالدخول';
    if (msg.includes('hourly leave')) return 'تحتاج إلى إجازة بالساعة معتمدة لتسجيل الحضور مرة أخرى';
    if (msg) return msg; // return as-is if no translation found
    return 'حدث خطأ، يرجى المحاولة لاحقاً';
  };

  // ── Local check status (updates immediately on success) ──
  const [myCheckStatus, setMyCheckStatus] = useState<'none' | 'checked_in' | 'checked_out'>('none');
  const [checkInTime, setCheckInTime] = useState<string>('');
  const [checkOutTime, setCheckOutTime] = useState<string>('');

  // Fetch today's OWN attendance from API to initialize status
  const { data: myMonthlyAttendance = [] } = useQuery({
    queryKey: ['my-monthly-attendance'],
    queryFn: getMyMonthlyAttendance,
    // Always fetch so we know status on any tab
    staleTime: 60_000,
  });

  // Initialize status from API data when loaded
  useEffect(() => {
    if (!Array.isArray(myMonthlyAttendance) || myMonthlyAttendance.length === 0) return;
    const todayDate = new Date().toISOString().split('T')[0];
    const rec = (myMonthlyAttendance as any[]).find(
      (r: any) => (r.date || r.check_date || r.created_at?.split('T')[0]) === todayDate
    ) || (myMonthlyAttendance as any[])[myMonthlyAttendance.length - 1]; // fallback to last record
    if (!rec) return;
    if (rec.check_out) {
      setMyCheckStatus('checked_out');
      setCheckInTime(rec.check_in || '');
      setCheckOutTime(rec.check_out || '');
    } else if (rec.check_in) {
      setMyCheckStatus('checked_in');
      setCheckInTime(rec.check_in || '');
    }
  }, [myMonthlyAttendance]);

  // Check-in/out mutations
  const checkInMutation = useMutation({
    mutationFn: () => submitCheckIn(),
    onSuccess: (data: any) => {
      const time = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
      setMyCheckStatus('checked_in');
      setCheckInTime(data?.data?.check_in || data?.check_in || time);
      toast.success('سجّلت حضورك بنجاح ✅');
      qc.invalidateQueries({ queryKey: ['attendance-today'] });
      qc.invalidateQueries({ queryKey: ['my-monthly-attendance'] });
    },
    onError: (err: any) => {
      const msg: string = err?.response?.data?.message || err?.response?.data?.error || err?.message || '';
      // If already checked in, switch UI to checked_in state automatically
      if (msg.includes('check in again') || msg.includes('already') || msg.includes('hourly leave')) {
        setMyCheckStatus('checked_in');
        const time = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
        if (!checkInTime) setCheckInTime(time);
        toast.error('سجّلت حضورك بالفعل هذا اليوم — سجّل انصرافك عند انتهاء الدوام', { duration: 5000 });
      } else {
        toast.error(translateApiError(err), { duration: 6000 });
      }
    },
  });
  const checkOutMutation = useMutation({
    mutationFn: () => submitCheckOut(),
    onSuccess: (data: any) => {
      const time = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
      setMyCheckStatus('checked_out');
      setCheckOutTime(data?.data?.check_out || data?.check_out || time);
      toast.success('سجّلت انصرافك بنجاح ✅');
      qc.invalidateQueries({ queryKey: ['attendance-today'] });
      qc.invalidateQueries({ queryKey: ['my-monthly-attendance'] });
    },
    onError: (err: any) => toast.error(translateApiError(err), { duration: 6000 }),
  });

  // Today's live attendance list
  const { data: todayList = [], isLoading: todayLoading } = useQuery({
    queryKey: ['attendance-today'],
    queryFn: getAttendanceToday,
    enabled: activeTab === 'todayLive',
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="text-start">
        <h2 className="text-xl font-extrabold text-dark">{t.attendance.title}</h2>
        <p className="text-sm text-brown mt-1">{t.attendance.subtitle}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {(['byEmployee', 'generalReport', 'todayLive'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2.5 px-4 font-bold text-sm border-b-2 transition-all ${
              activeTab === tab
                ? 'border-green text-green font-extrabold'
                : 'border-transparent text-gray-400 hover:text-dark'
            }`}
          >
            {tab === 'byEmployee' 
              ? t.attendance.tabs.byEmployee 
              : tab === 'generalReport' 
                ? t.attendance.tabs.generalReport 
                : (lang === 'ar' ? 'حضور اليوم' : "Today's Live")}
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
      {activeTab === 'generalReport' && (
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
        </div>
      )}

      {/* ── Today Live Tab ── */}
      {activeTab === 'todayLive' && (
        <div className="space-y-4">
          {/* Today's Attendance List */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-dark">
                {lang === 'ar' ? 'سجل حضور الموظفين اليوم' : "Today's Employees Attendance Log"}
              </h3>
              <span className="text-xs font-semibold bg-green/10 text-green px-2.5 py-1 rounded-full">
                {todayList.length} {lang === 'ar' ? 'سجل' : 'records'}
              </span>
            </div>
            {todayLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin text-green" size={28} /></div>
            ) : todayList.length === 0 ? (
              <p className="text-center py-12 text-gray-400">{t.attendance.noRecords}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-xs font-bold text-brown uppercase tracking-wide">
                      {[t.attendance.employeeCol, t.attendance.columns.status, t.attendance.columns.checkIn, t.attendance.columns.checkOut, t.attendance.columns.delay].map(h => (
                        <th key={h} className="px-5 py-3 text-start">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {todayList.map((rec: any, i: number) => {
                      const name = rec.user?.full_name || rec.user?.name || rec.employee?.user?.full_name || rec.employee?.user?.name || rec.employee_name || rec.employeeName || rec.employee?.name || rec.name || '—';
                      const avatar = name !== '—' ? name.charAt(0).toUpperCase() : '👤';
                      const rawStatus = (rec.status || 'present').toLowerCase();
                      const info = ATTENDANCE_STATUS_INFO[rawStatus];
                      
                      const parsedEarlyLeave = parseMinutes(rec.early_leave_minutes ?? rec.early_leave ?? rec.earlyLeaveMinutes);
                      
                      const rawCheckIn = rec.check_in ?? rec.attendance?.check_in ?? rec.pivot?.check_in ?? rec.check_in_time ?? rec.checkin ?? rec.checkIn ?? rec.checkInTime ?? rec.time_in ?? rec.in_time ?? rec.attend_time ?? rec.entry_time ?? rec.start_time ?? rec.clock_in ?? (rawStatus !== 'absent' ? (rec.created_at || rec.updated_at) : null);
                      const rawCheckOut = rec.check_out ?? rec.attendance?.check_out ?? rec.pivot?.check_out ?? rec.check_out_time ?? rec.checkout ?? rec.checkOut ?? rec.checkOutTime ?? rec.time_out ?? rec.out_time ?? rec.leave_time ?? rec.exit_time ?? rec.end_time ?? rec.clock_out ?? (parsedEarlyLeave > 0 ? rec.updated_at : null);
                      const rawDelay = rec.delay_minutes ?? rec.delay ?? rec.delay_time ?? rec.late_minutes ?? rec.late ?? rec.lateMinutes ?? rec.delayMinutes ?? rec.late_time ?? rec.delay_duration ?? rec.minutes_late;

                      const checkIn = formatTime(rawCheckIn) || '—';
                      const checkOut = formatTime(rawCheckOut) || '—';
                      const delay = parseMinutes(rawDelay);

                      return (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-5 py-3.5 text-start">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-green/20 text-green flex items-center justify-center text-sm font-bold flex-shrink-0">{avatar}</div>
                              <p className="text-sm font-semibold">{name}</p>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-start">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${info?.colorClass ?? 'bg-gray-50 text-gray-700'}`}>
                              {lang === 'ar' ? (info?.labelAr ?? rawStatus) : (info?.labelEn ?? rawStatus)}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-sm text-dark text-start">{checkIn}</td>
                          <td className="px-5 py-3.5 text-sm text-dark text-start">{checkOut}</td>
                          <td className="px-5 py-3.5 text-sm text-start">
                            {delay > 0
                              ? <span className="text-red-500 font-semibold">{delay} {t.attendance.min}</span>
                              : <span className="text-gray-300">—</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Contents */}
      {activeTab !== 'todayLive' && loading ? (
        <div className="flex justify-center items-center py-20 text-green">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
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
                  {error ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-red-500 font-semibold">{error}</td>
                    </tr>
                  ) : employeeRecords.length === 0 ? (
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
      ) : activeTab === 'generalReport' ? (
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
                  {error ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-red-500 font-semibold">{error}</td>
                    </tr>
                  ) : filteredRecords.length === 0 ? (
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
      ) : null}
    </div>
  );
}
