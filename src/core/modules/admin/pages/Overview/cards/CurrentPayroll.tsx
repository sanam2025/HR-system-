// core/modules/Admin/components/cards/CurrentPayroll.tsx
import type { CurrentPayroll as CurrentPayrollType } from '../../../types/types';
import { Users, CheckCircle, Clock, Award, MinusCircle } from 'lucide-react';

type CurrentPayrollProps = {
  currentPayroll: CurrentPayrollType | undefined;
};

function CurrentPayroll({
  currentPayroll
}: CurrentPayrollProps) {

  const colorClasses = {
    emerald: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
    orange: "bg-orange-50 text-orange-600",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
  };

  const payrollSummaryCards = [
    {
      title: "Total Employees",
      value: currentPayroll?.summary.employees,
      icon: Users,
      color: "blue",
    },
    {
      title: "Approved Leaves",
      value: currentPayroll?.summary.approved_leaves,
      icon: CheckCircle,
      color: "emerald",
    },
    {
      title: "Completed Overtime",
      value: currentPayroll?.summary.completed_overtime,
      icon: Clock,
      color: "purple",
    },
    {
      title: "Incentives",
      value: `$${currentPayroll?.summary.incentives}`,
      icon: Award,
      color: "orange",
    },
    {
      title: "Deductions",
      value: `$${currentPayroll?.summary.deductions}`,
      icon: MinusCircle,
      color: "red",
    },
  ];

  // Handle loading/undefined state
  if (!currentPayroll) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No payroll data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">
          Current Payroll - {new Date(
            currentPayroll.payroll.year,
            currentPayroll.payroll.month - 1
          ).toLocaleString("default", { month: "long", year: "numeric" })}
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
          {currentPayroll.payroll.status}
        </span>
      </div>
      <div className="bg-blue-50 rounded-xl p-4 mb-4">
        <p className="text-sm text-gray-500">Total Salaries</p>
        <p className="text-2xl font-bold text-gray-900">
          ${currentPayroll["total salaries"].toLocaleString()}
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