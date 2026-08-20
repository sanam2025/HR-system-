import { Users, UserCheck, UserX, Clock } from 'lucide-react';
import { useLanguage } from '../../../../../i18n/translations/LanguageContext';

interface AttendanceStatsProps {
  stats: {
    total: number;
    present: number;
    absent: number;
    late: number;
  };
}

const AttendanceStats = ({ stats }: AttendanceStatsProps) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{t.hrDashboard?.totalEmployees || 'Total Employees'}</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <Users className="w-8 h-8 text-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{t.attendance?.filter?.present || 'Present'}</p>
            <p className="text-2xl font-bold text-green-600">{stats.present}</p>
          </div>
          <UserCheck className="w-8 h-8 text-green-500" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{t.attendance?.filter?.absent || 'Absent'}</p>
            <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
          </div>
          <UserX className="w-8 h-8 text-red-500" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-yellow-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{t.attendance?.filter?.late || 'Late'}</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
          </div>
          <Clock className="w-8 h-8 text-yellow-500" />
        </div>
      </div>
    </div>
  );
};

export default AttendanceStats;