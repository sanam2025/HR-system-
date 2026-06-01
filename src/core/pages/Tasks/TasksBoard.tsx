import { useState } from 'react';
import { mockTasks, mockEmployees } from '../../../data/mockData';
import { Plus, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useLanguage } from '../../../i18n/LanguageContext';

// ── Types ──
type Task = typeof mockTasks[number] & { rating: number | null };

// Status keys match mockData (Arabic values)
const STATUSES = ['جديدة', 'قيد التنفيذ', 'مكتملة', 'متأخرة'] as const;
type Status = typeof STATUSES[number];

const colConfig: Record<Status, { topColor: string; badge: string; labelKey: 'new' | 'inProgress' | 'completed' | 'late' }> = {
  'جديدة':       { topColor: '#3b82f6', badge: '#eff6ff', labelKey: 'new' },
  'قيد التنفيذ': { topColor: '#f59e0b', badge: '#fffbeb', labelKey: 'inProgress' },
  'مكتملة':      { topColor: '#22c55e', badge: '#f0fdf4', labelKey: 'completed' },
  'متأخرة':      { topColor: '#ef4444', badge: '#fef2f2', labelKey: 'late' },
};

const priorityDot: Record<string, string> = {
  'عالية':    '#ef4444',
  'متوسطة':  '#f59e0b',
  'منخفضة':  '#22c55e',
  'High':    '#ef4444',
  'Medium':  '#f59e0b',
  'Low':     '#22c55e',
};

// ── Star Rating ──
function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type="button"
          onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          style={{ fontSize: 26, background: 'none', border: 'none', cursor: 'pointer',
            color: n <= (hover || value) ? '#d97706' : '#d1d5db', transition: 'color .15s' }}>
          ★
        </button>
      ))}
    </div>
  );
}

