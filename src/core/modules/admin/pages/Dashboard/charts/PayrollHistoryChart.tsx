
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type PayrollHistoryChartProps = {
  data: Array<{
    month: string;
    salary: number;
  }>;
};

import { useLanguage } from "../../../../../../i18n/translations/LanguageContext";

export const PayrollHistoryChart = ({ data }: PayrollHistoryChartProps) => {
  const { t } = useLanguage();
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {t.adminDashboard?.payrollHistory || 'Payroll History'}
      </h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, t.adminDashboard?.salary || 'Salary']} />
            <Bar dataKey="salary" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-[250px] text-gray-400">
          {t.adminDashboard?.noPayrollData || 'No payroll data available'}
        </div>
      )}
    </div>
  );
};