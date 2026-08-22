import { Users, Clock, UserCheck, UserX } from "lucide-react";
import { useLanguage } from "../../../../../i18n/translations/LanguageContext";

interface ApplicantStatsProps {
  stats: {
    total: number;
    pending: number;
    reviewed: number;
    rejected: number;
  };
}

const ApplicantStats = ({ stats }: ApplicantStatsProps) => {
  const { isRTL } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{isRTL ? 'الإجمالي' : 'Total'}</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <Users className="w-8 h-8 text-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-yellow-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{isRTL ? 'قيد الانتظار' : 'Pending'}</p>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </p>
          </div>
          <Clock className="w-8 h-8 text-yellow-500" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-400">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{isRTL ? 'تمت المراجعة' : 'Reviewed'}</p>
            <p className="text-2xl font-bold text-blue-600">{stats.reviewed}</p>
          </div>
          <UserCheck className="w-8 h-8 text-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{isRTL ? 'مرفوض' : 'Rejected'}</p>
            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          </div>
          <UserX className="w-8 h-8 text-red-500" />
        </div>
      </div>
    </div>
  );
};

export default ApplicantStats;
