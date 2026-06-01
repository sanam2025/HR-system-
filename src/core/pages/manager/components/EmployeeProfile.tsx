import { useParams, useNavigate } from 'react-router-dom';
import { mockEmployees, mockTasks, mockAttendance, mockPerformanceChart } from '@/data/mockData';
import { ArrowRight, ArrowLeft, Phone, Mail, Calendar, Star, CheckSquare, Clock } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const taskStatusColors: Record<string, string> = {
  'جديدة': 'bg-blue-50 text-blue-700',
  'قيد التنفيذ': 'bg-yellow-50 text-yellow-700',
  'مكتملة': 'bg-green-50 text-green-700',
  'متأخرة': 'bg-red-50 text-red-600',
};
const taskStatusEn: Record<string, string> = {
  'جديدة': 'New', 'قيد التنفيذ': 'In Progress', 'مكتملة': 'Completed', 'متأخرة': 'Late',
};
const attendanceColorMap: Record<string, string> = {
  'حاضر': 'bg-green-50 text-green-700',
  'غائب': 'bg-red-50 text-red-600',
  'تأخير': 'bg-yellow-50 text-yellow-700',
};

function renderStars(rating: number) {
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={`text-lg ${i < Math.round(rating) ? 'text-gold' : 'text-gray-200'}`}>★</span>
  ));
}

export default function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang, isRTL } = useLanguage();
  const ep = t.employeeProfile;
  const es = t.employees.status;
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const employee = mockEmployees.find(e => e.id === Number(id));
  const empTasks = mockTasks.filter(tk => tk.assigneeId === Number(id));
  const ratedTasks = empTasks.filter(tk => tk.rating);
  const avgRating = ratedTasks.length
    ? (ratedTasks.reduce((s, tk) => s + (tk.rating || 0), 0) / ratedTasks.length).toFixed(1)
    : employee?.avgRating;

  const getAttendanceStatusLabel = (status: string) => {
    if (lang === 'ar') return status;
    return { 'حاضر': es.present, 'غائب': es.absent, 'تأخير': es.late }[status] || status;
  };

  if (!employee) return (
    <div className="text-center py-20 text-gray-400">
      <div className="text-5xl mb-4">🔍</div>
      <p className="text-lg font-semibold">{lang === 'ar' ? 'الموظف غير موجود' : ep.notFound}</p>
      <button onClick={() => navigate('/manager/employees')} className="btn-primary btn mt-4">{ep.backToList}</button>
    </div>
  );

  const todayLabel = lang === 'ar'
    ? employee.todayStatus
    : { 'حاضر': es.present, 'غائب': es.absent, 'تأخير': es.late }[employee.todayStatus] || employee.todayStatus;

  const todayStatusColor =
    employee.todayStatus === 'حاضر' ? 'bg-green-50 text-green-700' :
      employee.todayStatus === 'غائب' ? 'bg-red-50 text-red-600' :
        'bg-yellow-50 text-yellow-700';

  const chartMonths: Record<string, string> = {
    'يناير': 'Jan', 'فبراير': 'Feb', 'مارس': 'Mar', 'أبريل': 'Apr', 'مايو': 'May',
  };
  const chartData = mockPerformanceChart.map(row => ({
    ...row,
    month: lang === 'en' ? (chartMonths[row.month] || row.month) : row.month,
  }));

  return (
    <div className="space-y-6">
      {/* Back */}
      <button onClick={() => navigate('/manager/employees')}
        className="flex items-center gap-2 text-sm text-brown hover:text-green transition-colors font-semibold">
        <BackIcon size={16} /> {ep.backToList}
      </button>

      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green to-green-dark flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
            {employee.avatar}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-extrabold text-dark">{employee.name}</h2>
            <p className="text-brown mt-1">{lang === 'ar' ? employee.title : (employee.titleEn || employee.title)}</p>
            <p className="text-xs text-gray-400 mt-1">{lang === 'ar' ? employee.department : (employee.departmentEn || employee.department)}</p>
            <div className="flex gap-0.5 mt-2">{renderStars(Number(avgRating))}</div>
          </div>
          <div className={`px-3 py-1.5 rounded-full text-sm font-semibold ${todayStatusColor}`}>
            {todayLabel} {ep.today}
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-brown"><Phone size={15} className="text-green" />{employee.phone}</div>
          <div className="flex items-center gap-2 text-sm text-brown"><Mail size={15} className="text-green" />{employee.email}</div>
          <div className="flex items-center gap-2 text-sm text-brown">
            <Calendar size={15} className="text-gold" />{ep.joinDate} {employee.joinDate}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Star size={15} className="text-gold" />
            <span className="font-bold text-dark">{avgRating}</span>
            <span className="text-gray-400">{ep.avgRating}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: ep.leaveBalance, value: `${employee.leaveBalance} ${ep.days}`, icon: '🗓️', bg: 'bg-gold/10 text-yellow-800' },
          { label: ep.totalTasks, value: empTasks.length, icon: '📋', bg: 'bg-green/10 text-green-700' },
          { label: ep.avgRating, value: `${avgRating} ★`, icon: '⭐', bg: 'bg-brown/10 text-brown' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-5 text-center ${s.bg}`}>
            <div className="text-3xl mb-2">{s.icon}</div>
            <p className="text-xl font-extrabold">{s.value}</p>
            <p className="text-xs font-semibold mt-1 opacity-80">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card" style={{ minWidth: 0 }}>
          <h2 className="font-bold text-dark text-base mb-5">{t.dashboard.performanceChart}</h2>
          <div className="h-[300px]" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRatingEmp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4A7C59" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4A7C59" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} domain={[0, 5]} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="avgRating" name={t.dashboard.avgRating} stroke="#4A7C59" strokeWidth={3} fillOpacity={1} fill="url(#colorRatingEmp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card" style={{ minWidth: 0 }}>
          <h2 className="font-bold text-dark text-base mb-5">{t.dashboard.attendanceChart}</h2>
          <div className="h-[300px]" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} domain={[0, 100]} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="attendance" name={t.dashboard.attendancePct} fill="#C4A66A" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-dark flex items-center gap-2">
            <CheckSquare size={16} className="text-green" /> {ep.activeTasks}
          </h3>
        </div>
        {empTasks.length === 0 ? (
          <p className="text-center text-gray-400 py-10 text-sm">{ep.noTasks}</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {empTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="font-semibold text-dark text-sm">{task.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{ep.dueDate} {task.dueDate}</p>
                </div>
                <div className="flex items-center gap-3">
                  {task.rating && <span className="text-gold text-sm font-bold">{task.rating}★</span>}
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${taskStatusColors[task.status]}`}>
                    {lang === 'en' ? (taskStatusEn[task.status] || task.status) : task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Attendance */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-dark flex items-center gap-2">
            <Clock size={16} className="text-gold" /> {ep.attendanceRecord}
          </h3>
        </div>
        <div className="divide-y divide-gray-50">
          {mockAttendance.map((rec, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-3">
              <span className="text-xs text-gray-400 w-24 flex-shrink-0">{rec.date}</span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${attendanceColorMap[rec.status]}`}>
                {getAttendanceStatusLabel(rec.status)}
              </span>
              {rec.checkIn && (
                <span className="text-sm text-brown">
                  {ep.checkIn} {rec.checkIn} {ep.checkOut} {rec.checkOut}
                </span>
              )}
              {rec.delay > 0 && (
                <span className="text-xs text-red-500 ms-auto">
                  {ep.delay} {rec.delay} {ep.mins}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}