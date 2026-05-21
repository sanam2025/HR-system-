import { useNavigate } from 'react-router-dom';
import { CheckSquare, Calendar } from 'lucide-react';

const statusColor: Record<string, string> = {
  'حاضر': 'bg-green-50 text-green-700',
  'غائب': 'bg-red-50 text-red-600',
  'تأخير': 'bg-yellow-50 text-yellow-700',
  'إجازة': 'bg-blue-50 text-blue-700',
};

function renderStars(rating: number) {
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < Math.round(rating) ? 'text-gold' : 'text-gray-200'}>★</span>
  ));
}

interface Employee {
  id: number;
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

  return (
    <div
      onClick={() => navigate(`/manager/employees/${employee.id}`)}
      className="bg-white rounded-2xl border border-gray-100 p-6 cursor-pointer transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 hover:border-green/30"
    >
      {/* Avatar + Status */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green to-green-dark flex items-center justify-center text-white text-xl font-bold">
          {employee.avatar}
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[employee.todayStatus] || 'bg-gray-50 text-gray-600'}`}>
          {employee.todayStatus}
        </span>
      </div>

      {/* Info */}
      <h3 className="font-bold text-dark text-base">{employee.name}</h3>
      <p className="text-brown text-sm mt-1">{employee.title}</p>

      {/* Stars */}
      <div className="flex gap-0.5 mt-2 text-sm">{renderStars(employee.avgRating)}</div>
      <p className="text-xs text-gray-400 mt-0.5">{employee.avgRating} / 5</p>

      {/* Stats */}
      <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-xs text-brown">
          <CheckSquare size={13} className="text-green" />
          <span>{employee.tasksCount} مهام</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-brown">
          <Calendar size={13} className="text-gold" />
          <span>{employee.leaveBalance} رصيد إجازة</span>
        </div>
      </div>
    </div>
  );
}