import { useState } from 'react';
import { CheckCircle, XCircle, Calendar, User, Clock, AlertTriangle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { mockLeaveRequests } from '../../../data/mockData';

const typeColors: Record<string, string> = {
    'Annual': 'bg-blue-50 text-blue-700',
    'Sick': 'bg-red-50 text-red-600',
    'Emergency': 'bg-orange-50 text-orange-700',
    'Unpaid': 'bg-gray-100 text-gray-600',
};

export default function LeaveRequests() {
    const tabs = ['All', 'Pending', 'Approved', 'Rejected'];
    const tabKeys = ['all', 'Pending', 'Approved', 'Rejected'];

    const [requests, setRequests] = useState(mockLeaveRequests);
    const [activeTabIdx, setActiveTabIdx] = useState(1); // default: Pending
    const [confirm, setConfirm] = useState<{ id: number; action: 'approve' | 'reject' } | null>(null);

    const activeKey = tabKeys[activeTabIdx];
    const filtered = requests.filter(r => activeKey === 'all' || r.status === activeKey);
    const pendingCount = requests.filter(r => r.status === 'Pending').length;

    const updateLeaveRequestStatus = (id: number, newStatus: string) => {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    };

    const handleAction = (id: number, action: 'approve' | 'reject') => {
        const newStatus = action === 'approve' ? 'Approved' : 'Rejected';
        updateLeaveRequestStatus(id, newStatus);
        toast.success(action === 'approve' ? 'Request approved successfully' : 'Request rejected successfully', { duration: 3000 });
        setConfirm(null);
    };

    const getStatusBadge = (status: string) => {
        const cls = status === 'Approved'
            ? 'bg-green-50 text-green-700'
            : status === 'Rejected'
                ? 'bg-red-50 text-red-600'
                : 'bg-yellow-50 text-yellow-700';
        return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}>{status}</span>;
    };

    return (
        <div className="space-y-6">
            <Toaster position="top-center" />

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-extrabold text-dark">Leave Requests</h2>
                    <p className="text-sm text-brown mt-1">{pendingCount} pending requests awaiting your review</p>
                </div>
                {pendingCount > 0 && (
                    <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl px-4 py-2 text-sm font-semibold">
                        <AlertTriangle size={15} /> {pendingCount} pending requests need attention
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
                    <p className="font-semibold text-gray-500">No leave requests found</p>
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
                                            <p className="text-xs text-gray-400 mt-0.5">Requested on: {req.requestDate}</p>
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
                                    <span className="flex items-center gap-1.5"><Clock size={14} className="text-gold" />{req.days} days</span>
                                    <span className="flex items-center gap-1.5"><User size={14} className="text-brown" />Reason: {req.reason}</span>
                                </div>

                                <div className="mt-3 inline-flex items-center gap-2 bg-gold/10 border border-gold/20 text-yellow-800 rounded-lg px-3 py-1.5 text-xs font-semibold">
                                    🗓️ Remaining balance: <span className="font-extrabold">{req.leaveBalance} days</span>
                                    {req.leaveBalance < req.days && <span className="text-red-500 font-semibold"> (Insufficient balance)</span>}
                                </div>

                                {req.status === 'Pending' && (
                                    <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                                        <button onClick={() => setConfirm({ id: req.id, action: 'approve' })}
                                            className="flex-1 flex items-center justify-center gap-2 bg-green-50 text-green-700 hover:bg-green hover:text-white font-semibold py-2 rounded-xl text-sm transition-all">
                                            <CheckCircle size={16} /> Approve
                                        </button>
                                        <button onClick={() => setConfirm({ id: req.id, action: 'reject' })}
                                            className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-semibold py-2 rounded-xl text-sm transition-all">
                                            <XCircle size={16} /> Reject
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
                        <div className="text-4xl mb-3">{confirm.action === 'approve' ? '✅' : '❌'}</div>
                        <h3 className="font-bold text-dark text-lg mb-2">
                            {confirm.action === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                        </h3>
                        <p className="text-brown text-sm mb-6">
                            {confirm.action === 'approve'
                                ? 'Are you sure you want to approve this leave request? This action cannot be undone.'
                                : 'Are you sure you want to reject this leave request? This action cannot be undone.'}
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => handleAction(confirm.id, confirm.action)}
                                className={`flex-1 py-2.5 rounded-xl font-semibold ${confirm.action === 'approve' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-red-600 text-white hover:bg-red-700'}`}>
                                Confirm
                            </button>
                            <button onClick={() => setConfirm(null)} className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-xl py-2.5 font-semibold">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
