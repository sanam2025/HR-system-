import { mockDashboardStats, mockTasks, mockLeaveRequests, mockPerformanceChart } from '@/data/mockData';
import { Users, CheckSquare, Calendar, TrendingUp, ArrowLeft, ArrowRight } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../i18n/translations/LanguageContext';

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
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className={`rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`} style={{ width: 48, height: 48 }}>
        <Icon size={24} className={iconColor} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
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

  const chartMonths: Record<string, string> = {
    'يناير': 'Jan', 'فبراير': 'Feb', 'مارس': 'Mar', 'أبريل': 'Apr', 'مايو': 'May',
  };

  const chartData = mockPerformanceChart.map(row => ({
    ...row,
    month: lang === 'en' ? (chartMonths[row.month] || row.month) : row.month,
  }));

  const pendingLeaves = mockLeaveRequests.filter(r => r.status === 'معلقة');
  const pendingTasks = mockTasks.filter(tk => tk.status !== 'مكتملة').slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label={d?.totalEmployees} value={stats.totalEmployees} sub={`${stats.presentToday} ${d?.presentToday}`} iconBg="bg-blue-50" iconColor="text-blue-600" />
        <StatCard icon={TrendingUp} label={d?.avgPerformance} value={`${stats.avgPerformance}★`} sub={d?.outOf} iconBg="bg-amber-50" iconColor="text-amber-500" />
        <StatCard icon={CheckSquare} label={d?.pendingTasks} value={stats.pendingTasks} sub={lang === 'en' ? 'Recent Tasks' : 'المهام الأخيرة'} iconBg="bg-rose-50" iconColor="text-rose-500" />
        <StatCard icon={Calendar} label={d?.pendingLeaves} value={stats.pendingLeaves} sub={lang === 'en' ? 'Pending Requests' : 'الطلبات المعلقة'} iconBg="bg-emerald-50" iconColor="text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-6">{d?.performanceChart}</h2>
          <div className="h-[300px]" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} domain={[0, 5]} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="avgRating" name={d?.avgRating} stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRating)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-6">{d?.attendanceChart}</h2>
          <div className="h-[300px]" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} domain={[0, 100]} />
                <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="attendance" name={d?.attendanceRate} fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800">{lang === 'en' ? 'Recent Tasks' : 'المهام الأخيرة'}</h2>
            <button onClick={() => navigate('/manager/tasks')} className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1">
              {t.common.viewAll} {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            </button>
          </div>
          <div className="space-y-3">
            {pendingTasks.length === 0 ? (
              <p className="text-center text-gray-500 py-4 text-sm">No tasks</p>
            ) : (
              pendingTasks.map(task => (
                <div key={task.id} className="p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-800">{task.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{task.assigneeName}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${taskStatusColors[task.status] || 'bg-gray-100 text-gray-600'}`}>
                    {lang === 'en' ? (taskStatusEn[task.status] || task.status) : task.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800">{lang === 'en' ? 'Pending Requests' : 'الطلبات المعلقة'}</h2>
            <button onClick={() => navigate('/manager/leaves')} className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1">
              {t.common.viewAll} {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            </button>
          </div>
          <div className="space-y-3">
            {pendingLeaves.length === 0 ? (
              <p className="text-center text-gray-500 py-4 text-sm">No requests</p>
            ) : (
              pendingLeaves.map(req => (
                <div key={req.id} className="p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-800">{req.employeeName}</p>
                    <p className="text-xs text-gray-500 mt-1">{req.type} · {req.from} → {req.to}</p>
                  </div>
                  <span className="text-xs bg-amber-50 text-amber-600 px-3 py-1 rounded-full font-semibold">
                    {req.days} {t.common.days}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
