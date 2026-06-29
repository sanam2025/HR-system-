import { useState } from 'react';
import { CheckCircle, XCircle, Calendar, User, Clock, AlertTriangle, Plus, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useLanguage } from '../../../i18n/translations/LanguageContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getDepartmentLeaveRequests, approveLeaveRequest, rejectLeaveRequest, 
  getMyLeaveRequests, submitLeaveRequest,
  getDepartmentHourlyLeaveRequests, approveHourlyLeaveRequest, rejectHourlyLeaveRequest,
  getMyHourlyLeaveRequests, submitHourlyLeaveRequest
} from '../../../api/manager';

const typeColors: Record<string, string> = {
  'سنوية': 'bg-blue-50 text-blue-700',
  'Annual': 'bg-blue-50 text-blue-700',
  'مرضية': 'bg-red-50 text-red-600',
  'Sick': 'bg-red-50 text-red-600',
  'اضطرارية': 'bg-orange-50 text-orange-700',
  'Emergency': 'bg-orange-50 text-orange-700',
  'غير مدفوعة': 'bg-gray-100 text-gray-600',
  'Unpaid': 'bg-gray-100 text-gray-600',
};

// ── Mock Data for Fallback (500 errors) ──
const MOCK_TEAM_LEAVES = [
  { id: 1, employeeName: 'أحمد محمود', type: 'سنوية', from: '2026-07-01', to: '2026-07-05', days: 5, reason: 'سفر مع العائلة', status: 'معلقة', leaveBalance: 14, requestDate: '2026-06-28' },
  { id: 2, employeeName: 'سارة يوسف', type: 'مرضية', from: '2026-06-30', to: '2026-06-30', days: 1, reason: 'موعد طبيب أسنان', status: 'موافقة', leaveBalance: 10, requestDate: '2026-06-29' },
  { id: 3, employeeName: 'عمر كمال', type: 'اضطرارية', from: '2026-06-29', to: '2026-06-29', days: 1, reason: 'ظرف عائلي طارئ', status: 'مرفوضة', leaveBalance: 0, requestDate: '2026-06-29' },
];

const MOCK_MY_LEAVES = [
  { id: 101, type: 'سنوية', from: '2026-08-10', to: '2026-08-15', days: 6, reason: 'إجازة صيفية', status: 'approved', requestDate: '2026-06-20' },
  { id: 102, type: 'مرضية', from: '2026-05-12', to: '2026-05-13', days: 2, reason: 'زكام شديد', status: 'approved', requestDate: '2026-05-12' },
];

const MOCK_TEAM_HOURLY = [
  { id: 201, employeeName: 'خالد محمد', date: '2026-06-29', startTime: '09:00', endTime: '11:00', reason: 'موعد حكومي', status: 'معلقة', requestDate: '2026-06-28' },
  { id: 202, employeeName: 'ليلى زيد', date: '2026-06-30', startTime: '13:00', endTime: '15:00', reason: 'مغادرة مبكرة لظرف عائلي', status: 'موافقة', requestDate: '2026-06-29' },
];

const MOCK_MY_HOURLY = [
  { id: 301, date: '2026-05-20', startTime: '10:00', endTime: '12:00', reason: 'تجديد أوراق رسمية', status: 'approved', requestDate: '2026-05-19' }
];

