import { Users, UserCheck, UserX, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AttendanceStatsProps {
  stats: {
    total: number;
    present: number;
    absent: number;
    late: number;
  };
}

const AttendanceStats = ({ stats }: AttendanceStatsProps) => {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{t('totalEmployees')}</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <Users className="w-8 h-8 text-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{t('present')}</p>
            <p className="text-2xl font-bold text-green-600">{stats.present}</p>
          </div>
          <UserCheck className="w-8 h-8 text-green-500" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{t('absent')}</p>
            <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
          </div>
          <UserX className="w-8 h-8 text-red-500" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-yellow-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{t('late')}</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
          </div>
          <Clock className="w-8 h-8 text-yellow-500" />
        </div>
      </div>
    </div>
  );
};

export default AttendanceStats;