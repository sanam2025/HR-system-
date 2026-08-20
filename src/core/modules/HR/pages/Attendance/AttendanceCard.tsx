// src/core/modules/HR/pages/Attendance/AttendanceCard.tsx
import type { AttendanceRecord } from '../../../../../api/service/HrService/AttendanceService';

interface AttendanceCardProps {
  record: AttendanceRecord;
}

const AttendanceCard = ({ record }: AttendanceCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'leave': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'present': return ' Present';
      case 'absent': return ' Absent';
      case 'late': return ' Late';
      case 'leave': return ' Leave';
      default: return status;
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
            {record.employee_name?.charAt(0) || '?'}
          </div>
          <span className="ml-3 text-sm font-medium text-gray-900">
            {record.employee_name}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">{record.department || 'N/A'}</td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {record.check_in ? new Date(record.check_in).toLocaleTimeString() : '--:--'}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {record.check_out ? new Date(record.check_out).toLocaleTimeString() : '--:--'}
      </td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(record.status)}`}>
          {getStatusText(record.status)}
        </span>
      </td>
    </tr>
  );
};

export default AttendanceCard;