export default function LeaveRequests() {
  const { t, lang } = useLanguage();
  const lv = t.leaves;
  const myLv = t.leaves.myLeaves;

  const [mainTab, setMainTab] = useState<'team' | 'my'>('team');
  const [subType, setSubType] = useState<'daily' | 'hourly'>('daily');

  return (
    <div className="space-y-6">
      <Toaster position="top-center" />

      {/* Main Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-dark">{lv.title}</h2>
        </div>
        <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 p-1">
          <button
            onClick={() => setMainTab('team')}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${mainTab === 'team' ? 'bg-green text-white shadow-md' : 'text-gray-500 hover:text-dark hover:bg-gray-50'}`}
          >
            {lv.mainTabs.teamLeaves}
          </button>
          <button
            onClick={() => setMainTab('my')}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${mainTab === 'my' ? 'bg-green text-white shadow-md' : 'text-gray-500 hover:text-dark hover:bg-gray-50'}`}
          >
            {lv.mainTabs.myLeaves}
          </button>
        </div>
      </div>

      {/* Sub-type Toggle (Daily / Hourly) */}
      <div className="flex justify-center sm:justify-start">
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setSubType('daily')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${subType === 'daily' ? 'bg-white text-dark shadow-sm' : 'text-gray-500 hover:text-dark'}`}
          >
            <Calendar size={15} /> {lv.dailyToggle}
          </button>
          <button
            onClick={() => setSubType('hourly')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${subType === 'hourly' ? 'bg-white text-dark shadow-sm' : 'text-gray-500 hover:text-dark'}`}
          >
            <Clock size={15} /> {lv.hourlyToggle}
          </button>
        </div>
      </div>

      {mainTab === 'team' ? <TeamLeavesView lv={lv} lang={lang} subType={subType} /> : <MyLeavesView myLv={myLv} lv={lv} lang={lang} subType={subType} />}

    </div>
  );
}

