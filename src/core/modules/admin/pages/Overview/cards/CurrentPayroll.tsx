import type { CurrentPayroll as CurrentPayrollType } from '../../../types/types';
import { Users, CheckCircle, Clock, Award, MinusCircle } from 'lucide-react';
import { useLanguage } from '../../../../../../i18n/translations/LanguageContext';

type CurrentPayrollProps = {
  currentPayroll: CurrentPayrollType | undefined;
};

function CurrentPayroll({
  currentPayroll
}: CurrentPayrollProps) {
  const { lang } = useLanguage();

  const colorClasses = {
    emerald: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
    orange: "bg-orange-50 text-orange-600",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
  };

  const payrollSummaryCards = [
    {
      title: lang === 'ar' ? 'إجمالي الموظفين' : 'Total Employees',
      value: currentPayroll?.summary.employees || 0,
      icon: Users,
      color: "blue",
    },
    {
      title: lang === 'ar' ? 'الإجازات المقبولة' : 'Approved Leaves',
      value: currentPayroll?.summary.approved_leaves || 0,
      icon: CheckCircle,
      color: "emerald",
    },
    {
      title: lang === 'ar' ? 'العمل الإضافي المنجز' : 'Completed Overtime',
      value: currentPayroll?.summary.completed_overtime || 0,
      icon: Clock,
      color: "purple",
    },
    {
      title: lang === 'ar' ? 'المكافآت والحوافز' : 'Incentives',
      value: currentPayroll?.summary.incentives || 0,
      icon: Award,
      color: "orange",
    },
    {
      title: lang === 'ar' ? 'الخصومات' : 'Deductions',
      value: currentPayroll?.summary.deductions || 0,
      icon: MinusCircle,
      color: "red",
    },
  ];  if (!currentPayroll) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">
            {lang === 'ar' ? 'لا توجد بيانات رواتب متاحة' : 'No payroll data available'}
          </p>
        </div>
      </div>
    );
  }

  const dateStr = new Date(
    currentPayroll.payroll.year,
    currentPayroll.payroll.month - 1
  ).toLocaleString(lang === 'ar' ? 'ar-SA' : 'default', { month: 'long', year: 'numeric' });

  const statusLabel = currentPayroll.payroll.status === 'completed'
    ? (lang === 'ar' ? 'مكتمل' : 'completed')
    : (lang === 'ar' ? 'معلق' : 'pending');

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">
          {lang === 'ar' ? `مسير الرواتب الحالي - ${dateStr}` : `Current Payroll - ${dateStr}`}
        </h3>
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            currentPayroll.payroll.status === "completed"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
              currentPayroll.payroll.status === "completed"
                ? "bg-emerald-500"
                : "bg-yellow-500"
            }`}
          ></span>
          {statusLabel}
        </span>
      </div>
      <div className="bg-blue-50 rounded-xl p-4 mb-4">
        <p className="text-sm text-gray-500">{lang === 'ar' ? 'إجمالي الرواتب' : 'Total Salaries'}</p>
        <p className="text-2xl font-bold text-gray-900">
          ${(currentPayroll["total salaries"] || 0).toLocaleString()}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {payrollSummaryCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className={`${colorClasses[card.color as keyof typeof colorClasses]} p-1.5 rounded-lg`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs text-gray-500">{card.title}</p>
              </div>
              <p className="text-sm font-semibold text-gray-800">{card.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CurrentPayroll;