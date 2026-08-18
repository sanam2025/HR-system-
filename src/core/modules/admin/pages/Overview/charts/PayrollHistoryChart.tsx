import { DollarSign } from "lucide-react";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { Payrolls } from "../../../types/types";

type PayrollHistoryChartProps = {
  payrollHistory: Payrolls[] | undefined;
};

function PayrollHistoryChart({ payrollHistory }: PayrollHistoryChartProps) {

  const payrollChartData = payrollHistory
    ?.filter((item) => item.status === "completed")
    .map((item) => ({
      month: new Date(item.year, item.month - 1).toLocaleString("default", {
        month: "short",
      }),
      salary: item.total_salary,
    })) || [];

  const hasData = payrollChartData.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">Payroll History</h3>
        <DollarSign className="w-5 h-5 text-gray-400" />
      </div>

      {hasData ? (
        <ResponsiveContainer width="100%" height={300}>
          <ReBarChart data={payrollChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value: any) => {
                if (typeof value === 'number') {
                  return [`$${value.toLocaleString()}`, "Salary"];
                }
                return [value, "Salary"];
              }}
            />
            <Legend />
            <Bar
              dataKey="salary"
              fill="#3b82f6"
              radius={[8, 8, 0, 0]}
              name="Total Salary"
            />
          </ReBarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
          <DollarSign className="w-12 h-12 mb-2" />
          <p className="text-sm">No completed payroll data available</p>
        </div>
      )}
    </div>
  );
}

export default PayrollHistoryChart;