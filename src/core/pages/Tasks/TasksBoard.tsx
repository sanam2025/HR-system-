import { useState, useMemo } from 'react';
import { Plus, X, Loader2, CheckCircle2, XCircle, ClipboardList, AlertCircle, Clock, Paperclip } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTasks,
  getTask,
  createTask,
  cancelTask,
  reviewTaskSubmission,
  downloadAttachment,
  getManagerEmployeesForTasks,
  getCompletedTasksCount,
  type Task,
} from '../../../api/tasks';
import { useLanguage } from '../../../i18n/translations/LanguageContext';const STATUS_MAP: Record<string, { label: string; labelEn: string; color: string; badge: string }> = {
  pending:    { label: 'جديدة',        labelEn: 'New',         color: '#3b82f6', badge: '#eff6ff' },
  in_progress:{ label: 'قيد التنفيذ',  labelEn: 'In Progress', color: '#f59e0b', badge: '#fffbeb' },
  submitted:  { label: 'قيد المراجعة', labelEn: 'Under Review',color: '#8b5cf6', badge: '#f5f3ff' },
  completed:  { label: 'مكتملة',        labelEn: 'Completed',   color: '#22c55e', badge: '#f0fdf4' },
  cancelled:  { label: 'ملغاة',         labelEn: 'Cancelled',   color: '#ef4444', badge: '#fef2f2' },
};

const STATUSES = ['pending', 'in_progress', 'submitted', 'completed'] as const;

const PRIORITY_MAP: Record<string, string> = {
  high: '#ef4444', medium: '#f59e0b', low: '#22c55e',
  عالية: '#ef4444', متوسطة: '#f59e0b', منخفضة: '#22c55e',
};

function getAssigneeName(task: Task): string {
  return task.assignee?.user?.name || task.assignee?.name || '—';
}

function getAssigneeInitial(task: Task): string {
  const n = getAssigneeName(task);
  return n !== '—' ? n.charAt(0).toUpperCase() : '?';
}

