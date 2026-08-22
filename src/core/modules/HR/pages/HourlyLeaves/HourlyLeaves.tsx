import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Clock } from 'lucide-react';
import { useHourlyLeaveRequests, useApproveHourlyLeave, useRejectHourlyLeave } from '../../hooks/useHourlyLeave';
import HourlyLeaveStats from './HourlyLeaveStats';
import HourlyLeaveCard from './HourlyLeaveCard';
import HourlyLeaveFilters from './HourlyLeaveFilters';
import Loading from '../../../../../shared/components/Loading';
import { useLanguage } from '../../../../../i18n/translations/LanguageContext';

export const HourlyLeaves = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { t, lang } = useLanguage();

  const { requests, isLoading, refetch } = useHourlyLeaveRequests();
  const approveMutation = useApproveHourlyLeave();
  const rejectMutation = useRejectHourlyLeave();

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    approved: requests.filter((r) => r.status === 'approved').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
  };

  const filtered = requests.filter((request) => {
    const matchesSearch = request.employee_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <button
            onClick={() => navigate('/Hr')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-2"
          >
            <ArrowLeft className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} /> {t.hrLeaves?.backToDashboard || 'Back to Dashboard'}
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{t.hrHourlyLeaves?.title || 'Hourly Leave Requests'}</h1>
          <p className="text-gray-500 text-sm mt-1">{t.hrHourlyLeaves?.subtitle || 'Manage hourly leave requests'}</p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          <RefreshCw className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} /> {t.hrLeaves?.refresh || 'Refresh'}
        </button>
      </div>

      <HourlyLeaveStats stats={stats} />
      <HourlyLeaveFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">{t.hrHourlyLeaves?.title || 'Requests'} ({filtered.length})</h3>
        </div>

        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.hrHourlyLeaves?.table?.employee || 'Employee'}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.hrHourlyLeaves?.table?.department || 'Department'}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.hrHourlyLeaves?.table?.date || 'Date'}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.hrHourlyLeaves?.table?.time || 'Time'}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.hrHourlyLeaves?.table?.duration || 'Hours'}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.hrHourlyLeaves?.table?.status || 'Status'}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t.hrHourlyLeaves?.table?.actions || 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((request) => (
                  <HourlyLeaveCard
                    key={request.id}
                    request={request}
                    onApprove={(id) => approveMutation.mutate(id)}
                    onReject={(id) => rejectMutation.mutate(id)}
                    onView={(id) => navigate(`/Hr/hourly-leaves/${id}`)}
                    isUpdating={approveMutation.isPending || rejectMutation.isPending}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-400">
            <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>{t.hrHourlyLeaves?.noRequests || 'No hourly leave requests found'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HourlyLeaves;