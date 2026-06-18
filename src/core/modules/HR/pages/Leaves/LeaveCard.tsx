// src/core/modules/HR/pages/Leaves/LeaveCard.tsx
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import type { LeaveRequest } from '../../../../../api/service/HrService/LeaveService';

interface LeaveCardProps {
  request: LeaveRequest;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onView: (id: number) => void;
  isUpdating: boolean;
}

const LeaveCard = ({ request, onApprove, onReject, onView, isUpdating }: LeaveCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'annual': return 'bg-blue-100 text-blue-800';
      case 'sick': return 'bg-red-100 text-red-800';
      case 'emergency': return 'bg-orange-100 text-orange-800';
      case 'unpaid': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
            {request.employee_name?.charAt(0) || '?'}
          </div>
          <span className="ml-3 text-sm font-medium text-gray-900">
            {request.employee_name}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">{request.department || 'N/A'}</td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {new Date(request.start_date).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">{request.days_count} days</td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(request.type)}`}>
          {request.type}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(request.status)}`}>
          {request.status}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          {request.status === 'pending' && (
            <>
              <button
                onClick={() => onApprove(request.id)}
                disabled={isUpdating}
                className="p-1 text-green-500 hover:text-green-700 disabled:opacity-50"
                title="Approve"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => onReject(request.id)}
                disabled={isUpdating}
                className="p-1 text-red-500 hover:text-red-700 disabled:opacity-50"
                title="Reject"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={() => onView(request.id)}
            className="p-1 text-blue-500 hover:text-blue-700"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default LeaveCard;