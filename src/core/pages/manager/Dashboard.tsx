import { mockDashboardStats, mockTasks, mockLeaveRequests, mockPerformanceChart } from '@/data/mockData';
import { Users, CheckSquare, Calendar, TrendingUp } from 'lucide-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';

const taskStatusColors: Record<string, string> = {
  'جديدة': 'bg-blue-50 text-blue-700',
  'قيد التنفيذ': 'bg-yellow-50 text-yellow-700',
  'مكتملة': 'bg-green-50 text-green-700',
  'متأخرة': 'bg-red-50 text-red-600',
};

const taskStatusEn: Record<string, string> = {
  'جديدة': 'New',
  'قيد التنفيذ': 'In Progress',
  'مكتملة': 'Completed',
  'متأخرة': 'Late',
};

function StatCard({ icon: Icon, label, value, sub, iconBg, iconColor }: any) {
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

export default function Dashboard() {
  const navigate = useNavigate();
  const { t, isRTL, lang } = useLanguage();
  const d = t.dashboard;
  const stats = mockDashboardStats;
  const pendingLeaves = mockLeaveRequests.filter(r => r.status === 'معلقة');
  const pendingTasks = mockTasks.filter(tk => tk.status !== 'مكتملة').slice(0, 4);
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const chartMonths: Record<string, string> = {
    'يناير': 'Jan', 'فبراير': 'Feb', 'مارس': 'Mar', 'أبريل': 'Apr', 'مايو': 'May',
  };
  const chartData = mockPerformanceChart.map(row => ({
    ...row,
    month: lang === 'en' ? (chartMonths[row.month] || row.month) : row.month,
  }));

  return (
    <div className="space-y-6">
      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={CheckSquare} label={d.pendingTasks} value={stats.pendingTasks} sub={`${stats.completedTasksThisMonth} ${d.completedThisMonth}`} iconBg="bg-red-50" iconColor="text-red-500" />
        <StatCard icon={Calendar} label={d.attendanceRate} value={`${stats.attendanceRate}%`} sub={d.thisMonth} iconBg="bg-brown/10" iconColor="text-brown" />
        <StatCard icon={TrendingUp} label={d.avgPerformance} value={`★${stats.avgPerformance}`} sub={d.outOf} iconBg="bg-gold/10" iconColor="text-gold" />
        <StatCard icon={Users} label={d.totalEmployees} value={stats.totalEmployees} sub={`${stats.presentToday} ${d.presentToday}`} iconBg="bg-green/10" iconColor="text-green" />
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              <YAxis domain={[3, 5]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="avgRating" name={d.avgRating} stroke="#4A7C59" fill="url(#gGreen)" strokeWidth={2} dot={{ r: 4, fill: '#4A7C59' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card">
          <h2 className="font-bold text-dark text-base mb-5">{d.attendanceChart}</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis domain={[70, 100]} tick={{ fontSize: 12 }} />
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
            {pendingTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between px-6 py-3">
                <div>
                  <p className="text-sm font-semibold text-dark">{task.title}</p>
                  <p className="text-xs text-brown mt-0.5">{task.assigneeName} · {task.dueDate}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${taskStatusColors[task.status]}`}>
                  {lang === 'en' ? (taskStatusEn[task.status] || task.status) : task.status}
                </span>
              </div>
            ))}
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
            {pendingLeaves.length === 0 ? (
              <p className="text-center text-gray-400 py-8 text-sm">{d.noPendingLeaves}</p>
            ) : (
              pendingLeaves.map(req => (
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: d.pendingLeaves, value: stats.pendingLeaves, icon: '🗓️', color: 'text-yellow-600 bg-yellow-50', path: '/manager/leaves' },
          { label: d.pendingOvertime, value: stats.pendingOvertime, icon: '⏰', color: 'text-blue-600 bg-blue-50', path: '/manager/overtime' },
          { label: d.completedTasks, value: stats.completedTasksThisMonth, icon: '✅', color: 'text-green-700 bg-green-50', path: '/manager/tasks' },
          { label: d.presentEmployees, value: `${stats.presentToday}/${stats.totalEmployees}`, icon: '👥', color: 'text-purple-600 bg-purple-50', path: '/manager/attendance' },
        ].map(item => (
          <button key={item.label} onClick={() => navigate(item.path)}
            className={`rounded-2xl p-4 text-${isRTL ? 'right' : 'left'} w-full transition-all hover:shadow-md hover:-translate-y-0.5 ${item.color}`}>
            <span className="text-2xl">{item.icon}</span>
            <p className="text-2xl font-extrabold mt-2">{item.value}</p>
            <p className="text-xs font-semibold mt-1 opacity-80">{item.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
