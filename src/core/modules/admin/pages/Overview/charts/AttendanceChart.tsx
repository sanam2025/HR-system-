import { Clock } from 'lucide-react'

import {
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
} from "recharts";
import type { AttendancePrecentage } from '../../../types/types';
import { useLanguage } from '../../../../../../i18n/translations/LanguageContext';

type AttendanceChartProps = {
    attendanceData: AttendancePrecentage | undefined;
}

function AttendanceChart({
    attendanceData
}: AttendanceChartProps) {
    const { lang } = useLanguage();
    
    const attendanceChartData = [
        { name: lang === 'ar' ? 'حاضر' : 'Present', value: attendanceData?.present_percentage || 0, color: "#10b981" },
        { name: lang === 'ar' ? 'غائب' : 'Absent', value: attendanceData?.absent_percentage || 0, color: "#ef4444" },
        { name: lang === 'ar' ? 'متأخر' : 'Late', value: attendanceData?.late_percentage || 0, color: "#f59e0b" },
    ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">
          {lang === 'ar' ? 'توزيع الحضور' : 'Attendance Distribution'}
        </h3>
        <Clock className="w-5 h-5 text-gray-400" />
        </div>
        <ResponsiveContainer width="100%" height={300}>
        <RePieChart>
            <Pie
            data={attendanceChartData}
            cx="50%"
            cy="50%"
            labelLine={true}
            label={({ name, percent }) => `${name} (${((percent as number) * 100).toFixed(0)}%)`}
            outerRadius={90}
            dataKey="value"
            >
            {attendanceChartData.map((entry, index) => (
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

export default AttendanceChart