interface StarRatingProps { value: number; onChange: (v: number) => void; }
function StarRating({ value, onChange }: StarRatingProps) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type="button"
          onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          className={`text-2xl bg-transparent border-none cursor-pointer transition-colors ${n <= (hover || value) ? 'text-amber-500' : 'text-gray-300'}`}
        >★</button>
      ))}
    </div>
  );
}
export default function TasksBoard() {
  const { t, dir, lang } = useLanguage();
  const qc = useQueryClient();  const [showCreate, setShowCreate] = useState(false);
  const [reviewTask, setReviewTask] = useState<Task | null>(null);
  const [reviewScore, setReviewScore] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewStatus, setReviewStatus] = useState<'approved' | 'rejected'>('approved');
  const [form, setForm] = useState({ title: '', assigned_to: '', priority: 'high', due_date: '', description: '' });  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: () => getTasks(),
  });

  const { data: completedCount } = useQuery({
    queryKey: ['tasks-completed-count'],
    queryFn: getCompletedTasksCount,
    retry: false,
  });

  const { data: employees = [] } = useQuery({
    queryKey: ['manager-employees'],
    queryFn: getManagerEmployeesForTasks,
  });

  const { data: reviewTaskDetails, isLoading: isReviewLoading } = useQuery({
    queryKey: ['task', reviewTask?.id],
    queryFn: () => getTask(reviewTask!.id),
    enabled: !!reviewTask,
  });

  const activeReviewTask = reviewTaskDetails || reviewTask;  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      toast.success(t.tasks.createModal.success);
      qc.invalidateQueries({ queryKey: ['tasks'] });
      setShowCreate(false);
      setForm({ title: '', assigned_to: '', priority: 'high', due_date: '', description: '' });
    },
    onError: () => toast.error('فشل في إنشاء المهمة'),
  });

  const cancelMutation = useMutation({
    mutationFn: cancelTask,
    onSuccess: () => {
      toast.success('تم إلغاء المهمة بنجاح');
      qc.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: () => toast.error('فشل في إلغاء المهمة'),
  });

  const reviewMutation = useMutation({
    mutationFn: ({ submissionId, data }: { submissionId: number; data: any }) =>
      reviewTaskSubmission(submissionId, data),
    onSuccess: () => {
      toast.success(reviewStatus === 'approved' ? 'تمت الموافقة على المهمة' : 'تم رفض المهمة');
      qc.invalidateQueries({ queryKey: ['tasks'] });
      setReviewTask(null);
      setReviewScore(0);
      setReviewComment('');
    },
    onError: () => toast.error('فشل في إرسال المراجعة'),
  });  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.assigned_to || !form.due_date) {
      toast.error(t.tasks.createModal.requiredError);
      return;
    }
    createMutation.mutate({
      title: form.title,
      description: form.description || undefined,
      assigned_to: Number(form.assigned_to),
      priority: form.priority as 'high' | 'medium' | 'low',
      due_date: form.due_date,
    });
  };

  const handleCancel = (task: Task) => {
    if (confirm('هل أنت متأكد من إلغاء هذه المهمة؟')) {
      cancelMutation.mutate(task.id);
    }
  };

  const handleDownloadAttachment = async (url: string) => {
    try {
      toast.loading('جاري تحميل المرفق...', { id: 'download' });
      const blob = await downloadAttachment(url);
      const objectUrl = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';      const type = blob.type;
      let ext = '';
      if (type.includes('png')) ext = '.png';
      else if (type.includes('jpeg') || type.includes('jpg')) ext = '.jpg';
      else if (type.includes('pdf')) ext = '.pdf';
      
      a.download = `attachment${ext}`; // Force download to avoid browser blocking
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setTimeout(() => window.URL.revokeObjectURL(objectUrl), 10000);
      toast.success('تم تحميل المرفق', { id: 'download' });
    } catch (error) {
      console.error(error);
      toast.error('فشل في تحميل المرفق', { id: 'download' });
    }
  };

  const handleReview = () => {
    const subId = activeReviewTask?.latest_submission?.id || activeReviewTask?.submission?.id || (activeReviewTask as any)?.submission_id || activeReviewTask?.id;
    if (!subId) return;
    if (reviewStatus === 'approved' && !reviewScore) {
      toast.error('يرجى تحديد التقييم');
      return;
    }
    reviewMutation.mutate({
      submissionId: subId,
      data: {
        status: reviewStatus,
        score: reviewStatus === 'approved' ? reviewScore * 20 : undefined, // convert 1-5 → 0-100
        comment: reviewComment || undefined,
      },
    });
  };  const grouped = useMemo(() => {
    const map: Record<string, Task[]> = { pending: [], in_progress: [], submitted: [], completed: [] };
    tasks.forEach(tk => {
      let st = (tk.status || 'pending').toLowerCase().trim();
      if (st === 'جديدة' || st === 'جديد' || st === 'معلقة' || st === 'pending') st = 'pending';
      else if (st === 'قيد التنفيذ' || st === 'قيد_التنفيذ' || st === 'in_progress' || st === 'in progress' || st === 'rejected') st = 'in_progress';
      else if (st === 'قيد المراجعة' || st === 'مستلمة' || st === 'تم التسليم' || st === 'submitted') st = 'submitted';
      else if (st === 'مكتملة' || st === 'تمت' || st === 'completed' || st === 'approved') st = 'completed';
      
      if (st in map) map[st].push(tk);
      else map.pending.push(tk);
    });
    return map;
  }, [tasks]);

  const priorityLabel = (p: string) => {
    const map: Record<string, string> = { high: t.tasks.priorities.high, medium: t.tasks.priorities.medium, low: t.tasks.priorities.low };
    return map[p] || p;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-green" size={36} />
      </div>
    );
  }

  return (
    <div dir={dir}>      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-dark">{t.tasks.boardTitle}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {tasks.length} {t.tasks.activeTasks}
            {completedCount != null && (
              <span className="ms-3 text-green font-semibold">
                ✓ {typeof completedCount === 'object' ? (completedCount as any).count ?? (completedCount as any).completedTasksThisMonth ?? completedCount : completedCount} {t.tasks.completedThisMonth}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-green text-white border-none rounded-xl px-5 py-2.5 text-sm font-bold cursor-pointer shadow-[0_4px_14px_rgba(74,124,89,.3)] hover:bg-green-dark transition-colors"
        >
          <Plus size={16} strokeWidth={2.5} />
          {t.tasks.newTask}
        </button>
      </div>      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 pb-4">
        {STATUSES.map(statusKey => {
          const cfg = STATUS_MAP[statusKey];
          const colTasks = grouped[statusKey] || [];
          return (
            <div
              key={statusKey}
              className="bg-[#f8fafc] rounded-2xl p-4 flex flex-col gap-3"
              style={{ borderTop: `4px solid ${cfg.color}` }}
            >              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-dark">
                  {lang === 'ar' ? cfg.label : cfg.labelEn}
                </span>
                <span
                  className="text-xs font-bold rounded-full px-2.5 py-0.5"
                  style={{ background: cfg.badge, color: cfg.color }}
                >
                  {colTasks.length}
                </span>
              </div>

              {colTasks.length === 0 && (
                <p className="text-center text-gray-300 text-sm py-5">{t.tasks.noTasks}</p>
              )}              {colTasks.map(task => (
                <div
                  key={task.id}
                  className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex items-start gap-2">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                      style={{ background: PRIORITY_MAP[task.priority] || '#9ca3af' }}
                    />
                    <p className="text-sm font-semibold text-dark leading-relaxed flex-1">{task.title}</p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-[10px] font-bold">
                        {getAssigneeInitial(task)}
                      </div>
                      <span className="text-xs text-gray-500">{getAssigneeName(task)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-gray-400">
                      <Clock size={11} />
                      {task.due_date}
                    </div>
                  </div>                  <div className="mt-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: PRIORITY_MAP[task.priority] + '20', color: PRIORITY_MAP[task.priority] || '#9ca3af' }}>
                      {priorityLabel(task.priority)}
                    </span>
                  </div>                  {task.submission?.score != null && (
                    <div className="mt-2 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                      {'★'.repeat(Math.round(task.submission.score / 20))}{'☆'.repeat(5 - Math.round(task.submission.score / 20))} {task.submission.score}/100
                    </div>
                  )}                  <div className="mt-3 flex gap-2">                    {(task.status === 'submitted' || task.status === 'قيد المراجعة') && (
                      <button
                        onClick={() => { setReviewTask(task); setReviewScore(0); setReviewComment(''); setReviewStatus('approved'); }}
                        className="flex-1 flex items-center justify-center gap-1 text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100 rounded-xl py-1.5 hover:bg-purple-100 transition-colors"
                      >
                        <ClipboardList size={13} /> {t.tasks.reviewTask}
                      </button>
                    )}                    {['pending', 'جديدة', 'جديد', 'معلقة'].includes((task.status || '').toLowerCase().trim()) && (
                      <button
                        onClick={() => handleCancel(task)}
                        disabled={cancelMutation.isPending}
                        className="flex items-center justify-center gap-1 text-xs font-bold bg-red-50 text-red-600 border border-red-100 rounded-xl py-1.5 px-2.5 hover:bg-red-100 transition-colors disabled:opacity-50"
                      >
                        <XCircle size={13} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>      {showCreate && (
        <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50 p-4">
          <div dir={dir} className="bg-white rounded-2xl w-full max-w-lg shadow-modal overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between px-6 pt-5">
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-semibold text-dark">{t.tasks.createModal.title}</h3>
                <Plus size={20} className="text-dark" strokeWidth={2.8} />
              </div>
              <button onClick={() => setShowCreate(false)} className="p-1 rounded-md bg-transparent border-none cursor-pointer hover:bg-gray-100 transition-colors">
                <X size={18} className="text-gray-400" strokeWidth={1.8} />
              </button>
            </div>
            <div className="h-px bg-gray-200 mt-3.5" />

            <form onSubmit={handleCreate} className="px-6 py-6 flex flex-col gap-4">
              <div>
                <label className="form-label">{t.tasks.createModal.taskTitle} <span className="text-red-500">*</span></label>
                <input
                  className="form-input"
                  placeholder={t.tasks.createModal.taskTitlePlaceholder}
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="form-label">{t.tasks.createModal.assignee} <span className="text-red-500">*</span></label>
                  <select
                    className="form-input"
                    value={form.assigned_to}
                    onChange={e => setForm({ ...form, assigned_to: e.target.value })}
                  >
                    <option value="">{t.tasks.createModal.selectEmployee}</option>
                    {employees.map((emp: any) => {
                      const name = emp.user?.name || emp.name || `موظف #${emp.id}`;
                      return <option key={emp.id} value={emp.id}>{name}</option>;
                    })}
                  </select>
                </div>
                <div>
                  <label className="form-label">{t.tasks.createModal.priority}</label>
                  <select className="form-input" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                    <option value="high">{t.tasks.priorities.high}</option>
                    <option value="medium">{t.tasks.priorities.medium}</option>
                    <option value="low">{t.tasks.priorities.low}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">{t.tasks.createModal.dueDate} <span className="text-red-500">*</span></label>
                <input type="date" className="form-input" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} />
              </div>

              <div>
                <label className="form-label">{t.tasks.createModal.description}</label>
                <textarea
                  className="form-input resize-none h-24"
                  placeholder={t.tasks.createModal.descriptionPlaceholder}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button type="submit" disabled={createMutation.isPending} className="flex-1 btn btn-primary disabled:opacity-50 flex justify-center items-center gap-2">
                  {createMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : t.tasks.createModal.createBtn}
                </button>
                <button type="button" onClick={() => setShowCreate(false)} className="px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-semibold cursor-pointer hover:bg-gray-50 transition-colors">
                  {t.tasks.createModal.cancel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}      {reviewTask && (
        <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50 p-4">
          <div dir={dir} className="bg-white rounded-2xl w-full max-w-md shadow-modal overflow-hidden">
            <div className="flex items-center justify-between px-6 pt-5">
              <h3 className="text-lg font-extrabold text-dark">{t.tasks.reviewModal.title}</h3>
              <button onClick={() => setReviewTask(null)} className="bg-transparent border-none cursor-pointer">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="h-[3px] bg-purple-500 mt-3.5 mx-6 rounded-full" />

            <div className="px-6 py-6 flex flex-col gap-4">
              {isReviewLoading ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="animate-spin text-purple-600" size={32} />
                </div>
              ) : (
                <>                  <div className="bg-[#f8fafc] rounded-xl p-3.5">
                    <p className="font-semibold text-dark">{activeReviewTask?.title}</p>
                    <p className="text-sm text-gray-500 mt-1">{activeReviewTask && getAssigneeName(activeReviewTask)}</p>
                  </div>                  {activeReviewTask?.latest_submission && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5 text-sm">
                      <p className="font-semibold text-blue-900 mb-2">{t.tasks.reviewModal.submissionDetails}</p>
                      
                      <div className="flex flex-col gap-2">
                        {activeReviewTask.latest_submission.notes ? (
                          <p className="text-blue-800">
                            <span className="font-semibold">{t.tasks.reviewModal.notes}</span> {activeReviewTask.latest_submission.notes}
                          </p>
                        ) : (
                          <p className="text-blue-600/70 italic">{t.tasks.reviewModal.noNotes}</p>
                        )}
                        
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-semibold text-blue-800">{t.tasks.reviewModal.attachment}</span>
                          {activeReviewTask.latest_submission.attachment_url ? (
                            <button 
                              type="button"
                              onClick={() => handleDownloadAttachment(activeReviewTask.latest_submission!.attachment_url!)}
                              className="inline-flex items-center gap-1.5 text-blue-700 bg-blue-100 hover:bg-blue-200 px-3 py-1.5 rounded-lg font-semibold transition-colors border-none cursor-pointer"
                            >
                              <Paperclip size={14} /> {t.tasks.reviewModal.viewAttachment}
                            </button>
                          ) : (
                            <span className="text-blue-600/70 italic">{t.tasks.reviewModal.noAttachment}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}                  <div>
                    <label className="form-label mb-2 block">{t.tasks.reviewModal.decision}</label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setReviewStatus('approved')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border transition-all ${reviewStatus === 'approved' ? 'bg-green text-white border-green' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                      >
                        <CheckCircle2 size={15} /> {t.tasks.reviewModal.approve}
                      </button>
                      <button
                        type="button"
                        onClick={() => setReviewStatus('rejected')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border transition-all ${reviewStatus === 'rejected' ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                      >
                        <XCircle size={15} /> {t.tasks.reviewModal.reject}
                      </button>
                    </div>
                  </div>                  {reviewStatus === 'approved' && (
                    <div>
                      <label className="form-label">{t.tasks.rateModal.rating}</label>
                      <StarRating value={reviewScore} onChange={setReviewScore} />
                      {reviewScore > 0 && (
                        <p className="text-xs text-amber-600 mt-1">
                          {[t.tasks.rateModal.ratings.poor, t.tasks.rateModal.ratings.fair, t.tasks.rateModal.ratings.good, t.tasks.rateModal.ratings.veryGood, t.tasks.rateModal.ratings.excellent][reviewScore - 1]}
                          {' '} ({reviewScore * 20}/100)
                        </p>
                      )}
                    </div>
                  )}

                  {reviewStatus === 'rejected' && (
                    <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-red-700">
                      <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                      {t.tasks.reviewModal.rejectNotice}
                    </div>
                  )}                  <div>
                    <label className="form-label">{t.tasks.rateModal.notes}</label>
                    <textarea
                      className="form-input resize-none h-20"
                      placeholder={t.tasks.rateModal.notesPlaceholder}
                      value={reviewComment}
                      onChange={e => setReviewComment(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleReview}
                      disabled={reviewMutation.isPending}
                      className="flex-1 btn btn-primary disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                      {reviewMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : t.tasks.rateModal.saveBtn}
                    </button>
                    <button
                      onClick={() => setReviewTask(null)}
                      className="px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-semibold cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      {t.tasks.rateModal.cancel}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