// ── Component ──
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
    { value: 'عالية',   label: t.tasks.priorities.high },
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
    setShowEval(null); setEvalRating(0); setEvalNote('');
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6,
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', fontSize: 14,
    border: '1.5px solid #d1d5db', borderRadius: 10,
    background: '#fff', color: '#1a2332',
    outline: 'none', boxSizing: 'border-box',
    fontFamily: 'inherit',
  };

  return (
    <div dir={dir} style={{ fontFamily: 'inherit' }}>
      <Toaster position="top-center" />

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1a2332', margin: 0 }}>{t.tasks.boardTitle}</h2>
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{tasks.length} {t.tasks.activeTasks}</p>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#4A7C59', color: '#fff',
            border: 'none', borderRadius: 10, padding: '10px 20px',
            fontSize: 14, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(74,124,89,.3)',
            transition: 'background .2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#3a6347')}
          onMouseLeave={e => (e.currentTarget.style.background = '#4A7C59')}
        >
          <Plus size={16} strokeWidth={2.5} />
          {t.tasks.newTask}
        </button>
      </div>

      {/* ── Kanban Grid ── */}
      <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 12 }}>
        {STATUSES.map(status => {
          const cfg = colConfig[status];
          const colTasks = tasks.filter(tk => tk.status === status);
          return (
            <div key={status} style={{
              minWidth: 270, flex: '0 0 270px',
              background: '#f8fafc',
              borderRadius: 16,
              borderTop: `4px solid ${cfg.topColor}`,
              padding: 16,
              display: 'flex', flexDirection: 'column', gap: 12,
            }}>
              {/* Column Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: '#1a2332' }}>
                  {t.tasks.columns[cfg.labelKey]}
                </span>
                <span style={{
                  fontSize: 12, fontWeight: 700,
                  background: cfg.badge, color: cfg.topColor,
                  borderRadius: 20, padding: '2px 10px',
                }}>
                  {colTasks.length}
                </span>
              </div>

              {/* Empty state */}
              {colTasks.length === 0 && (
                <p style={{ textAlign: 'center', color: '#d1d5db', fontSize: 13, padding: '20px 0' }}>
                  {t.tasks.noTasks}
                </p>
              )}

              {/* Task Cards */}
              {colTasks.map(task => (
                <div key={task.id} style={{
                  background: '#fff', borderRadius: 14,
                  border: '1px solid #e5e7eb',
                  padding: 14,
                  boxShadow: '0 1px 4px rgba(0,0,0,.05)',
                  transition: 'box-shadow .2s, transform .2s',
                  cursor: 'pointer',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,.1)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,.05)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Title + Priority dot */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%', flexShrink: 0, marginTop: 5,
                      background: priorityDot[task.priority] || '#9ca3af',
                    }} />
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#1a2332', lineHeight: 1.5 }}>
                      {task.title}
                    </p>
                  </div>

                  {/* Assignee + Date */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{
                        width: 26, height: 26, borderRadius: '50%',
                        background: '#dcfce7', color: '#16a34a',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, fontWeight: 700,
                      }}>
                        {task.assigneeName?.[0]}
                      </div>
                      <span style={{ fontSize: 12, color: '#6b7280' }}>{task.assigneeName}</span>
                    </div>
                    <span style={{ fontSize: 11, color: '#9ca3af' }}>{task.dueDate}</span>
                  </div>

                  {/* Star rating display */}
                  {task.rating && (
                    <div style={{ marginTop: 8, fontSize: 13, color: '#d97706', fontWeight: 700 }}>
                      {'★'.repeat(task.rating)}{'☆'.repeat(5 - task.rating)}
                    </div>
                  )}

                  {/* Rate button for completed unrated tasks */}
                  {task.status === 'مكتملة' && !task.rating && (
                    <button
                      onClick={() => { setShowEval(task); setEvalRating(0); }}
                      style={{
                        marginTop: 10, width: '100%', fontSize: 12, fontWeight: 600,
                        background: '#fefce8', color: '#92400e',
                        border: '1px solid #fde68a', borderRadius: 8, padding: '6px 0',
                        cursor: 'pointer', transition: 'background .2s',
                      }}>
                      {t.tasks.rateTask}
                    </button>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* ── Create Task Modal ══ */}
      {showCreate && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16,
        }}>
          <div dir={dir} style={{
            background: '#fff', borderRadius: 20,
            width: '100%', maxWidth: 520,
            boxShadow: '0 20px 60px rgba(0,0,0,.18)',
            overflow: 'hidden',
            animation: 'slideUp .25s ease',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 24px 0',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: '#1a2332' }}>{t.tasks.createModal.title}</h3>
                <Plus size={20} style={{ color: '#1a2332' }} strokeWidth={2.8} />
              </div>
              <button onClick={() => setShowCreate(false)} style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 6,
              }}>
                <X size={18} style={{ color: '#9ca3af' }} strokeWidth={1.8} />
              </button>
            </div>
            <div style={{ height: 1, background: '#e5e7eb', marginTop: 14 }} />

            <form onSubmit={handleCreate} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>{t.tasks.createModal.taskTitle} <span style={{ color: '#ef4444' }}>*</span></label>
                <input style={inputStyle} placeholder={t.tasks.createModal.taskTitlePlaceholder}
                  value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>{t.tasks.createModal.assignee} <span style={{ color: '#ef4444' }}>*</span></label>
                  <select style={inputStyle} value={form.assigneeId}
                    onChange={e => setForm({ ...form, assigneeId: e.target.value })}>
                    <option value="">{t.tasks.createModal.selectEmployee}</option>
                    {mockEmployees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>{t.tasks.createModal.priority}</label>
                  <select style={inputStyle} value={form.priority}
                    onChange={e => setForm({ ...form, priority: e.target.value })}>
                    {priorityOptions.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>{t.tasks.createModal.dueDate} <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="date" style={inputStyle} value={form.dueDate}
                  onChange={e => setForm({ ...form, dueDate: e.target.value })} />
              </div>

              <div>
                <label style={labelStyle}>{t.tasks.createModal.description}</label>
                <textarea style={{ ...inputStyle, resize: 'none', height: 90 }}
                  placeholder={t.tasks.createModal.descriptionPlaceholder}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>

              <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
                <button type="submit" style={{
                  flex: 1, background: '#4A7C59', color: '#fff',
                  border: 'none', borderRadius: 10, padding: '12px 0',
                  fontSize: 15, fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(74,124,89,.3)',
                  transition: 'background .2s', fontFamily: 'inherit',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#3a6347')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#4A7C59')}>
                  {t.tasks.createModal.createBtn}
                </button>
                <button type="button" onClick={() => setShowCreate(false)} style={{
                  padding: '12px 22px', background: '#fff', color: '#374151',
                  border: '1.5px solid #d1d5db', borderRadius: 10,
                  fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  {t.tasks.createModal.cancel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Rate Task Modal ═══ */}
      {showEval && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16,
        }}>
          <div dir={dir} style={{
            background: '#fff', borderRadius: 20,
            width: '100%', maxWidth: 440,
            boxShadow: '0 20px 60px rgba(0,0,0,.18)',
            overflow: 'hidden',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 24px 0',
            }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1a2332' }}>{t.tasks.rateModal.title}</h3>
              <button onClick={() => setShowEval(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} style={{ color: '#3b82f6' }} />
              </button>
            </div>
            <div style={{ height: 3, background: '#3b82f6', marginTop: 14, marginInline: 24, borderRadius: 4 }} />

            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: 14 }}>
                <p style={{ margin: 0, fontWeight: 600, color: '#1a2332' }}>{showEval.title}</p>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>{showEval.assigneeName}</p>
              </div>
              <div>
                <label style={labelStyle}>{t.tasks.rateModal.rating}</label>
                <StarRating value={evalRating} onChange={setEvalRating} />
                {evalRating > 0 && (
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: '#d97706' }}>{ratingLabels[evalRating]}</p>
                )}
              </div>
              <div>
                <label style={labelStyle}>{t.tasks.rateModal.notes}</label>
                <textarea style={{ ...inputStyle, resize: 'none', height: 80 }}
                  placeholder={t.tasks.rateModal.notesPlaceholder}
                  value={evalNote} onChange={e => setEvalNote(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={handleEvaluate} style={{
                  flex: 1, background: '#4A7C59', color: '#fff',
                  border: 'none', borderRadius: 10, padding: '12px 0',
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                }}>
                  {t.tasks.rateModal.saveBtn}
                </button>
                <button onClick={() => setShowEval(null)} style={{
                  padding: '12px 22px', background: '#fff', color: '#374151',
                  border: '1.5px solid #d1d5db', borderRadius: 10,
                  fontSize: 14, fontWeight: 600, cursor: 'pointer',
                }}>
                  {t.tasks.rateModal.cancel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(30px) } to { opacity:1; transform:translateY(0) } }`}</style>
    </div>
  );
}