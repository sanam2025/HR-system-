import { useParams, useNavigate } from 'react-router-dom';
import { mockEmployees, mockTasks, mockAttendance } from '../../../../data/mockData';
import { ArrowLeft, Phone, Mail, Calendar, Star, CheckSquare, Clock } from 'lucide-react';
import { useLanguage } from '../../../../i18n/translations/LanguageContext';

const taskStatusColors: { [key: string]: string } = {
  'New': 'bg-blue-50 text-blue-700',
  'In Progress': 'bg-yellow-50 text-yellow-700',
  'Completed': 'bg-green-50 text-green-700',
  'Late': 'bg-red-50 text-red-600',
};

const attendanceColorMap: { [key: string]: string } = {
  'Present': 'bg-green-50 text-green-700',
  'Absent': 'bg-red-50 text-red-600',
  'Late': 'bg-yellow-50 text-yellow-700',
};

function renderStars(rating: number) {
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={`text-lg ${i < Math.round(rating) ? 'text-gold' : 'text-gray-200'}`}>★</span>
  ));
}

export default function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const arToEnEmpStatus: Record<string, string> = { 'حاضر': 'Present', 'غائب': 'Absent', 'تأخير': 'Late' };
  const arToEnTaskStatus: Record<string, string> = { 'جديدة': 'New', 'قيد التنفيذ': 'In Progress', 'مكتملة': 'Completed', 'متأخرة': 'Late' };
  
  const rawEmployee = mockEmployees.find(e => e.id === Number(id));
  const employee = rawEmployee ? { ...rawEmployee, todayStatus: arToEnEmpStatus[rawEmployee.todayStatus] || rawEmployee.todayStatus } : undefined;

  const rawEmpTasks = mockTasks.filter(tk => tk.assigneeId === Number(id));
  const empTasks = rawEmpTasks.map(tk => ({ ...tk, status: arToEnTaskStatus[tk.status] || tk.status }));
  const ratedTasks = empTasks.filter(tk => tk.rating !== null && tk.rating !== undefined);
  const avgRating = ratedTasks.length
    ? ratedTasks.reduce((s, tk) => s + (tk.rating ?? 0), 0) / ratedTasks.length
    : employee?.avgRating ?? 0;
  const avgRatingDisplay = avgRating.toFixed(1);

  if (!employee) return (
    <div className="text-center py-20 text-gray-400">
      <div className="text-5xl mb-4">🔍</div>
      <p className="text-lg font-semibold">{t.employeeProfile.notFound}</p>
      <button onClick={() => navigate('/manager/employees')} className="btn-primary btn mt-4">{t.employeeProfile.back}</button>
    </div>
  );

  const todayStatusColor =
    employee.todayStatus === 'Present' ? 'bg-green-50 text-green-700' :
    employee.todayStatus === 'Absent' ? 'bg-red-50 text-red-600' :
    'bg-yellow-50 text-yellow-700';

  return (
    <div className="space-y-6">
      {/* Back */}
      <button onClick={() => navigate('/manager/employees')}
        className="flex items-center gap-2 text-sm text-brown hover:text-green transition-colors font-semibold">
        <ArrowLeft size={16} /> {t.employeeProfile.backToList}
      </button>

      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green to-green-dark flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
            {employee.avatar}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-extrabold text-dark">{employee.name}</h2>
            <p className="text-brown mt-1">{employee.title}</p>
            <p className="text-xs text-gray-400 mt-1">{employee.department}</p>
            <div className="flex gap-0.5 mt-2">{renderStars(avgRating)}</div>
          </div>
          <div className={`px-3 py-1.5 rounded-full text-sm font-semibold ${todayStatusColor}`}>
            {t.employees.status[employee.todayStatus.toLowerCase() as keyof typeof t.employees.status] || employee.todayStatus} {t.employeeProfile.today}
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-brown"><Phone size={15} className="text-green" />{employee.phone}</div>
          <div className="flex items-center gap-2 text-sm text-brown"><Mail size={15} className="text-green" />{employee.email}</div>
          <div className="flex items-center gap-2 text-sm text-brown">
            <Calendar size={15} className="text-gold" />{t.employeeProfile.joinDate} {employee.joinDate}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Star size={15} className="text-gold" />
            <span className="font-bold text-dark">{avgRatingDisplay}</span>
            <span className="text-gray-400">/ 5</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl p-5 text-center bg-gold/10 text-yellow-800">
          <div className="text-3xl mb-2">🗓️</div>
          <p className="text-xl font-extrabold">{employee.leaveBalance} {t.employeeProfile.days}</p>
          <p className="text-xs font-semibold mt-1 opacity-80">{t.employeeProfile.leaveBalance}</p>
        </div>
        <div className="rounded-2xl p-5 text-center bg-green/10 text-green-700">
          <div className="text-3xl mb-2">📋</div>
          <p className="text-xl font-extrabold">{empTasks.length}</p>
          <p className="text-xs font-semibold mt-1 opacity-80">{t.employeeProfile.totalTasks}</p>
        </div>
        <div className="rounded-2xl p-5 text-center bg-brown/10 text-brown">
          <div className="text-3xl mb-2">⭐</div>
          <p className="text-xl font-extrabold">{avgRatingDisplay} ★</p>
          <p className="text-xs font-semibold mt-1 opacity-80">{t.employeeProfile.avgRating}</p>
        </div>
      </div>

      {/* Tasks */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-dark flex items-center gap-2">
            <CheckSquare size={16} className="text-green" /> {t.employeeProfile.activeTasks}
          </h3>
        </div>
        {empTasks.length === 0 ? (
          <p className="text-center text-gray-400 py-10 text-sm">{t.employeeProfile.noTasks}</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {empTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="font-semibold text-dark text-sm">{task.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{t.employeeProfile.dueDate} {task.dueDate}</p>
                </div>
                <div className="flex items-center gap-3">
                  {task.rating && <span className="text-gold text-sm font-bold">{task.rating}★</span>}
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${taskStatusColors[task.status]}`}>
                    {t.tasks.columns[task.status.toLowerCase().replace(' ', '') as keyof typeof t.tasks.columns] || task.status}
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
            <Clock size={16} className="text-gold" /> {t.employeeProfile.attendanceRecord}
          </h3>
        </div>
        <div className="divide-y divide-gray-50">
          {mockAttendance.map((rawRec, i) => {
            const rec = { ...rawRec, status: arToEnEmpStatus[rawRec.status] || rawRec.status };
            return (
            <div key={i} className="flex items-center gap-4 px-6 py-3">
              <span className="text-xs text-gray-400 w-24 flex-shrink-0">{rec.date}</span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${attendanceColorMap[rec.status]}`}>
                {t.employees.status[rec.status.toLowerCase() as keyof typeof t.employees.status] || rec.status}
              </span>
              {rec.checkIn && (
                <span className="text-sm text-brown">
                  {t.employeeProfile.checkIn} {rec.checkIn} {t.employeeProfile.checkOut} {rec.checkOut}
                </span>
              )}
              {rec.delay > 0 && (
                <span className="text-xs text-red-500 ml-auto">
                  {t.employeeProfile.delay} {rec.delay} {t.employeeProfile.mins}
                </span>
              )}
            </div>
          )})}
        </div>
      </div>
    </div>
  );
}