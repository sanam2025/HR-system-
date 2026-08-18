
import { Clock, TrendingUp, UserX } from "lucide-react";

type AdditionalStatsProps = {
  completedPayrolls: number;
  attendanceRate: number;
  inactiveEmployees: number;
};

export const AdditionalStats = ({ 
  completedPayrolls, 
  attendanceRate, 
  inactiveEmployees 
}: AdditionalStatsProps) => {
  const stats = [
    {
      icon: Clock,
      label: 'Completed Payrolls',
      value: completedPayrolls,
      color: 'orange',
    },
    {
      icon: TrendingUp,
      label: 'Attendance Rate',
      value: `${attendanceRate}%`,
      color: 'teal',
    },
    {
      icon: UserX,
      label: 'Inactive Employees',
      value: inactiveEmployees,
      color: 'red',
    },
  ];

  const colorClasses = {
    orange: 'bg-orange-50 text-orange-600',
    teal: 'bg-teal-50 text-teal-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <div className={`${colorClasses[stat.color as keyof typeof colorClasses]} p-3 rounded-xl`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};