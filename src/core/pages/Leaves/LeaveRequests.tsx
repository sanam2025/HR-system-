import { useState } from 'react';
import { CheckCircle, XCircle, Calendar, User, Clock, AlertTriangle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useLanguage } from '../../../i18n/translations/LanguageContext';
import { useRequestsStore } from '@/store/requestsStore';

const typeColors: Record<string, string> = {
  'سنوية': 'bg-blue-50 text-blue-700',
  'مرضية': 'bg-red-50 text-red-600',
  'طارئة': 'bg-orange-50 text-orange-700',
  'بدون راتب': 'bg-gray-100 text-gray-600',
};

export default function LeaveRequests() {
  const { t } = useLanguage();
  const tabs = [t.leaves.tabs.all, t.leaves.tabs.pending, t.leaves.tabs.approved, t.leaves.tabs.rejected];
  const tabKeys = ['all', 'معلقة', 'موافقة', 'مرفوضة'];

  const requests = useRequestsStore((s) => s.leaveRequests);
  const updateLeaveRequestStatus = useRequestsStore((s) => s.updateLeaveRequestStatus);

  const [activeTabIdx, setActiveTabIdx] = useState(1); // default: Pending
  const [confirm, setConfirm] = useState<{ id: number; action: 'approve' | 'reject' } | null>(null);

  const activeKey = tabKeys[activeTabIdx];
  const filtered = requests.filter(r => activeKey === 'all' || r.status === activeKey);
  const pendingCount = requests.filter(r => r.status === 'معلقة').length;

  const handleAction = (id: number, action: 'approve' | 'reject') => {
    const newStatus = action === 'approve' ? 'موافقة' : 'مرفوضة';
    updateLeaveRequestStatus(id, newStatus);
    toast.success(action === 'approve' ? t.leaves.toast.approved : t.leaves.toast.rejected, { duration: 3000 });
    setConfirm(null);
  };

  const getStatusBadge = (status: string) => {
    const cls = status === 'موافقة'
      ? 'bg-green-50 text-green-700'
      : status === 'مرفوضة'
        ? 'bg-red-50 text-red-600'
        : 'bg-yellow-50 text-yellow-700';
    const label = status === 'موافقة' ? t.leaves.tabs.approved : status === 'مرفوضة' ? t.leaves.tabs.rejected : t.leaves.tabs.pending;
    return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}>{label}</span>;
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-dark">{t.leaves.title}</h2>
          <p className="text-sm text-brown mt-1">{pendingCount} {t.leaves.pendingReview}</p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl px-4 py-2 text-sm font-semibold">
            <AlertTriangle size={15} /> {pendingCount} {t.leaves.pendingAttention}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
        {tabs.map((tab, i) => (
          <button key={i} onClick={() => setActiveTabIdx(i)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${activeTabIdx === i ? 'bg-white text-green shadow-sm' : 'text-brown hover:text-dark'}`}>
            {tab}
            {i === 1 && pendingCount > 0 && (
              <span className="ms-1.5 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4 opacity-40">📋</div>
          <p className="font-semibold text-gray-500">{t.leaves.noRequests}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(req => {
            return (
              <div key={req.id} className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 hover:shadow-card-hover transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green/10 flex items-center justify-center text-green font-bold">
                      {req.employeeName[0]}
                    </div>
                    <div>
                      <p className="font-bold text-dark">{req.employeeName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{t.leaves.requestedOn} {req.requestDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeColors[req.type] || 'bg-gray-100 text-gray-600'}`}>
                      {req.type}
                    </span>
                    {getStatusBadge(req.status)}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-4 text-sm text-brown">
                  <span className="flex items-center gap-1.5"><Calendar size={14} className="text-green" />{req.from} → {req.to}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} className="text-gold" />{req.days} {t.leaves.days}</span>
                  <span className="flex items-center gap-1.5"><User size={14} className="text-brown" />{t.leaves.reason} {req.reason}</span>
                </div>

                <div className="mt-3 inline-flex items-center gap-2 bg-gold/10 border border-gold/20 text-yellow-800 rounded-lg px-3 py-1.5 text-xs font-semibold">
                  🗓️ {t.leaves.remainingBalance} <span className="font-extrabold">{req.leaveBalance} {t.leaves.days}</span>
                  {req.leaveBalance < req.days && <span className="text-red-500 font-semibold"> {t.leaves.insufficientBalance}</span>}
                </div>

                {req.status === 'معلقة' && (
                  <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                    <button onClick={() => setConfirm({ id: req.id, action: 'approve' })}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-50 text-green-700 hover:bg-green hover:text-white font-semibold py-2 rounded-xl text-sm transition-all">
                      <CheckCircle size={16} /> {t.leaves.approveBtn}
                    </button>
                    <button onClick={() => setConfirm({ id: req.id, action: 'reject' })}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-semibold py-2 rounded-xl text-sm transition-all">
                      <XCircle size={16} /> {t.leaves.rejectBtn}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Confirm Dialog */}
      {confirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-2xl shadow-modal p-6 max-w-sm w-full animate-slide-up text-center">
            <div className="text-4xl mb-3">{confirm.action === 'approve' ? '' : ''}</div>
            <h3 className="font-bold text-dark text-lg mb-2">
              {confirm.action === 'approve' ? t.leaves.confirmModal.approveTitle : t.leaves.confirmModal.rejectTitle}
            </h3>
            <p className="text-brown text-sm mb-6">
              {confirm.action === 'approve'
                ? t.leaves.confirmModal.approveDesc
                : t.leaves.confirmModal.rejectDesc}
            </p>
            <div className="flex gap-3">
              <button onClick={() => handleAction(confirm.id, confirm.action)}
                className={`flex-1 py-2.5 rounded-xl font-semibold ${confirm.action === 'approve' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-red-600 text-white hover:bg-red-700'}`}>
                {t.leaves.confirmModal.confirm}
              </button>
              <button onClick={() => setConfirm(null)} className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-xl py-2.5 font-semibold">
                {t.leaves.confirmModal.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
