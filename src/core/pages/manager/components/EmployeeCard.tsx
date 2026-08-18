import { useNavigate } from 'react-router-dom';
import { CheckSquare } from 'lucide-react';
import { useLanguage } from '../../../../i18n/translations/LanguageContext';

const statusColor: Record<string, string> = {
  'Present': 'bg-green-50 text-green-700',
  'Absent': 'bg-red-50 text-red-600',
  'Late': 'bg-yellow-50 text-yellow-700',
  'Leave': 'bg-blue-50 text-blue-700',
};



interface Employee {
  id: number;
  profile_id?: number;
  name: string;
  title: string;
  avatar: string;
  avgRating: number;
  todayStatus: string;
  tasksCount: number;
  leaveBalance: number;
}

export default function EmployeeCard({ employee }: { employee: Employee }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const statusLabel = t.employees.status[employee.todayStatus.toLowerCase() as keyof typeof t.employees.status] || employee.todayStatus;

  return (
    <div
      onClick={() => navigate(`/manager/employees/${employee.profile_id || employee.id}`)}
      className="bg-white rounded-3xl border border-gray-100 p-6 cursor-pointer transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 hover:border-green/20 group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-green/5 rounded-full blur-xl -mr-12 -mt-12 group-hover:bg-green/10 transition-colors"></div>
      
      {/* Avatar + Status */}
      <div className="flex items-start justify-between mb-5 relative z-10">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green to-green-dark flex items-center justify-center text-white text-2xl font-bold shadow-md ring-4 ring-gray-50 group-hover:ring-green/10 transition-all">
          {employee.avatar}
        </div>
        <span className={`text-xs font-bold px-3 py-1.5 rounded-xl backdrop-blur-sm ${statusColor[employee.todayStatus] || 'bg-gray-50 text-gray-600'}`}>
          {statusLabel}
        </span>
      </div>

      {/* Info */}
      <h3 className="font-extrabold text-dark text-lg relative z-10">{employee.name}</h3>
      <p className="text-brown text-sm font-medium mt-1 relative z-10">{employee.title}</p>

      {/* Stats */}
      <div className="flex gap-4 mt-5 pt-4 border-t border-gray-100/60 relative z-10">
        <div className="flex items-center gap-2 text-xs font-bold text-brown bg-gray-50 px-3 py-1.5 rounded-lg">
          <CheckSquare size={14} className="text-green" />
          <span>{employee.tasksCount} {t.employees.tasks}</span>
        </div>
      </div>
    </div>
  );
}
