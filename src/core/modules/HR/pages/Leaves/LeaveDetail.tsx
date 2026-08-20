// src/core/modules/HR/pages/Leaves/LeaveDetail.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Briefcase, CheckCircle, XCircle } from 'lucide-react';
import { useLeaveRequest, useApproveLeave, useRejectLeave } from '../../hooks/useLeave';
import Loading from '../../../../../shared/components/Loading';
import toast from 'react-hot-toast';
import { useLanguage } from '../../../../../i18n/translations/LanguageContext';

export const LeaveDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const leaveId = id ? Number(id) : undefined;

  const { request, isLoading, refetch } = useLeaveRequest(leaveId);
  const approveMutation = useApproveLeave();
  const rejectMutation = useRejectLeave();
  const { t, lang } = useLanguage();

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
      <div className="p-6 bg-gray-50 min-h-screen" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-4">{t.hrLeaves?.details?.notFound || 'Leave request not found'}</p>
          <button onClick={() => navigate('/Hr/Leaves')} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            {t.hrLeaves?.details?.back || 'Back to Leaves'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/Hr/Leaves')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} /> {t.hrLeaves?.details?.back || 'Back'}
        </button>

        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t.hrLeaves?.details?.title || 'Leave Request'}</h1>
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
                {approveMutation.isPending ? (t.hrLeaves?.details?.approving || 'Approving...') : (t.hrLeaves?.approve || 'Approve')}
              </button>
              <button
                onClick={handleReject}
                disabled={rejectMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                {rejectMutation.isPending ? (t.hrLeaves?.details?.rejecting || 'Rejecting...') : (t.hrLeaves?.reject || 'Reject')}
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
            <User className="w-4 h-4" /> {t.hrLeaves?.details?.employeeInfo || 'Employee'}
          </h3>
          <div className="space-y-2">
            <p className="text-gray-900 font-medium">{request.employee_name}</p>
            <p className="text-sm text-gray-500">{t.hrLeaves?.details?.id || 'ID'}: #{request.employee_id}</p>
            <p className="text-sm text-gray-500">{request.department || 'N/A'}</p>
          </div>
        </div>

        {/* Leave Details */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> {t.hrLeaves?.details?.leaveDetails || 'Leave Details'}
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">{t.hrLeaves?.table?.type || 'Type'}</span>
              <span className={`px-2 py-0.5 text-xs rounded-full ${getTypeColor(request.type)}`}>
                {request.type === 'annual' && (t.hrLeaves?.filterAnnual || 'Annual')}
                {request.type === 'sick' && (t.hrLeaves?.filterSick || 'Sick')}
                {request.type === 'emergency' && 'Emergency'}
                {request.type === 'unpaid' && (t.hrLeaves?.filterUnpaid || 'Unpaid')}
                {!['annual', 'sick', 'emergency', 'unpaid'].includes(request.type) && request.type}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">{t.hrLeaves?.table?.days || 'Days'}</span>
              <span className="font-medium">{request.days_count}</span>
            </div>
            {request.reason && (
              <div>
                <span className="text-sm text-gray-500">{t.hrLeaves?.details?.reason || 'Reason'}</span>
                <p className="text-sm text-gray-700 mt-1">{request.reason}</p>
              </div>
            )}
          </div>
        </div>

        {/* Dates & Status */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> {t.hrLeaves?.details?.dates || 'Dates'}
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">{t.hrLeaves?.details?.start || 'Start'}</span>
              <span className="text-sm">{new Date(request.start_date).toLocaleDateString()}</span>
            </div>
            {request.end_date && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">{t.hrLeaves?.details?.end || 'End'}</span>
                <span className="text-sm">{new Date(request.end_date).toLocaleDateString()}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t">
              <span className="text-sm text-gray-500">{t.hrLeaves?.table?.status || 'Status'}</span>
              <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(request.status)}`}>
                {request.status === 'pending' && (t.hrLeaves?.statusPending || 'Pending')}
                {request.status === 'approved' && (t.hrLeaves?.statusApproved || 'Approved')}
                {request.status === 'rejected' && (t.hrLeaves?.statusRejected || 'Rejected')}
                {!['pending', 'approved', 'rejected'].includes(request.status) && request.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveDetail;