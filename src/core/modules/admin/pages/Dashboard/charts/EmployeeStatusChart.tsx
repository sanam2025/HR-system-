
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type EmployeeStatusChartProps = {
  totalEmployees: number;
  statusData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
};

import { useLanguage } from "../../../../../../i18n/translations/LanguageContext";

export const EmployeeStatusChart = ({ totalEmployees, statusData }: EmployeeStatusChartProps) => {
  const { t } = useLanguage();
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {t.adminDashboard?.employeeStatus || 'Employee Status'}
      </h3>
      {totalEmployees > 0 && statusData.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => {
                  const key = name.toLowerCase() as keyof typeof t.adminDashboard;
                  const translatedName = t.adminDashboard?.[key] || name;
                  return `${translatedName} (${(percent as number * 100).toFixed(0)}%)`;
                }}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2">
            {statusData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-gray-600">
                  {t.adminDashboard?.[item.name.toLowerCase() as keyof typeof t.adminDashboard] || item.name}
                </span>
                <span className="text-sm font-semibold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-[250px] text-gray-400">
          {t.adminDashboard?.noEmployeeData || 'No employee data available'}
        </div>
      )}
    </div>
  );
};