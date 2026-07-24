import { useState } from 'react';
import { mockTasks, mockEmployees } from '../../../data/mockData';
import { Plus, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useLanguage } from '../../../i18n/translations/LanguageContext';

// ── Types ──
type Task = typeof mockTasks[number] & { rating: number | null };

// Status keys match mockData (Arabic values)
const STATUSES = ['جديدة', 'قيد التنفيذ', 'مكتملة', 'متأخرة'] as const;
type Status = typeof STATUSES[number];

const colConfig: Record<Status, { topColor: string; badge: string; labelKey: 'new' | 'inProgress' | 'completed' | 'late' }> = {
  'جديدة': { topColor: '#3b82f6', badge: '#eff6ff', labelKey: 'new' },
  'قيد التنفيذ': { topColor: '#f59e0b', badge: '#fffbeb', labelKey: 'inProgress' },
  'مكتملة': { topColor: '#22c55e', badge: '#f0fdf4', labelKey: 'completed' },
  'متأخرة': { topColor: '#ef4444', badge: '#fef2f2', labelKey: 'late' },
};

const priorityDot: Record<string, string> = {
  'عالية': '#ef4444',
  'متوسطة': '#f59e0b',
  'منخفضة': '#22c55e',
  'High': '#ef4444',
  'Medium': '#f59e0b',
  'Low': '#22c55e',
};

interface StarRatingProps {
  value: number;
  onChange: (v: number) => void;
}

