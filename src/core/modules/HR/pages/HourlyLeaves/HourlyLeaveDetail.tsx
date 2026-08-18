// src/core/modules/HR/pages/HourlyLeaves/HourlyLeaveDetail.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useHourlyLeaveRequest, useApproveHourlyLeave, useRejectHourlyLeave } from '../../hooks/useHourlyLeave';
import Loading from '../../../../../shared/components/Loading';
import toast from 'react-hot-toast';

export const HourlyLeaveDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const leaveId = id ? Number(id) : undefined;

  const { request, isLoading, refetch } = useHourlyLeaveRequest(leaveId);
  const approveMutation = useApproveHourlyLeave();
  const rejectMutation = useRejectHourlyLeave();

  const handleApprove = () => {
    if (!leaveId) return;
    approveMutation.mutate(leaveId, {
      onSuccess: () => {
        refetch();
        toast.success('Hourly leave approved');
      },
    });
  };

  const handleReject = () => {
    if (!leaveId) return;
    rejectMutation.mutate(leaveId, {
      onSuccess: () => {
        refetch();
        toast.success('Hourly leave rejected');
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
          <p className="text-red-600 mb-4">Request not found</p>
          <button onClick={() => navigate('/Hr/hourly-leaves')} className="px-4 py-2 bg-green text-white rounded-lg">
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <button
          onClick={() => navigate('/Hr/hourly-leaves')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hourly Leave Request</h1>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Leave Details
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Date</span>
              <span className="text-sm">{new Date(request.date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Time</span>
              <span className="text-sm">{request.start_time} - {request.end_time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Hours</span>
              <span className="font-medium">{request.hours} hrs</span>
            </div>
            {request.reason && (
              <div>
                <span className="text-sm text-gray-500">Reason</span>
                <p className="text-sm text-gray-700 mt-1">{request.reason}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Status
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Status</span>
              <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(request.status)}`}>
                {request.status}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-sm text-gray-500">Created</span>
              <span className="text-sm">{new Date(request.date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HourlyLeaveDetail;