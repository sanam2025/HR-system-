// src/core/modules/HR/pages/Leaves/LeaveDetail.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Briefcase, CheckCircle, XCircle } from 'lucide-react';
import { useLeaveRequest, useApproveLeave, useRejectLeave } from '../../hooks/useLeave';
import Loading from '../../../../../shared/components/Loading';
import toast from 'react-hot-toast';

export const LeaveDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const leaveId = id ? Number(id) : undefined;

  const { request, isLoading, refetch } = useLeaveRequest(leaveId);
  const approveMutation = useApproveLeave();
  const rejectMutation = useRejectLeave();

  const handleApprove = () => {
    if (!leaveId) return;
    approveMutation.mutate(leaveId, {
      onSuccess: () => {
        refetch();
        toast.success('Leave request approved');
      },
    });
  };

  const handleReject = () => {
    if (!leaveId) return;
    rejectMutation.mutate(leaveId, {
      onSuccess: () => {
        refetch();
        toast.success('Leave request rejected');
      },
    });
  };

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

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-4">Leave request not found</p>
          <button onClick={() => navigate('/Hr/Leaves')} className="px-4 py-2 bg-green text-white rounded-lg">
            Back to Leaves
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/Hr/Leaves')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leave Request</h1>
            <p className="text-gray-500 text-sm mt-1">#{request.id} • {request.employee_name}</p>
          </div>
          {request.status === 'pending' && (
            <div className="flex gap-2">
              <button
                onClick={handleApprove}
                disabled={approveMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                {approveMutation.isPending ? 'Approving...' : 'Approve'}
              </button>
              <button
                onClick={handleReject}
                disabled={rejectMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                {rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Employee Info */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
            <User className="w-4 h-4" /> Employee
          </h3>
          <div className="space-y-2">
            <p className="text-gray-900 font-medium">{request.employee_name}</p>
            <p className="text-sm text-gray-500">ID: #{request.employee_id}</p>
            <p className="text-sm text-gray-500">{request.department || 'N/A'}</p>
          </div>
        </div>

        {/* Leave Details */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> Leave Details
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Type</span>
              <span className={`px-2 py-0.5 text-xs rounded-full ${getTypeColor(request.type)}`}>
                {request.type}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Days</span>
              <span className="font-medium">{request.days_count}</span>
            </div>
            {request.reason && (
              <div>
                <span className="text-sm text-gray-500">Reason</span>
                <p className="text-sm text-gray-700 mt-1">{request.reason}</p>
              </div>
            )}
          </div>
        </div>

        {/* Dates & Status */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Dates
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Start</span>
              <span className="text-sm">{new Date(request.start_date).toLocaleDateString()}</span>
            </div>
            {request.end_date && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">End</span>
                <span className="text-sm">{new Date(request.end_date).toLocaleDateString()}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t">
              <span className="text-sm text-gray-500">Status</span>
              <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(request.status)}`}>
                {request.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveDetail;