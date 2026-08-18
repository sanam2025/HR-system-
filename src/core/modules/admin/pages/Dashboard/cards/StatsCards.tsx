
import { Users, UserCheck, Building, AlertCircle } from "lucide-react";

type Stat = {
  title: string;
  value: number;
  icon: string;
  color: string;
};

type StatsCardsProps = {
  stats: Stat[];
};

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  purple: 'bg-purple-50 text-purple-600',
  red: 'bg-red-50 text-red-600',
};

const iconMap = {
  Users: Users,
  UserCheck: UserCheck,
  Building: Building,
  AlertCircle: AlertCircle,
};

export const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = iconMap[stat.icon as keyof typeof iconMap];
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${colorClasses[stat.color as keyof typeof colorClasses]} p-3 rounded-xl`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};