function StarRating({ value, onChange }: StarRatingProps) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          className={`text-2xl bg-transparent border-none cursor-pointer transition-colors duration-150 ${n <= (hover || value) ? 'text-amber-600' : 'text-gray-300'
            }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function TasksBoard() {
  const { t, dir } = useLanguage();
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [showCreate, setShowCreate] = useState(false);
  const [showEval, setShowEval] = useState<Task | null>(null);
  const [evalRating, setEvalRating] = useState(0);
  const [evalNote, setEvalNote] = useState('');
  const [form, setForm] = useState({ title: '', assigneeId: '', priority: 'عالية', dueDate: '', description: '' });

  const ratingLabels = [
    '',
    t.tasks.rateModal.ratings.poor,
    t.tasks.rateModal.ratings.fair,
    t.tasks.rateModal.ratings.good,
    t.tasks.rateModal.ratings.veryGood,
    t.tasks.rateModal.ratings.excellent,
  ];

  const priorityOptions = [
    { value: 'عالية', label: t.tasks.priorities.high },
    { value: 'متوسطة', label: t.tasks.priorities.medium },
    { value: 'منخفضة', label: t.tasks.priorities.low },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.assigneeId || !form.dueDate) {
      toast.error(t.tasks.createModal.requiredError);
      return;
    }
    const assignee = mockEmployees.find(emp => emp.id === Number(form.assigneeId));
    setTasks(prev => [{
      id: Date.now(), ...form,
      assigneeId: Number(form.assigneeId),
      assigneeName: assignee?.name || '',
      status: 'جديدة', rating: null,
      createdAt: new Date().toISOString().split('T')[0],
    }, ...prev]);
    setShowCreate(false);
    setForm({ title: '', assigneeId: '', priority: 'عالية', dueDate: '', description: '' });
    toast.success(t.tasks.createModal.success);
  };

  const handleEvaluate = () => {
    if (!showEval) return;
    if (!evalRating) { toast.error(t.tasks.rateModal.error); return; }
    setTasks(prev => prev.map(tk => tk.id === showEval.id ? { ...tk, rating: evalRating, status: 'مكتملة' } : tk));
    toast.success(t.tasks.rateModal.success);
    setShowEval(null);
    setEvalRating(0);
    setEvalNote('');
  };

  return (
    <div dir={dir}>
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-dark">{t.tasks.boardTitle}</h2>
          <p className="text-sm text-gray-500 mt-1">{tasks.length} {t.tasks.activeTasks}</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-green text-white border-none rounded-xl px-5 py-2.5 text-sm font-bold cursor-pointer shadow-[0_4px_14px_rgba(74,124,89,.3)] hover:bg-green-dark transition-colors duration-200"
        >
          <Plus size={16} strokeWidth={2.5} />
          {t.tasks.newTask}
        </button>
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 pb-3">
        {STATUSES.map(status => {
          const cfg = colConfig[status];
          const colTasks = tasks.filter(tk => tk.status === status);
          return (
            <div key={status} className="bg-[#f8fafc] rounded-2xl p-4 flex flex-col gap-3" style={{ borderTop: `4px solid ${cfg.topColor}` }}>
              {/* Column Header */}
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-dark">
                  {t.tasks.columns[cfg.labelKey]}
                </span>
                <span
                  className="text-xs font-bold rounded-full px-2.5 py-0.5"
                  style={{ background: cfg.badge, color: cfg.topColor }}
                >
                  {colTasks.length}
                </span>
              </div>

              {colTasks.length === 0 && (
                <p className="text-center text-gray-300 text-sm py-5">{t.tasks.noTasks}</p>
              )}

              {/* Task Cards */}
              {colTasks.map(task => (
                <div
                  key={task.id}
                  className="bg-white rounded-2xl border border-gray-200 p-3.5 cursor-pointer shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex items-start gap-2">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                      style={{ background: priorityDot[task.priority] || '#9ca3af' }}
                    />
                    <p className="text-sm font-semibold text-dark leading-relaxed">{task.title}</p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-[10px] font-bold">
                        {task.assigneeName?.[0]}
                      </div>
                      <span className="text-xs text-gray-500">{task.assigneeName}</span>
                    </div>
                    <span className="text-[11px] text-gray-400">{task.dueDate}</span>
                  </div>

                  {task.rating && (
                    <div className="mt-2 text-sm text-amber-600 font-bold">
                      {'★'.repeat(task.rating)}{'☆'.repeat(5 - task.rating)}
                    </div>
                  )}

                  {task.status === 'مكتملة' && !task.rating && (
                    <button
                      onClick={() => { setShowEval(task); setEvalRating(0); }}
                      className="mt-2.5 w-full text-xs font-semibold bg-yellow-50 text-yellow-900 border border-yellow-200 rounded-lg py-1.5 cursor-pointer hover:bg-yellow-100 transition-colors"
                    >
                      {t.tasks.rateTask}
                    </button>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Create Task Modal */}
      {showCreate && (
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
                    value={form.assigneeId}
                    onChange={e => setForm({ ...form, assigneeId: e.target.value })}
                  >
                    <option value="">{t.tasks.createModal.selectEmployee}</option>
                    {mockEmployees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">{t.tasks.createModal.priority}</label>
                  <select
                    className="form-input"
                    value={form.priority}
                    onChange={e => setForm({ ...form, priority: e.target.value })}
                  >
                    {priorityOptions.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">{t.tasks.createModal.dueDate} <span className="text-red-500">*</span></label>
                <input type="date" className="form-input" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
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
                <button type="submit" className="flex-1 btn btn-primary">
                  {t.tasks.createModal.createBtn}
                </button>
                <button type="button" onClick={() => setShowCreate(false)} className="px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-semibold cursor-pointer hover:bg-gray-50 transition-colors">
                  {t.tasks.createModal.cancel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rate Task Modal */}
      {showEval && (
        <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50 p-4">
          <div dir={dir} className="bg-white rounded-2xl w-full max-w-md shadow-modal overflow-hidden">
            <div className="flex items-center justify-between px-6 pt-5">
              <h3 className="text-lg font-extrabold text-dark">{t.tasks.rateModal.title}</h3>
              <button onClick={() => setShowEval(null)} className="bg-transparent border-none cursor-pointer">
                <X size={20} className="text-blue-500" />
              </button>
            </div>
            <div className="h-[3px] bg-blue-500 mt-3.5 mx-6 rounded-full" />

            <div className="px-6 py-6 flex flex-col gap-4">
              <div className="bg-[#f8fafc] rounded-xl p-3.5">
                <p className="font-semibold text-dark">{showEval.title}</p>
                <p className="text-sm text-gray-500 mt-1">{showEval.assigneeName}</p>
              </div>
              <div>
                <label className="form-label">{t.tasks.rateModal.rating}</label>
                <StarRating value={evalRating} onChange={setEvalRating} />
                {evalRating > 0 && (
                  <p className="text-xs text-amber-600 mt-1">{ratingLabels[evalRating]}</p>
                )}
              </div>
              <div>
                <label className="form-label">{t.tasks.rateModal.notes}</label>
                <textarea
                  className="form-input resize-none h-20"
                  placeholder={t.tasks.rateModal.notesPlaceholder}
                  value={evalNote}
                  onChange={e => setEvalNote(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <button onClick={handleEvaluate} className="flex-1 btn btn-primary">
                  {t.tasks.rateModal.saveBtn}
                </button>
                <button onClick={() => setShowEval(null)} className="px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-semibold cursor-pointer hover:bg-gray-50 transition-colors">
                  {t.tasks.rateModal.cancel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}