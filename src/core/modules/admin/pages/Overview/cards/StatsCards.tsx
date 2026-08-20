import { UserCheck, UserMinus, Users, UserX } from 'lucide-react';
import React from 'react'
import type { AttendancePrecentage, Department } from '../../../types/types';
import { useLanguage } from '../../../../../../i18n/translations/LanguageContext';

type StatsCardsProps = {
    departments: Department[] | undefined;
    precentages: AttendancePrecentage | undefined;
}

function StatsCards({
    departments,
    precentages
}:StatsCardsProps) {
    const { t, lang } = useLanguage();
    
    const stats = [
        {
          title: lang === 'ar' ? 'حاضر' : 'Present',
          value: `${precentages?.present_percentage || 0}%`,
          icon: UserCheck,
          color: "emerald",
        },
        {
          title: lang === 'ar' ? 'غائب' : 'Absent',
          value: `${precentages?.absent_percentage || 0}%`,
          icon: UserX,
          color: "red",
        },
        {
          title: lang === 'ar' ? 'متأخر' : 'Late',
          value: `${precentages?.late_percentage || 0}%`,
          icon: UserMinus,
          color: "orange",
        },
        {
          title: t.adminDashboard?.totalEmployees || (lang === 'ar' ? 'إجمالي الموظفين' : 'Total Employees'),
          value: departments?.reduce((acc, dept) => acc + (dept.users_count || 0), 0) || 0,
          icon: Users,
          color: "blue",
        },
    ];

    const colorClasses = {
        emerald: "bg-emerald-50 text-emerald-600",
        red: "bg-red-50 text-red-600",
        orange: "bg-orange-50 text-orange-600",
        blue: "bg-blue-50 text-blue-600",
        purple: "bg-purple-50 text-purple-600",
    };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
            <div
                key={idx}
                className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all"
            >
                <div className="flex items-center justify-between mb-3">
                <div
                    className={`${colorClasses[stat.color as keyof typeof colorClasses]} p-3 rounded-xl`}
                >
                    <Icon className="w-5 h-5" />
                </div>
                </div>
                <h3 className="text-sm text-gray-500">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
            );
        })}
    </div>
  )
}

export default StatsCards