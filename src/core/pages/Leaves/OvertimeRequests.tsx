import { useState } from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle, Plus, Loader2, Calendar, User, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '../../../i18n/translations/LanguageContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getDepartmentOvertimeRequests, approveOvertimeRequest, rejectOvertimeRequest,
  createManagerOvertime, getMyCreatedOvertimesManager, getMyOvertimes, createEmployeeOvertime, deleteOvertimeRequest,
  getManagerEmployees
} from '../../../api/manager';

export default function OvertimeRequests() {
  const { t, lang } = useLanguage();
  const ov = t.overtime;
  const c = t.common;
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'department' | 'myCreated' | 'myOwn'>('department');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMyOvertimeModal, setShowMyOvertimeModal] = useState(false);

  // Manager Employees for assigning overtime
  const { data: employees = [] } = useQuery({
    queryKey: ['manager-employees'],
    queryFn: getManagerEmployees,
    enabled: showCreateModal
  });

  // Department Requests Query
  const { data: rawDeptRequests = [], isLoading: isDeptLoading } = useQuery({
    queryKey: ['department-overtime-requests'],
    queryFn: getDepartmentOvertimeRequests
  });

  // Manager Created Overtimes Query
  const { data: rawCreatedOvertimes = [], isLoading: isCreatedLoading } = useQuery({
    queryKey: ['my-created-overtimes'],
    queryFn: getMyCreatedOvertimesManager,
    enabled: activeTab === 'myCreated'
  });

  // My Own Overtimes Query
  const { data: rawMyOvertimes = [], isLoading: isMyOwnLoading } = useQuery({
    queryKey: ['my-own-overtimes'],
    queryFn: getMyOvertimes,
    enabled: activeTab === 'myOwn'
  });

  const safeDeptRequests = Array.isArray(rawDeptRequests) ? rawDeptRequests : Array.isArray(rawDeptRequests?.data) ? rawDeptRequests.data : [];
  const safeCreatedOvertimes = Array.isArray(rawCreatedOvertimes) ? rawCreatedOvertimes : Array.isArray(rawCreatedOvertimes?.data) ? rawCreatedOvertimes.data : [];
  const safeMyOvertimes = Array.isArray(rawMyOvertimes) ? rawMyOvertimes : Array.isArray(rawMyOvertimes?.data) ? rawMyOvertimes.data : [];

  const pendingCount = safeDeptRequests.filter((r: any) => r.status === 'pending' || r.status === 'معلقة').length;

  // Mutations
  const approveMutation = useMutation({
    mutationFn: approveOvertimeRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['department-overtime-requests'] });
      toast.success(ov.toasts?.approved || 'تم قبول طلب العمل الإضافي');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'حدث خطأ في قبول الطلب');
    }
  });

  const rejectMutation = useMutation({
    mutationFn: rejectOvertimeRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['department-overtime-requests'] });
      toast.success(ov.toasts?.rejected || 'تم رفض طلب العمل الإضافي');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'حدث خطأ في رفض الطلب');
    }
  });

  const [cardErrors, setCardErrors] = useState<Record<number, string>>({});
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const translateOvertimeError = (err: any): string => {
    const msg: string = err?.response?.data?.message || err?.response?.data?.error || err?.message || '';
    if (msg.includes('cannot be deleted because it has already been processed') || msg.includes('cannot be deleted')) {
      return 'لا يمكن حذف طلب العمل الإضافي لأنه تم معالجته أو قبوله مسبقاً ⚠️';
    }
    if (msg.includes('before the official checkout time')) {
      return 'لا يمكن أن يبدأ العمل الإضافي قبل نهاية وقت الدوام الرسمي (مثلاً يجب أن يبدأ بعد 04:00 أو 05:00 مساءً)';
    }
    if (msg.includes('end time must be after') || msg.includes('after start_time')) {
      return 'يجب أن يكون وقت النهاية بعد وقت بداية العمل الإضافي';
    }
    if (msg.includes('already exists') || msg.includes('overlap')) {
      return 'يوجد تكليف عمل إضافي مسبقاً في هذا التاريخ والتوقيت';
    }
    if (msg.includes('Unauthorized') || msg.includes('Unauthenticated')) {
      return 'غير مصرح للقيام بهذا الإجراء ⚠️';
    }
    if (msg) return msg;
    return 'حدث خطأ أثناء إجراء العملية';
  };

  const deleteMutation = useMutation({
    mutationFn: deleteOvertimeRequest,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['department-overtime-requests'] });
      queryClient.invalidateQueries({ queryKey: ['my-created-overtimes'] });
      queryClient.invalidateQueries({ queryKey: ['my-own-overtimes'] });
      toast.success('تم حذف طلب العمل الإضافي بنجاح ✅');
      setDeletingId(null);
      setCardErrors(prev => ({ ...prev, [variables]: '' }));
    },
    onError: (err: any, variables) => {
      const translated = translateOvertimeError(err);
      setCardErrors(prev => ({ ...prev, [variables]: translated }));
      setDeletingId(null);
    }
  });

  // Assign Overtime Form
  const todayStr = new Date().toISOString().split('T')[0];
  const [managerForm, setManagerForm] = useState({ user_id: '', date: todayStr, start_time: '17:00', end_time: '19:00', notes: '' });
  const createManagerMutation = useMutation({
    mutationFn: createManagerOvertime,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['department-overtime-requests'] });
      queryClient.invalidateQueries({ queryKey: ['my-created-overtimes'] });
      toast.success('تم تكليف الموظف بالعمل الإضافي بنجاح ✅');
      setShowCreateModal(false);
      setManagerForm({ user_id: '', date: todayStr, start_time: '17:00', end_time: '19:00', notes: '' });
    },
    onError: (err: any) => {
      toast.error(translateOvertimeError(err), { duration: 6000 });
    }
  });

  // Personal Overtime Form
  const [myOwnForm, setMyOwnForm] = useState({ date: todayStr, start_time: '17:00', end_time: '19:00', notes: '' });
  const createMyOwnMutation = useMutation({
    mutationFn: createEmployeeOvertime,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-own-overtimes'] });
      toast.success('تم تقديم طلب العمل الإضافي بنجاح ✅');
      setShowMyOvertimeModal(false);
      setMyOwnForm({ date: todayStr, start_time: '17:00', end_time: '19:00', notes: '' });
    },
    onError: (err: any) => {
      toast.error(translateOvertimeError(err), { duration: 6000 });
    }
  });

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || '';
    const isApproved = s === 'approved' || s === 'موافقة';
    const isCompleted = s === 'completed' || s === 'مكتمل';
    const isRejected = s === 'rejected' || s === 'مرفوضة';
    const isPending = s === 'pending' || s === 'معلقة';

    if (isApproved) {
      return <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-green-50 text-green-700 border-green-200">{ov.status?.approved || 'Approved'}</span>;
    }
    if (isCompleted) {
      return <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-blue-50 text-blue-700 border-blue-200">{ov.status?.completed || 'Completed'}</span>;
    }
    if (isRejected) {
      return <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-red-50 text-red-600 border-red-200">{ov.status?.rejected || 'Rejected'}</span>;
    }
    // Default to pending
    return <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-yellow-50 text-yellow-700 border-yellow-200">{ov.status?.pending || 'Pending'}</span>;
  };

  return (
    <div className="space-y-6">
      

      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-dark">{ov.title || 'Overtime Management'}</h2>
          <p className="text-sm text-brown mt-1">{ov.subtitle || 'Track and assign overtime hours for department employees'}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-green text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-green-dark transition-all cursor-pointer"
          >
            <Plus size={16} />
            {ov.assignBtn || 'Assign Overtime'}
          </button>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b border-gray-200 gap-2">
        <button
          onClick={() => setActiveTab('department')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'department' ? 'border-green text-green font-extrabold' : 'border-transparent text-gray-400 hover:text-dark'
          }`}
        >
          {ov.mainTabs?.department || 'Department Voluntary Requests'}
          {pendingCount > 0 && (
            <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{pendingCount}</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('myCreated')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-all ${
            activeTab === 'myCreated' ? 'border-green text-green font-extrabold' : 'border-transparent text-gray-400 hover:text-dark'
          }`}
        >
          {ov.mainTabs?.myCreated || 'My Assignments'}
        </button>
        <button
          onClick={() => setActiveTab('myOwn')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-all ${
            activeTab === 'myOwn' ? 'border-green text-green font-extrabold' : 'border-transparent text-gray-400 hover:text-dark'
          }`}
        >
          {ov.mainTabs?.myOwn || 'My Personal Overtimes'}
        </button>
      </div>

      {/* Tab 1: Department Requests */}
      {activeTab === 'department' && (
        <div className="space-y-4">
          {pendingCount > 0 && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-2.5 text-sm font-semibold">
              <AlertTriangle size={16} /> {(ov.alerts?.pending || 'There are {count} pending requests waiting for your approval.').replace('{count}', String(pendingCount))}
            </div>
          )}

          {isDeptLoading ? (
            <div className="text-center py-16"><Loader2 className="animate-spin text-green mx-auto" size={32} /></div>
          ) : safeDeptRequests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center text-gray-400">
              <Clock size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-semibold">{ov.emptyStates?.department || 'No overtime requests currently in the department'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {safeDeptRequests.map((req: any) => {
                const name = req.user?.name || req.employee?.user?.name || req.employee?.name || req.employeeName || 'موظف';
                const date = req.date || req.created_at?.slice(0, 10) || '—';
                const startTime = req.start_time || req.startTime || '—';
                const endTime = req.end_time || req.endTime || '—';
                const notes = req.notes || req.reason || 'بدون ملاحظات';
                const isPending = req.status === 'pending' || req.status === 'معلقة';

                return (
                  <div key={req.id} className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 hover:shadow-card-hover transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                            {name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-dark text-sm">{name}</p>
                            <p className="text-xs text-gray-400">{req.created_at ? new Date(req.created_at).toLocaleDateString('ar-EG') : date}</p>
                          </div>
                        </div>
                        {getStatusBadge(req.status)}
                      </div>

                      <div className="bg-gray-50 rounded-xl p-3 space-y-1.5 text-xs text-brown my-3">
                        <div className="flex items-center gap-2">
                          <Calendar size={13} className="text-green" />
                          <span>{ov.card?.date || 'Date:'} <strong className="text-dark">{date}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={13} className="text-amber-500" />
                          <span>{ov.card?.time || 'Time:'} <strong className="text-dark">{startTime} ← {endTime}</strong></span>
                        </div>
                        {notes && (
                          <div className="flex items-start gap-2 pt-1 border-t border-gray-200/50">
                            <User size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />
                            <span>{ov.card?.notes || 'Notes:'} {notes}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {isPending && (
                      <div className="flex gap-2 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => approveMutation.mutate(req.id)}
                          disabled={approveMutation.isPending}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-50 text-green-700 hover:bg-green hover:text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                        >
                          <CheckCircle size={14} /> {ov.approveBtn || 'Approve'}
                        </button>
                        <button
                          onClick={() => rejectMutation.mutate(req.id)}
                          disabled={rejectMutation.isPending}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                        >
                          <XCircle size={14} /> {ov.rejectBtn || 'Reject'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: My Created Overtimes */}
      {activeTab === 'myCreated' && (
        <div className="space-y-4">
          {isCreatedLoading ? (
            <div className="text-center py-16"><Loader2 className="animate-spin text-green mx-auto" size={32} /></div>
          ) : safeCreatedOvertimes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center text-gray-400">
              <Clock size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-semibold">{ov.emptyStates?.myCreated || 'You have not assigned any overtime to employees yet'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {safeCreatedOvertimes.map((req: any) => {
                const name = req.user?.name || req.employee?.name || (ov.card?.employeeFallback || 'Employee #{id}').replace('{id}', req.user_id || req.id);
                return (
                  <div key={req.id} className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-green/10 text-green flex items-center justify-center font-bold text-sm">
                            {name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-dark text-sm">{name}</p>
                            <p className="text-xs text-gray-400">{req.date}</p>
                          </div>
                        </div>
                        {getStatusBadge(req.status || 'approved')}
                      </div>

                      <div className="bg-gray-50 rounded-xl p-3 text-xs text-brown space-y-1">
                        <p>🕒 {ov.card?.from || 'From'} <strong>{req.start_time}</strong> {ov.card?.to || 'To'} <strong>{req.end_time}</strong></p>
                        {req.notes && <p>📝 {ov.card?.notes || 'Notes:'} {lang === 'en' && req.notes === 'انجاز العمل' ? 'Task completion' : req.notes}</p>}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex flex-col items-end">
                      <button
                        onClick={() => {
                          setDeletingId(req.id);
                          setCardErrors(prev => ({ ...prev, [req.id]: '' }));
                          deleteMutation.mutate(req.id);
                        }}
                        disabled={deleteMutation.isPending && deletingId === req.id}
                        className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer disabled:opacity-50"
                      >
                        {deleteMutation.isPending && deletingId === req.id ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <Trash2 size={13} />
                        )}
                        {ov.card?.cancelBtn || 'Cancel Assignment'}
                      </button>

                      {cardErrors[req.id] && (
                        <div className="mt-2.5 w-full bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-xs font-semibold flex items-center justify-between gap-2 animate-slide-down shadow-sm">
                          <div className="flex items-center gap-2">
                            <AlertTriangle size={15} className="text-red-500 flex-shrink-0" />
                            <span>{cardErrors[req.id]}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setCardErrors(prev => ({ ...prev, [req.id]: '' }))}
                            className="text-red-400 hover:text-red-600 p-0.5 cursor-pointer"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: My Own Overtimes */}
      {activeTab === 'myOwn' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowMyOvertimeModal(true)}
              className="flex items-center gap-2 bg-green text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-green-dark transition-all cursor-pointer"
            >
              <Plus size={16} /> {ov.personalBtn || 'Personal Overtime'}
            </button>
          </div>


          {isMyOwnLoading ? (
            <div className="text-center py-16"><Loader2 className="animate-spin text-green mx-auto" size={32} /></div>
          ) : safeMyOvertimes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center text-gray-400">
              <Clock size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-semibold">{ov.emptyStates?.myOwn || 'You have no personal overtime hours recorded'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {safeMyOvertimes.map((req: any) => (
                <div key={req.id} className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-dark">📅 {req.date}</span>
                    {getStatusBadge(req.status)}
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-xs text-brown space-y-1">
                    <p>🕒 {ov.card?.hours || 'Hours:'} <strong>{req.start_time || req.startTime} ← {req.end_time || req.endTime}</strong></p>
                    {req.notes && <p>📝 {ov.card?.notes || 'Notes:'} {lang === 'en' && req.notes === 'انجاز العمل' ? 'Task completion' : req.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal 1: Assign Manager Overtime to Employee */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-modal max-w-md w-full p-6 animate-slide-up">
            <h3 className="font-bold text-dark text-lg border-b border-gray-100 pb-3 mb-4">{ov.form?.assignTitle || 'Assign Employee to Overtime'}</h3>
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!managerForm.user_id || !managerForm.date || !managerForm.start_time || !managerForm.end_time) {
                  toast.error(ov.form?.requiredError || 'Please fill all required fields');
                  return;
                }
                createManagerMutation.mutate({
                  user_id: Number(managerForm.user_id),
                  date: managerForm.date,
                  start_time: managerForm.start_time,
                  end_time: managerForm.end_time,
                  notes: managerForm.notes || undefined
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="form-label">{ov.form?.selectEmployee || 'Select Employee'} <span className="text-red-500">*</span></label>
                <select
                  className="form-input"
                  required
                  value={managerForm.user_id}
                  onChange={e => setManagerForm({...managerForm, user_id: e.target.value})}
                >
                  <option value="">{ov.form?.selectEmployeePlaceholder || '-- Select Employee --'}</option>
                  {(Array.isArray(employees) ? employees : employees?.data || []).map((emp: any) => {
                    const empName = emp.name || emp.user?.name || `موظف #${emp.id}`;
                    return <option key={emp.id} value={emp.user_id || emp.id}>{empName}</option>;
                  })}
                </select>
              </div>

              <div>
                <label className="form-label">{ov.form?.date || 'Date'} <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  className="form-input"
                  required
                  value={managerForm.date}
                  onChange={e => setManagerForm({...managerForm, date: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">{ov.form?.startTime || 'Start Time'} <span className="text-red-500">*</span></label>
                  <input
                    type="time"
                    className="form-input"
                    required
                    value={managerForm.start_time}
                    onChange={e => setManagerForm({...managerForm, start_time: e.target.value})}
                  />
                </div>
                <div>
                  <label className="form-label">{ov.form?.endTime || 'End Time'} <span className="text-red-500">*</span></label>
                  <input
                    type="time"
                    className="form-input"
                    required
                    value={managerForm.end_time}
                    onChange={e => setManagerForm({...managerForm, end_time: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">{ov.form?.notes || 'Notes / Reason'}</label>
                <textarea
                  className="form-input resize-none h-20"
                  placeholder={ov.form?.notesPlaceholder || 'Example: Urgent project completion...'}
                  value={managerForm.notes}
                  onChange={e => setManagerForm({...managerForm, notes: e.target.value})}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={createManagerMutation.isPending}
                  className="flex-1 btn-primary py-2.5 flex items-center justify-center disabled:opacity-50"
                >
                  {createManagerMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : (ov.form?.submitAssign || 'Save Assignment')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200"
                >
                  {ov.form?.cancel || 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Create Personal Employee Overtime */}
      {showMyOvertimeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-modal max-w-md w-full p-6 animate-slide-up">
            <h3 className="font-bold text-dark text-lg border-b border-gray-100 pb-3 mb-4">{ov.form?.personalTitle || 'Personal Overtime Request'}</h3>
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!myOwnForm.date || !myOwnForm.start_time || !myOwnForm.end_time) {
                  toast.error(ov.form?.requiredError || 'Please fill all required fields');
                  return;
                }
                createMyOwnMutation.mutate({
                  date: myOwnForm.date,
                  start_time: myOwnForm.start_time,
                  end_time: myOwnForm.end_time,
                  notes: myOwnForm.notes || undefined
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="form-label">{ov.form?.date || 'Date'} <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  className="form-input"
                  required
                  value={myOwnForm.date}
                  onChange={e => setMyOwnForm({...myOwnForm, date: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">{ov.form?.startTime || 'Start Time'} <span className="text-red-500">*</span></label>
                  <input
                    type="time"
                    className="form-input"
                    required
                    value={myOwnForm.start_time}
                    onChange={e => setMyOwnForm({...myOwnForm, start_time: e.target.value})}
                  />
                </div>
                <div>
                  <label className="form-label">{ov.form?.endTime || 'End Time'} <span className="text-red-500">*</span></label>
                  <input
                    type="time"
                    className="form-input"
                    required
                    value={myOwnForm.end_time}
                    onChange={e => setMyOwnForm({...myOwnForm, end_time: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">{ov.form?.notes || 'Reason / Notes'}</label>
                <textarea
                  className="form-input resize-none h-20"
                  placeholder={ov.form?.personalNotesPlaceholder || 'Reason for overtime...'}
                  value={myOwnForm.notes}
                  onChange={e => setMyOwnForm({...myOwnForm, notes: e.target.value})}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={createMyOwnMutation.isPending}
                  className="flex-1 btn-primary py-2.5 flex items-center justify-center disabled:opacity-50"
                >
                  {createMyOwnMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : (ov.form?.submitPersonal || 'Submit Request')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowMyOvertimeModal(false)}
                  className="px-4 py-2.5 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200"
                >
                  {ov.form?.cancel || 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
