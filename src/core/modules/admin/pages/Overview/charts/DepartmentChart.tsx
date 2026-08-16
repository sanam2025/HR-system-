

import {
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  PieChart,

} from "recharts";
import type { Department } from "../../../types/types";


type DepartmentChartProps = {
    departmentData: Department[] | undefined;
}

function DepartmentChart({
    departmentData
}:DepartmentChartProps) {
    const departmentPieData = departmentData?.map((dept) => ({
        name: dept.name,
        value: dept.users_count,
        color: ["#3b82f6", "#f59e0b", "#8b5cf6", "#10b981", "#ef4444"][dept.id - 1] || "#3b82f6",
    }));
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">Department Distribution</h3>
        <PieChart className="w-5 h-5 text-gray-400" />
        </div>
        <ResponsiveContainer width="100%" height={300}>
        <RePieChart>
            <Pie
            data={departmentPieData}
            cx="50%"
            cy="50%"
            labelLine={true}
            label={({ name, value }) => `${name} (${value})`}
            outerRadius={90}
            dataKey="value"
            >
            {departmentPieData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
            </Pie>
            <Tooltip />
            <Legend />
        </RePieChart>
        </ResponsiveContainer>
    </div>
  )
}

export default DepartmentChart