// src/core/modules/HR/pages/Leaves/Leaves.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, FileText } from 'lucide-react';
import { useLeaveRequests, useApproveLeave, useRejectLeave } from '../../hooks/useLeave';
import LeaveStats from './LeaveStats';
import LeaveCard from './LeaveCard';
import LeaveFilters from './LeaveFilters';
import Loading from '../../../../../shared/components/Loading';
import { useLanguage } from '../../../../../i18n/translations/LanguageContext';

export const Leaves = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const { t, lang } = useLanguage();

  //  جلب طلبات الإجازات
  const { requests, isLoading, refetch } = useLeaveRequests();
  
  //  هوك الموافقة والرفض
  const approveMutation = useApproveLeave();
  const rejectMutation = useRejectLeave();

  //  حساب الإحصائيات
  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    approved: requests.filter((r) => r.status === 'approved').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
  };

  //  فلترة الطلبات (حذف البحث بالاسم واعتماد الفلترة بالحالة والنوع فقط)
  const filtered = requests.filter((request) => {
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesType = typeFilter === 'all' || request.type === typeFilter;
    return matchesStatus && matchesType;
  });

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <button
            onClick={() => navigate('/Hr')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-2"
          >
            <ArrowLeft className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} /> {t.hrLeaves?.backToDashboard || 'Back to Dashboard'}
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{t.hrLeaves?.title || 'Leave Requests'}</h1>
          <p className="text-gray-500 text-sm mt-1">{t.hrLeaves?.subtitle || 'Manage employee leave requests'}</p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
          {t.hrLeaves?.refresh || 'Refresh'}
        </button>
      </div>

      {/* Stats */}
      <LeaveStats stats={stats} />

      {/* Filters (حذفنا searchTerm) */}
      <LeaveFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />

      {/* Records Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            {t.hrLeaves?.title || 'Leave Requests'} ({filtered.length})
          </h3>
        </div>

        {filtered.length > 0 ? (
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.hrLeaves?.table?.employee || 'Employee'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.hrLeaves?.table?.department || 'Department'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.hrLeaves?.table?.startDate || 'Start Date'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.hrLeaves?.table?.days || 'Days'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.hrLeaves?.table?.type || 'Type'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.hrLeaves?.table?.status || 'Status'}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.hrLeaves?.table?.actions || 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((request) => (
                  <LeaveCard
                    key={request.id}
                    request={request}
                    onApprove={(id) => approveMutation.mutate(id)}
                    onReject={(id) => rejectMutation.mutate(id)}
                    onView={(id) => navigate(`/Hr/leaves/${id}`)}
                    isUpdating={approveMutation.isPending || rejectMutation.isPending}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>{t.hrLeaves?.noRequests || 'No leave requests found'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaves;