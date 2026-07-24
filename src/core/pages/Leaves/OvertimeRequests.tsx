import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useLanguage } from '../../../i18n/translations/LanguageContext';
import { useRequestsStore } from '@/store/requestsStore';

const statusEn: Record<string, string> = { 'معلقة': 'Pending', 'موافقة': 'Approved', 'مرفوضة': 'Rejected' };

export default function OvertimeRequests() {
  const { t, lang } = useLanguage();
  const ov = t.overtime;
  const c = t.common;

  const requests = useRequestsStore((s) => s.overtimeRequests);
  const updateOvertimeRequestStatus = useRequestsStore((s) => s.updateOvertimeRequestStatus);
  const pending = requests.filter(r => r.status === 'معلقة').length;

  const handleAction = (id: number, action: 'approve' | 'reject') => {
    const status = action === 'approve' ? 'موافقة' : 'مرفوضة';
    updateOvertimeRequestStatus(id, status);
    toast.success(action === 'approve' ? ov.toasts.approved : ov.toasts.rejected, { duration: 3000 });
  };

  const getStatusBadge = (status: string) => {
    const label = lang === 'ar' ? status : (statusEn[status] || status);
    const cls = status === 'موافقة' ? 'bg-green-50 text-green-700' : status === 'مرفوضة' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-700';
    return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}>{label}</span>;
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-center" />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-dark">{ov.title}</h2>
          <p className="text-sm text-brown mt-1">{pending} {ov.subtitle}</p>
        </div>
        {pending > 0 && (
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl px-4 py-2 text-sm font-semibold">
            <AlertTriangle size={15} /> {pending} {ov.pendingAlert}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {requests.map(req => (
          <div key={req.id} className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 hover:shadow-card-hover transition-all">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                  {req.employeeName[0]}
                </div>
                <div>
                  <p className="font-bold text-dark">{req.employeeName}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{ov.requestedOn}: {req.requestDate}</p>
                </div>
              </div>
              {getStatusBadge(req.status)}
            </div>

            <div className="mt-4 flex flex-wrap gap-5 text-sm text-brown">
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-blue-500" />
                {req.hours} {ov.hoursLabel}
              </span>
              <span>📅 {ov.dateLabel}: {req.date}</span>
              <span>📝 {ov.reasonLabel}: {req.reason}</span>
            </div>

            {req.status === 'معلقة' && (
              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                <button onClick={() => handleAction(req.id, 'approve')}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-50 text-green-700 hover:bg-green hover:text-white font-semibold py-2 rounded-xl text-sm transition-all">
                  <CheckCircle size={16} /> {c.approve}
                </button>
                <button onClick={() => handleAction(req.id, 'reject')}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-semibold py-2 rounded-xl text-sm transition-all">
                  <XCircle size={16} /> {c.reject}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}