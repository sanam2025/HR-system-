import { mockDashboardStats, mockTasks, mockPerformanceChart } from '../../../data/mockData';
import { Users, CheckSquare, Calendar, TrendingUp, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  getDepartmentLeaveRequests,
  getUsersCount,
  getAttendanceTodayAnalysis,
  getDepartmentPerformance,
  getCompletedTasksCountThisMonth,
  getTasks,
  getDepartmentOvertimeRequests
} from '../../../api/manager';
import { useLanguage } from '../../../i18n/translations/LanguageContext';
import type { LucideIcon } from 'lucide-react';
import { TASK_STATUS_COLORS, TASK_STATUS_EN, CHART_MONTHS_EN } from '../../constants';
import ActiveAnnouncements from '../Announcements/components/ActiveAnnouncements';

// ── Sub-components ──

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sub?: string;
  iconBg: string;
  iconColor: string;
}

function StatCard({ icon: Icon, label, value, sub, iconBg, iconColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
      <div className={`rounded-2xl flex items-center justify-center flex-shrink-0 ${iconBg}`} style={{ width: 52, height: 52 }}>
        <Icon size={24} className={iconColor} />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-dark">{value}</p>
        <p className="text-sm text-brown mt-0.5">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ── Page ──

export default function Dashboard() {
  const navigate = useNavigate();
  const { t, isRTL, lang } = useLanguage();
  const d = t.dashboard;
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  // 1. Users count (GET users/count)
  const { data: usersCountData } = useQuery({
    queryKey: ['users-count'],
    queryFn: getUsersCount,
  });

  // 2. Attendance Analysis Today (GET attendance-today-analysis)
  const { data: attendanceAnalysisData } = useQuery({
    queryKey: ['attendance-today-analysis'],
    queryFn: getAttendanceTodayAnalysis,
  });

  // 3. Department Performance (GET department/performance)
  const { data: deptPerformanceData } = useQuery({
    queryKey: ['department-performance'],
    queryFn: getDepartmentPerformance,
  });

  // 4. Completed Tasks This Month (GET counttasks/completed-count-this-month)
  const { data: completedTasksData } = useQuery({
    queryKey: ['completed-tasks-count'],
    queryFn: getCompletedTasksCountThisMonth,
    retry: false,          // الـ endpoint غير موجود بعد — لا تعيد المحاولة
    throwOnError: false,   // لا تُظهر خطأ في الواجهة
  });

  // 5. Tasks (GET tasks)
  const { data: rawTasks = [], isLoading: loadingTasks } = useQuery({
    queryKey: ['manager-tasks'],
    queryFn: getTasks,
  });

  // 6. Pending Leaves (GET department-leave-request)
  const { data: rawLeaves = [], isLoading: loadingLeaves } = useQuery({
    queryKey: ['department-pending-leaves'],
    queryFn: () => getDepartmentLeaveRequests() // Fetch all to filter locally safely
  });

  // 7. Department Overtime Requests (GET my-department-overtime)
  const { data: rawOvertimes = [] } = useQuery({
    queryKey: ['department-overtime-requests'],
    queryFn: getDepartmentOvertimeRequests,
  });

  // Helper to extract nested counts
  const extractCount = (obj: any, keys: string[]) => {
    if (obj == null) return 0;
    if (typeof obj === 'number') return obj;
    const unwrapped = obj.data?.data ?? obj.data ?? obj;
    for (const k of keys) {
      if (unwrapped[k] !== undefined && unwrapped[k] !== null) {
        return Number(unwrapped[k]);
      }
    }
    return 0;
  };

  // Process numbers & stats safely
  const totalEmployees = extractCount(usersCountData, ['employees_count', 'employees', 'total_employees', 'count']);
  const presentToday = extractCount(attendanceAnalysisData, ['present_today', 'presentCount', 'present']);
  const attendanceRate = extractCount(attendanceAnalysisData, ['attendance_rate', 'rate', 'percentage']);

  const completedTasksThisMonth = extractCount(completedTasksData, ['completed_count', 'count', 'completedTasksThisMonth', 'completed']);

  const getArray = (obj: any) => {
    if (!obj) return [];
    if (Array.isArray(obj)) return obj;
    if (Array.isArray(obj.data)) return obj.data;
    if (Array.isArray(obj.data?.data)) return obj.data.data;
    if (Array.isArray(obj.overtimes)) return obj.overtimes;
    if (Array.isArray(obj.leave_requests)) return obj.leave_requests;
    if (Array.isArray(obj.requests)) return obj.requests;
    if (Array.isArray(obj.department_leaves)) return obj.department_leaves;
    return [];
  };

  const safeOvertimes = getArray(rawOvertimes);
  const pendingOvertimeCount = safeOvertimes.filter((o: any) => {
    const s = typeof o.status === 'string' ? o.status.toLowerCase() : '';
    return s.includes('pending') || s === 'قيد الانتظار' || s === 'معلقة' || !o.status;
  }).length;

  const safeLeaves = getArray(rawLeaves);
  const pendingLeavesCount = safeLeaves.filter((l: any) => {
    const s = typeof l.status === 'string' ? l.status.toLowerCase() : '';
    return s.includes('pending') || s === 'قيد الانتظار' || s === 'معلقة' || !l.status;
  }).length;

  const pendingLeaves = safeLeaves.map((req: any) => ({
    id: req.id,
    employeeName: req.name || req.employee?.user?.full_name || req.employee?.user?.name || req.user?.full_name || req.user?.name || req.employee?.name || req.employee_name || req.user_name || req.employeeName || 'غير متوفر',
    type: req.type || 'إجازة',
    from: req.start_date || req.from || '',
    to: req.end_date || req.to || '',
    days: req.days_count || req.days || 1,
  }));

  const safeTasksList = getArray(rawTasks);
  const activeTasks = safeTasksList;
  const pendingTasksList = activeTasks.filter((tk: any) => tk.status !== 'مكتملة' && tk.status !== 'completed').slice(0, 4).map((tk: any) => ({
    id: tk.id,
    title: tk.title || tk.task_name || 'مهمة بدون عنوان',
    assigneeName: tk.assigneeName || tk.assigned_to_user?.name || tk.user?.name || 'غير محدد',
    dueDate: tk.dueDate || tk.due_date || '',
    status: tk.status || 'قيد الانتظار',
  }));

  const pendingTasksCount = activeTasks.filter((tk: any) => tk.status !== 'مكتملة' && tk.status !== 'completed').length;
  // Map performance chart data
  const rawChart = Array.isArray(deptPerformanceData)
    ? deptPerformanceData
    : (Array.isArray(deptPerformanceData?.data) ? deptPerformanceData.data : (Array.isArray(deptPerformanceData?.monthly) ? deptPerformanceData.monthly : null));

  const chartData = rawChart && rawChart.length > 0
    ? rawChart.map((row: any) => ({
        month: row.quarter || (lang === 'en' ? (CHART_MONTHS_EN[row.month] ?? row.month) : (row.month || 'يناير')),
        avgRating: row.score ?? row.avgRating ?? row.rating ?? 0,
        attendance: row.attendance ?? row.attendance_rate ?? 0,
      }))
    : [];

  // احسب متوسط الأداء من بيانات الأرباع إن وجدت
  const avgPerformance = (() => {
    if (rawChart && rawChart.length > 0) {
      const scores = rawChart.map((r: any) => r.score ?? r.avgRating ?? r.rating ?? 0).filter((s: number) => s > 0);
      if (scores.length > 0) {
        const avg = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
        return avg.toFixed(1);
      }
    }
    return deptPerformanceData?.avg_performance ?? deptPerformanceData?.rating ?? 0;
  })();

  return (
    <div className="space-y-6">
      {/* ── التعميمات النشطة — تختفي إذا لم يوجد تعميمات ── */}
      <ActiveAnnouncements />

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={CheckSquare} label={d.pendingTasks} value={pendingTasksCount} sub={`${completedTasksThisMonth} ${d.completedThisMonth}`} iconBg="bg-red-50" iconColor="text-red-500" />
        <StatCard icon={Calendar} label={d.attendanceRate} value={`${attendanceRate}%`} sub={d.thisMonth} iconBg="bg-brown/10" iconColor="text-brown" />
        <StatCard icon={TrendingUp} label={d.avgPerformance} value={`★${avgPerformance}`} sub={d.outOf} iconBg="bg-gold/10" iconColor="text-gold" />
        <StatCard icon={Users} label={d.totalEmployees} value={totalEmployees} sub={`${presentToday} ${d.presentToday}`} iconBg="bg-green/10" iconColor="text-green" />
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card">
          <h2 className="font-bold text-dark text-base mb-5">{d.performanceChart}</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="gGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4A7C59" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#4A7C59" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis 
                domain={[0, 5]} 
                tick={{ fontSize: 12, dx: isRTL ? -15 : 0 }} 
                width={40} 
              />
              <Tooltip />
              <Area type="monotone" dataKey="avgRating" name={d.avgRating} stroke="#4A7C59" fill="url(#gGreen)" strokeWidth={2} dot={{ r: 4, fill: '#4A7C59' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card">
          <h2 className="font-bold text-dark text-base mb-5">{d.attendanceChart}</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis 
                domain={[50, 100]} 
                tick={{ fontSize: 12, dx: isRTL ? -15 : 0 }} 
                width={45} 
              />
              <Tooltip />
              <Bar dataKey="attendance" name={d.attendancePct} fill="#C4A66A" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Lists ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Tasks */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-dark">{d.pendingTasksList}</h2>
            <button onClick={() => navigate('/manager/tasks')} className="text-green text-sm font-semibold flex items-center gap-1 hover:underline">
              {t.common.viewAll} <ArrowIcon size={14} />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {loadingTasks ? (
              <div className="flex justify-center p-8"><Loader2 className="animate-spin text-green" /></div>
            ) : pendingTasksList.length === 0 ? (
              <p className="text-center text-gray-400 py-8 text-sm">{isRTL ? 'لا يوجد مهام معلقة' : 'No pending tasks'}</p>
            ) : (
              pendingTasksList.map((task: any) => (
                <div key={task.id} className="flex items-center justify-between px-6 py-3">
                  <div>
                    <p className="text-sm font-semibold text-dark">{task.title}</p>
                    <p className="text-xs text-brown mt-0.5">{task.assigneeName} {task.dueDate ? `· ${task.dueDate}` : ''}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${TASK_STATUS_COLORS[task.status] || 'bg-gray-100 text-gray-700'}`}>
                    {lang === 'en' ? (TASK_STATUS_EN[task.status] ?? task.status) : task.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending Leaves */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-dark">{d.pendingLeavesList}</h2>
            <button onClick={() => navigate('/manager/leaves')} className="text-green text-sm font-semibold flex items-center gap-1 hover:underline">
              {t.common.viewAll} <ArrowIcon size={14} />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {loadingLeaves ? (
              <div className="flex justify-center p-8"><Loader2 className="animate-spin text-green" /></div>
            ) : pendingLeaves.length === 0 ? (
              <p className="text-center text-gray-400 py-8 text-sm">{d.noPendingLeaves}</p>
            ) : (
              pendingLeaves.map((req: any) => (
                <div key={req.id} className="flex items-center justify-between px-6 py-3">
                  <div>
                    <p className="text-sm font-semibold text-dark">{req.employeeName}</p>
                    <p className="text-xs text-brown mt-0.5">{req.type} · {req.from} → {req.to}</p>
                  </div>
                  <span className="text-xs bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-full font-semibold">
                    {req.days} {t.common.days}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => navigate('/manager/leaves')}
          className="rounded-2xl p-4 text-right w-full transition-all hover:shadow-md hover:-translate-y-0.5 text-yellow-600 bg-yellow-50"
        >
          <p className="text-2xl font-extrabold mt-2">{pendingLeavesCount}</p>
          <p className="text-xs font-semibold mt-1 opacity-80">{d.pendingLeaves}</p>
        </button>

        <button
          onClick={() => navigate('/manager/overtime')}
          className="rounded-2xl p-4 text-right w-full transition-all hover:shadow-md hover:-translate-y-0.5 text-blue-600 bg-blue-50"
        >
          <p className="text-2xl font-extrabold mt-2">{pendingOvertimeCount}</p>
          <p className="text-xs font-semibold mt-1 opacity-80">{d.pendingOvertime}</p>
        </button>

        <button
          onClick={() => navigate('/manager/tasks')}
          className="rounded-2xl p-4 text-right w-full transition-all hover:shadow-md hover:-translate-y-0.5 text-green-700 bg-green-50"
        >
          <p className="text-2xl font-extrabold mt-2">
            {completedTasksThisMonth > 0 
              ? completedTasksThisMonth 
              : safeTasksList.filter((tk: any) => {
                  const st = typeof tk.status === 'string' ? tk.status.toLowerCase().trim() : '';
                  return st === 'مكتملة' || st === 'completed' || st === 'approved' || st === 'تمت';
                }).length}
          </p>
          <p className="text-xs font-semibold mt-1 opacity-80">{d.completedTasks}</p>
        </button>

        <button
          onClick={() => navigate('/manager/attendance')}
          className="rounded-2xl p-4 text-right w-full transition-all hover:shadow-md hover:-translate-y-0.5 text-purple-600 bg-purple-50"
        >
          <p className="text-2xl font-extrabold mt-2">{`${presentToday}/${totalEmployees}`}</p>
          <p className="text-xs font-semibold mt-1 opacity-80">{d.presentEmployees}</p>
        </button>
      </div>
    </div>
  );
}

