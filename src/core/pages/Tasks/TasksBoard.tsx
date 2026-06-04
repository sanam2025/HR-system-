import { useState } from 'react';
import { mockTasks, mockEmployees } from '../../../data/mockData';
import { Plus, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// ── Types ──────────────────────────────────────────────────────────────────
type Task = typeof mockTasks[number] & { rating: number | null };

const STATUSES = ['New', 'In Progress', 'Completed', 'Late'];

const colConfig: Record<string, { label: string; topColor: string; badge: string; dot: string }> = {
  'New':         { label: 'New',         topColor: '#3b82f6', badge: '#eff6ff', dot: '#3b82f6' },
  'In Progress': { label: 'In Progress', topColor: '#f59e0b', badge: '#fffbeb', dot: '#f59e0b' },
  'Completed':   { label: 'Completed',   topColor: '#22c55e', badge: '#f0fdf4', dot: '#22c55e' },
  'Late':        { label: 'Late',      topColor: '#ef4444', badge: '#fef2f2', dot: '#ef4444' },
};

const priorityDot: Record<string, string> = {
  'High':   '#ef4444',
  'Medium': '#f59e0b',
  'Low':    '#22c55e',
};

// ── Star Rating ─────────────────────────────────────────────────────────────
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

// ── Component ──────────────────────────────────────────────────────────────
export default function TasksBoard() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [showCreate, setShowCreate] = useState(false);
  const [showEval, setShowEval] = useState<Task | null>(null);
  const [evalRating, setEvalRating] = useState(0);
  const [evalNote, setEvalNote] = useState('');
  const [form, setForm] = useState({ title: '', assigneeId: '', priority: 'Medium', dueDate: '', description: '' });

  const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.assigneeId || !form.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    const assignee = mockEmployees.find(emp => emp.id === Number(form.assigneeId));
    setTasks(prev => [{
      id: Date.now(), ...form,
      assigneeId: Number(form.assigneeId),
      assigneeName: assignee?.name || '',
      status: 'New', rating: null,
      createdAt: new Date().toISOString().split('T')[0],
    }, ...prev]);
    setShowCreate(false);
    setForm({ title: '', assigneeId: '', priority: 'Medium', dueDate: '', description: '' });
    toast.success('Task created successfully');
  };

  const handleEvaluate = () => {
    if (!showEval) return;
    if (!evalRating) { toast.error('Please select a rating for the task'); return; }
    setTasks(prev => prev.map(t => t.id === showEval.id ? { ...t, rating: evalRating, status: 'Completed' } : t));
    toast.success('Task rated successfully');
    setShowEval(null); setEvalRating(0); setEvalNote('');
  };

  return (
    <div dir="ltr" style={{ fontFamily: 'inherit' }}>
      <Toaster position="top-center" />

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1a2332', margin: 0 }}>Tasks Board</h2>
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{tasks.length} active tasks</p>
        </div>

        {/* Create Task Button */}
        <button
          onClick={() => setShowCreate(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#4A7C59', color: '#fff',
            border: 'none', borderRadius: 10, padding: '10px 20px',
            fontSize: 14, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(74,124,89,.3)',
            transition: 'background .2s, transform .15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#3a6347')}
          onMouseLeave={e => (e.currentTarget.style.background = '#4A7C59')}
        >
          <Plus size={16} strokeWidth={2.5} />
          New Task
        </button>
      </div>

      {/* ── Kanban Grid ── */}
      <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 12 }}>
        {STATUSES.map(status => {
          const cfg = colConfig[status];
          const colTasks = tasks.filter(t => t.status === status);
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
                <span style={{ fontWeight: 700, fontSize: 14, color: '#1a2332' }}>{cfg.label}</span>
                <span style={{
                  fontSize: 12, fontWeight: 700,
                  background: cfg.badge, color: cfg.topColor,
                  borderRadius: 20, padding: '2px 10px',
                }}>
                  {colTasks.length}
                </span>
              </div>

              {/* Task Cards */}
              {colTasks.length === 0 && (
                <p style={{ textAlign: 'center', color: '#d1d5db', fontSize: 13, padding: '20px 0' }}>No tasks found</p>
              )}

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
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%', flexShrink: 0, marginTop: 5,
                      background: priorityDot[task.priority] || '#9ca3af',
                    }} />
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#1a2332', lineHeight: 1.5 }}>
                      {task.title}
                    </p>
                  </div>

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

                  {task.rating && (
                    <div style={{ marginTop: 8, fontSize: 13, color: '#d97706', fontWeight: 700 }}>
                      {'★'.repeat(task.rating)}{'☆'.repeat(5 - task.rating)}
                    </div>
                  )}

                  {task.status === 'Completed' && !task.rating && (
                    <button
                      onClick={() => { setShowEval(task); setEvalRating(0); }}
                      style={{
                        marginTop: 10, width: '100%', fontSize: 12, fontWeight: 600,
                        background: '#fefce8', color: '#92400e',
                        border: '1px solid #fde68a', borderRadius: 8, padding: '6px 0',
                        cursor: 'pointer', transition: 'background .2s',
                      }}>
                      Rate Task
                    </button>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* ── Create Task Modal ══════════════════════════════════════════════ */}
      {showCreate && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16,
        }}>
          <div style={{
            background: '#fff', borderRadius: 20,
            width: '100%', maxWidth: 520,
            boxShadow: '0 20px 60px rgba(0,0,0,.18)',
            overflow: 'hidden',
            animation: 'slideUp .25s ease',
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 24px 0',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: '#1a2332' }}>Create New Task</h3>
                <Plus size={20} style={{ color: '#1a2332' }} strokeWidth={2.8} />
              </div>
              <button onClick={() => setShowCreate(false)} style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 6,
              }}>
                <X size={18} style={{ color: '#9ca3af' }} strokeWidth={1.8} />
              </button>
            </div>
            {/* Divider */}
            <div style={{ height: 1, background: '#e5e7eb', marginTop: 14 }} />

            <form onSubmit={handleCreate} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Task Title */}
              <div>
                <label style={labelStyle}>Task Title <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  style={inputStyle}
                  placeholder="Enter task title..."
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                />
              </div>

              {/* Assignee + Priority */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Assignee <span style={{ color: '#ef4444' }}>*</span></label>
                  <select style={inputStyle} value={form.assigneeId}
                    onChange={e => setForm({ ...form, assigneeId: e.target.value })}>
                    <option value="">Select Employee...</option>
                    {mockEmployees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Priority</label>
                  <select style={inputStyle} value={form.priority}
                    onChange={e => setForm({ ...form, priority: e.target.value })}>
                    {['High', 'Medium', 'Low'].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label style={labelStyle}>Due Date <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="date" style={inputStyle} value={form.dueDate}
                  onChange={e => setForm({ ...form, dueDate: e.target.value })} />
              </div>

              {/* Description */}
              <div>
                <label style={labelStyle}>Description</label>
                <textarea style={{ ...inputStyle, resize: 'none', height: 90 }}
                  placeholder="Detailed description of the task..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
                <button type="button" onClick={() => setShowCreate(false)} style={{
                  padding: '12px 22px', background: '#fff', color: '#374151',
                  border: '1.5px solid #d1d5db', borderRadius: 10,
                  fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'inherit',
                }}>
                  Cancel
                </button>
                <button type="submit" style={{
                  flex: 1, background: '#4A7C59', color: '#fff',
                  border: 'none', borderRadius: 10, padding: '12px 0',
                  fontSize: 15, fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(74,124,89,.3)',
                  transition: 'background .2s', fontFamily: 'inherit',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#3a6347')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#4A7C59')}>
                  Create & Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Rate Task Modal ════════════════════════════════════════════════ */}
      {showEval && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16,
        }}>
          <div style={{
            background: '#fff', borderRadius: 20,
            width: '100%', maxWidth: 440,
            boxShadow: '0 20px 60px rgba(0,0,0,.18)',
            overflow: 'hidden',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 24px 0',
            }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1a2332' }}>Rate Task</h3>
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
                <label style={labelStyle}>Rating</label>
                <StarRating value={evalRating} onChange={setEvalRating} />
                {evalRating > 0 && <p style={{ margin: '4px 0 0', fontSize: 12, color: '#d97706' }}>{ratingLabels[evalRating]}</p>}
              </div>
              <div>
                <label style={labelStyle}>Notes</label>
                <textarea style={{ ...inputStyle, resize: 'none', height: 80 }}
                  placeholder="Add feedback about performance..."
                  value={evalNote} onChange={e => setEvalNote(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={handleEvaluate} style={{
                  flex: 1, background: '#4A7C59', color: '#fff',
                  border: 'none', borderRadius: 10, padding: '12px 0',
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                }}>
                  Save Rating
                </button>
                <button onClick={() => setShowEval(null)} style={{
                  padding: '12px 22px', background: '#fff', color: '#374151',
                  border: '1.5px solid #d1d5db', borderRadius: 10,
                  fontSize: 14, fontWeight: 600, cursor: 'pointer',
                }}>
                  Cancel
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

// ── Shared Styles ───────────────────────────────────────────────────────────
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6,
};
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', fontSize: 14,
  border: '1.5px solid #d1d5db', borderRadius: 10,
  background: '#fff', color: '#1a2332',
  outline: 'none', boxSizing: 'border-box',
  fontFamily: 'inherit', direction: 'ltr',
};