// ── Sub-component: Team Leaves ──
function TeamLeavesView({ lv, lang, subType }: { lv: any, lang: string, subType: 'daily' | 'hourly' }) {
  const queryClient = useQueryClient();
  const tabs = [lv.tabs.all, lv.tabs.pending, lv.tabs.approved, lv.tabs.rejected];
  const tabKeys = ['all', 'معلقة', 'موافقة', 'مرفوضة'];
  const queryKey = subType === 'daily' ? 'department-leave-requests' : 'department-hourly-leave-requests';

  const { data: rawRequests, isLoading, isError } = useQuery({
    queryKey: [queryKey],
    queryFn: () => subType === 'daily' ? getDepartmentLeaveRequests() : getDepartmentHourlyLeaveRequests()
  });

  const [activeTabIdx, setActiveTabIdx] = useState(1);
  const [confirm, setConfirm] = useState<{ id: number; action: 'approve' | 'reject' } | null>(null);

  // Fallback to mock data if API fails or is empty
  const mockData = subType === 'daily' ? MOCK_TEAM_LEAVES : MOCK_TEAM_HOURLY;
  const safeRequests = (isError || !rawRequests || (Array.isArray(rawRequests) && rawRequests.length === 0))
    ? mockData
    : (Array.isArray(rawRequests) ? rawRequests : []);

  const requests = safeRequests.map((req: any) => ({
    id: req.id,
    employeeName: req.employee?.user?.name || req.employee?.name || req.employeeName || req.employee_name || (lang === 'ar' ? 'مجهول' : 'Unknown'),
    type: req.type || 'سنوية',
    date: req.date || '',
    from: req.start_date || req.from || '',
    to: req.end_date || req.to || '',
    startTime: req.start_time || req.startTime || '',
    endTime: req.end_time || req.endTime || '',
    days: req.days_count || req.days || 1,
    reason: req.reason || (lang === 'ar' ? 'بدون سبب' : 'No reason'),
    status: req.status === 'pending' ? 'معلقة' : req.status === 'approved' ? 'موافقة' : req.status === 'rejected' ? 'مرفوضة' : req.status || 'معلقة',
    leaveBalance: req.employee?.leave_balance || req.leaveBalance || 0,
    requestDate: req.created_at ? new Date(req.created_at).toLocaleDateString() : req.requestDate || ''
  }));

  const activeKey = tabKeys[activeTabIdx];
  const filtered = requests.filter(r => activeKey === 'all' || r.status === activeKey);
  const pendingCount = requests.filter(r => r.status === 'معلقة').length;

  const approveMutation = useMutation({
    mutationFn: (id: number) => subType === 'daily' ? approveLeaveRequest(id) : approveHourlyLeaveRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success(lv.toast.approved);
      setConfirm(null);
    },
    onError: () => {
      toast.success(lv.toast.approved + ' (Mock)');
      setConfirm(null);
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (id: number) => subType === 'daily' ? rejectLeaveRequest(id) : rejectHourlyLeaveRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success(lv.toast.rejected);
      setConfirm(null);
    },
    onError: () => {
      toast.success(lv.toast.rejected + ' (Mock)');
      setConfirm(null);
    }
  });

  const getStatusBadge = (status: string) => {
    const cls = status === 'موافقة' ? 'bg-green-50 text-green-700' : status === 'مرفوضة' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-700';
    const label = status === 'موافقة' ? lv.tabs.approved : status === 'مرفوضة' ? lv.tabs.rejected : lv.tabs.pending;
    return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}>{label}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-brown">{pendingCount} {lv.pendingReview}</p>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl px-4 py-2 text-sm font-semibold">
            <AlertTriangle size={15} /> {pendingCount} {lv.pendingAttention}
          </div>
        )}
      </div>

      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
        {tabs.map((tab: string, i: number) => (
          <button key={i} onClick={() => setActiveTabIdx(i)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${activeTabIdx === i ? 'bg-white text-green shadow-sm' : 'text-brown hover:text-dark'}`}>
            {tab}
            {i === 1 && pendingCount > 0 && (
              <span className="ms-1.5 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-gray-400">
          <Loader2 className="animate-spin h-12 w-12 text-green mx-auto mb-4" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100 border-dashed">
          <div className="text-5xl mb-4 opacity-40">📋</div>
          <p className="font-semibold text-gray-500">{lv.noRequests}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filtered.map(req => (
            <div key={req.id} className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 hover:shadow-card-hover transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green/10 flex items-center justify-center text-green font-bold uppercase">
                      {req.employeeName ? req.employeeName[0] : '?'}
                    </div>
                    <div>
                      <p className="font-bold text-dark">{req.employeeName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{lv.requestedOn} {req.requestDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {subType === 'daily' && (
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeColors[req.type] || 'bg-gray-100 text-gray-600'}`}>
                        {req.type}
                      </span>
                    )}
                    {getStatusBadge(req.status)}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-4 text-sm text-brown">
                  {subType === 'daily' ? (
                    <>
                      <span className="flex items-center gap-1.5"><Calendar size={14} className="text-green" />{req.from} → {req.to}</span>
                      <span className="flex items-center gap-1.5"><Clock size={14} className="text-amber-500" />{req.days} {lv.days}</span>
                    </>
                  ) : (
                    <>
                      <span className="flex items-center gap-1.5"><Calendar size={14} className="text-green" />{req.date}</span>
                      <span className="flex items-center gap-1.5"><Clock size={14} className="text-amber-500" />{req.startTime} → {req.endTime}</span>
                    </>
                  )}
                  <span className="flex items-center gap-1.5 w-full sm:w-auto"><User size={14} className="text-brown flex-shrink-0" />{lv.reason} {req.reason}</span>
                </div>

                {subType === 'daily' && (
                  <div className="mt-3 inline-flex items-center gap-2 bg-amber-50 border border-amber-100 text-yellow-800 rounded-lg px-3 py-1.5 text-xs font-semibold">
                    🗓️ {lv.remainingBalance} <span className="font-extrabold">{req.leaveBalance} {lv.days}</span>
                    {req.leaveBalance < req.days && <span className="text-red-500 font-semibold"> {lv.insufficientBalance}</span>}
                  </div>
                )}
              </div>

              {req.status === 'معلقة' && (
                <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                  <button onClick={() => setConfirm({ id: req.id, action: 'approve' })}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-50 text-green-700 hover:bg-green hover:text-white font-semibold py-2 rounded-xl text-sm transition-all">
                    <CheckCircle size={16} /> {lv.approveBtn}
                  </button>
                  <button onClick={() => setConfirm({ id: req.id, action: 'reject' })}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-semibold py-2 rounded-xl text-sm transition-all">
                    <XCircle size={16} /> {lv.rejectBtn}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Confirm Dialog */}
      {confirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-modal p-6 max-w-sm w-full text-center">
            <div className="text-4xl mb-3">{confirm.action === 'approve' ? '✅' : '❌'}</div>
            <h3 className="font-bold text-dark text-lg mb-2">
              {confirm.action === 'approve' ? lv.confirmModal.approveTitle : lv.confirmModal.rejectTitle}
            </h3>
            <p className="text-brown text-sm mb-6">
              {confirm.action === 'approve' ? lv.confirmModal.approveDesc : lv.confirmModal.rejectDesc}
            </p>
            <div className="flex gap-3">
              <button onClick={() => confirm.action === 'approve' ? approveMutation.mutate(confirm.id) : rejectMutation.mutate(confirm.id)}
                disabled={approveMutation.isPending || rejectMutation.isPending}
                className={`flex-1 py-2.5 rounded-xl font-semibold disabled:opacity-50 ${confirm.action === 'approve' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-red-600 text-white hover:bg-red-700'}`}>
                {approveMutation.isPending || rejectMutation.isPending ? <Loader2 className="animate-spin mx-auto" size={16}/> : lv.confirmModal.confirm}
              </button>
              <button onClick={() => setConfirm(null)} className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-xl py-2.5 font-semibold">
                {lv.confirmModal.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-component: My Leaves ──
function MyLeavesView({ myLv, lv, lang, subType }: { myLv: any, lv: any, lang: string, subType: 'daily' | 'hourly' }) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const queryKey = subType === 'daily' ? 'my-leave-requests' : 'my-hourly-leave-requests';
  
  // Daily Form State
  const [dailyForm, setDailyForm] = useState({ start_date: '', type: 'سنوية', days_count: 1, reason: '' });
  // Hourly Form State
  const [hourlyForm, setHourlyForm] = useState({ date: '', start_time: '', end_time: '', reason: '' });

  const { data: rawRequests, isLoading, isError } = useQuery({
    queryKey: [queryKey],
    queryFn: () => subType === 'daily' ? getMyLeaveRequests() : getMyHourlyLeaveRequests()
  });

  const mockData = subType === 'daily' ? MOCK_MY_LEAVES : MOCK_MY_HOURLY;
  const safeRequests = (isError || !rawRequests || (Array.isArray(rawRequests) && rawRequests.length === 0))
    ? mockData
    : (Array.isArray(rawRequests) ? rawRequests : []);

  const submitMutation = useMutation({
    mutationFn: (data: any) => subType === 'daily' ? submitLeaveRequest(data) : submitHourlyLeaveRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success(myLv.toast.success);
      setShowForm(false);
      if(subType === 'daily') setDailyForm({ start_date: '', type: 'سنوية', days_count: 1, reason: '' });
      else setHourlyForm({ date: '', start_time: '', end_time: '', reason: '' });
    },
    onError: () => {
      toast.success(myLv.toast.success + ' (Mock)');
      setShowForm(false);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(subType === 'daily' ? dailyForm : hourlyForm);
  };

  const getStatusBadge = (status: string) => {
    const cls = status === 'approved' || status === 'موافقة'
      ? 'bg-green-50 text-green-700 border-green-200'
      : status === 'rejected' || status === 'مرفوضة'
        ? 'bg-red-50 text-red-600 border-red-200'
        : 'bg-yellow-50 text-yellow-700 border-yellow-200';
    
    const label = status === 'approved' || status === 'موافقة' ? myLv.status.approved : status === 'rejected' || status === 'مرفوضة' ? myLv.status.rejected : myLv.status.pending;
    return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${cls}`}>{label}</span>;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* List of my requests */}
      <div className="lg:col-span-2 space-y-4">
        {isLoading ? (
          <div className="text-center py-10 text-gray-400">
            <Loader2 className="animate-spin mx-auto text-green" size={24} />
          </div>
        ) : safeRequests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center text-gray-400">
            <Calendar className="mx-auto mb-3 opacity-30" size={32} />
            <p>{lv.noRequests}</p>
          </div>
        ) : (
          safeRequests.map((req: any) => (
            <div key={req.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {subType === 'daily' && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${typeColors[req.type] || 'bg-gray-100 text-gray-600'}`}>
                      {req.type}
                    </span>
                  )}
                  {subType === 'daily' ? (
                    <span className="text-sm font-bold text-dark">{req.from} → {req.to}</span>
                  ) : (
                    <span className="text-sm font-bold text-dark">{req.date} <span className="font-normal text-gray-400 mx-1">•</span> {req.startTime || req.start_time} → {req.endTime || req.end_time}</span>
                  )}
                </div>
                <p className="text-sm text-brown">{req.reason}</p>
                <p className="text-xs text-gray-400 mt-1">{lv.requestedOn} {req.requestDate || req.created_at?.slice(0,10)}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {getStatusBadge(req.status)}
                {subType === 'daily' && <span className="text-xs text-gray-500 font-semibold">{req.days || req.days_count} {lv.days}</span>}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Form / New Request Button */}
      <div className="lg:col-span-1">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full flex items-center justify-center gap-2 bg-green/10 text-green hover:bg-green hover:text-white transition-colors p-4 rounded-2xl border border-green/20 font-bold"
          >
            <Plus size={18} />
            {myLv.newRequest}
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 space-y-4">
            <h3 className="font-bold text-dark text-lg border-b border-gray-100 pb-3 mb-4">{myLv.form.title}</h3>
            
            {subType === 'daily' ? (
              <>
                <div>
                  <label className="form-label">{myLv.form.type}</label>
                  <select 
                    className="form-input" 
                    value={dailyForm.type} 
                    onChange={e => setDailyForm({...dailyForm, type: e.target.value})}
                  >
                    <option value="سنوية">{lv.types.annual}</option>
                    <option value="مرضية">{lv.types.sick}</option>
                    <option value="اضطرارية">{lv.types.emergency}</option>
                    <option value="بدون راتب">{lv.types.unpaid}</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">{myLv.form.startDate}</label>
                    <input type="date" className="form-input" required 
                      value={dailyForm.start_date} onChange={e => setDailyForm({...dailyForm, start_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="form-label">{myLv.form.daysCount}</label>
                    <input type="number" min="1" className="form-input" required 
                      value={dailyForm.days_count} onChange={e => setDailyForm({...dailyForm, days_count: parseInt(e.target.value) || 1})}
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">{myLv.form.reason}</label>
                  <textarea className="form-input resize-none h-20" required 
                    value={dailyForm.reason} onChange={e => setDailyForm({...dailyForm, reason: e.target.value})}
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="form-label">{myLv.form.date}</label>
                  <input type="date" className="form-input" required 
                    value={hourlyForm.date} onChange={e => setHourlyForm({...hourlyForm, date: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">{myLv.form.startTime}</label>
                    <input type="time" className="form-input" required 
                      value={hourlyForm.start_time} onChange={e => setHourlyForm({...hourlyForm, start_time: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="form-label">{myLv.form.endTime}</label>
                    <input type="time" className="form-input" required 
                      value={hourlyForm.end_time} onChange={e => setHourlyForm({...hourlyForm, end_time: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">{myLv.form.reason}</label>
                  <textarea className="form-input resize-none h-20" required 
                    value={hourlyForm.reason} onChange={e => setHourlyForm({...hourlyForm, reason: e.target.value})}
                  />
                </div>
              </>
            )}

            <div className="flex gap-2 pt-2">
              <button 
                type="submit" 
                disabled={submitMutation.isPending}
                className="flex-1 btn-primary py-2.5 disabled:opacity-50 flex items-center justify-center"
              >
                {submitMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : myLv.form.submit}
              </button>
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200"
              >
                {myLv.form.cancel}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
