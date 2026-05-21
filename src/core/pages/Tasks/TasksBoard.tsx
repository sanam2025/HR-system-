import { useState } from 'react';
import { mockTasks, mockEmployees } from '../../../data/mockData';
import { Plus, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// ── أنواع ──────────────────────────────────────────────────────────────────
type Task = typeof mockTasks[number] & { rating: number | null };

const STATUSES = ['جديدة', 'قيد التنفيذ', 'مكتملة', 'متأخرة'];

const colConfig: Record<string, { label: string; topColor: string; badge: string; dot: string }> = {
  'جديدة':       { label: 'جديدة',       topColor: '#3b82f6', badge: '#eff6ff', dot: '#3b82f6' },
  'قيد التنفيذ': { label: 'قيد التنفيذ', topColor: '#f59e0b', badge: '#fffbeb', dot: '#f59e0b' },
  'مكتملة':      { label: 'مكتملة',      topColor: '#22c55e', badge: '#f0fdf4', dot: '#22c55e' },
  'متأخرة':      { label: 'متأخرة',      topColor: '#ef4444', badge: '#fef2f2', dot: '#ef4444' },
};

const priorityDot: Record<string, string> = {
  'عالية':   '#ef4444',
  'متوسطة':  '#f59e0b',
  'منخفضة':  '#22c55e',
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

// ── الكومبوننت الرئيسي ────────────────────────────────────────────────────
export default function TasksBoard() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [showCreate, setShowCreate] = useState(false);
  const [showEval, setShowEval] = useState<Task | null>(null);
  const [evalRating, setEvalRating] = useState(0);
  const [evalNote, setEvalNote] = useState('');
  const [form, setForm] = useState({ title: '', assigneeId: '', priority: 'متوسطة', dueDate: '', description: '' });

  const ratingLabels = ['', 'ضعيف', 'مقبول', 'جيد', 'جيد جداً', 'ممتاز'];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.assigneeId || !form.dueDate) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
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
    setForm({ title: '', assigneeId: '', priority: 'متوسطة', dueDate: '', description: '' });
    toast.success('تم إنشاء المهمة بنجاح');
  };

  const handleEvaluate = () => {
    if (!showEval) return;
    if (!evalRating) { toast.error('يرجى اختيار تقييم للمهمة'); return; }
    setTasks(prev => prev.map(t => t.id === showEval.id ? { ...t, rating: evalRating, status: 'مكتملة' } : t));
    toast.success('تم تقييم المهمة بنجاح');
    setShowEval(null); setEvalRating(0); setEvalNote('');
  };

  return (
    <div dir="rtl" style={{ fontFamily: 'inherit' }}>
      <Toaster position="top-center" />

      {/* ── رأس الصفحة ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1a2332', margin: 0 }}>لوحة المهام</h2>
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{tasks.length} مهمة نشطة</p>
        </div>

        {/* زر مهمة جديدة - نفس الشكل بالصورة */}
        <button
          onClick={() => setShowCreate(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#1a6644', color: '#fff',
            border: 'none', borderRadius: 10, padding: '10px 20px',
            fontSize: 14, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(26,102,68,.3)',
            transition: 'background .2s, transform .15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#155436')}
          onMouseLeave={e => (e.currentTarget.style.background = '#1a6644')}
        >
          <Plus size={16} strokeWidth={2.5} />
          مهمة جديدة
        </button>
      </div>

      {/* ── لوحة كانبان ── */}
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
              {/* عنوان العمود */}
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

              {/* البطاقات */}
              {colTasks.length === 0 && (
                <p style={{ textAlign: 'center', color: '#d1d5db', fontSize: 13, padding: '20px 0' }}>لا توجد مهام</p>
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

                  {task.status === 'مكتملة' && !task.rating && (
                    <button
                      onClick={() => { setShowEval(task); setEvalRating(0); }}
                      style={{
                        marginTop: 10, width: '100%', fontSize: 12, fontWeight: 600,
                        background: '#fefce8', color: '#92400e',
                        border: '1px solid #fde68a', borderRadius: 8, padding: '6px 0',
                        cursor: 'pointer', transition: 'background .2s',
                      }}>
                      تقييم المهمة
                    </button>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* ══ مودال إنشاء مهمة جديدة ══════════════════════════════════════════ */}
      {showCreate && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16,
        }}>
          <div dir="rtl" style={{
            background: '#fff', borderRadius: 20,
            width: '100%', maxWidth: 520,
            boxShadow: '0 20px 60px rgba(0,0,0,.18)',
            overflow: 'hidden',
            animation: 'slideUp .25s ease',
          }}>
            {/* رأس المودال */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 24px 0',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: '#1a2332' }}>إنشاء مهمة جديدة</h3>
                <Plus size={20} style={{ color: '#1a2332' }} strokeWidth={2.8} />
              </div>
              <button onClick={() => setShowCreate(false)} style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 6,
              }}>
                <X size={18} style={{ color: '#9ca3af' }} strokeWidth={1.8} />
              </button>
            </div>
            {/* الخط الفاصل */}
            <div style={{ height: 1, background: '#e5e7eb', marginTop: 14 }} />

            <form onSubmit={handleCreate} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* عنوان المهمة */}
              <div>
                <label style={labelStyle}>عنوان المهمة <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  style={inputStyle}
                  placeholder="أدخل عنوان المهمة..."
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                />
              </div>

              {/* تعيين إلى + الأولوية - RTL: تعيين إلى يمين، الأولوية يسار */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>تعيين إلى <span style={{ color: '#ef4444' }}>*</span></label>
                  <select style={inputStyle} value={form.assigneeId}
                    onChange={e => setForm({ ...form, assigneeId: e.target.value })}>
                    <option value="">اختر موظفاً...</option>
                    {mockEmployees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>الأولوية</label>
                  <select style={inputStyle} value={form.priority}
                    onChange={e => setForm({ ...form, priority: e.target.value })}>
                    {['عالية', 'متوسطة', 'منخفضة'].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              {/* تاريخ التسليم */}
              <div>
                <label style={labelStyle}>تاريخ التسليم <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="date" style={inputStyle} value={form.dueDate}
                  onChange={e => setForm({ ...form, dueDate: e.target.value })} />
              </div>

              {/* الوصف */}
              <div>
                <label style={labelStyle}>الوصف</label>
                <textarea style={{ ...inputStyle, resize: 'none', height: 90 }}
                  placeholder="وصف تفصيلي للمهمة..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>

              {/* الأزرار - في RTL: إلغاء على اليمين، إنشاء على اليسار */}
              <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
                <button type="button" onClick={() => setShowCreate(false)} style={{
                  padding: '12px 22px', background: '#fff', color: '#374151',
                  border: '1.5px solid #d1d5db', borderRadius: 10,
                  fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'inherit',
                }}>
                  إلغاء
                </button>
                <button type="submit" style={{
                  flex: 1, background: '#1a6644', color: '#fff',
                  border: 'none', borderRadius: 10, padding: '12px 0',
                  fontSize: 15, fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(26,102,68,.3)',
                  transition: 'background .2s', fontFamily: 'inherit',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#155436')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#1a6644')}>
                  إنشاء وتعيين المهمة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══ مودال تقييم مهمة ════════════════════════════════════════════════ */}
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
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1a2332' }}>تقييم المهمة</h3>
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
                <label style={labelStyle}>التقييم</label>
                <StarRating value={evalRating} onChange={setEvalRating} />
                {evalRating > 0 && <p style={{ margin: '4px 0 0', fontSize: 12, color: '#d97706' }}>{ratingLabels[evalRating]}</p>}
              </div>
              <div>
                <label style={labelStyle}>ملاحظات</label>
                <textarea style={{ ...inputStyle, resize: 'none', height: 80 }}
                  placeholder="أضف ملاحظات حول أداء الموظف..."
                  value={evalNote} onChange={e => setEvalNote(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={handleEvaluate} style={{
                  flex: 1, background: '#1a6644', color: '#fff',
                  border: 'none', borderRadius: 10, padding: '12px 0',
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                }}>
                  حفظ التقييم
                </button>
                <button onClick={() => setShowEval(null)} style={{
                  padding: '12px 22px', background: '#fff', color: '#374151',
                  border: '1.5px solid #d1d5db', borderRadius: 10,
                  fontSize: 14, fontWeight: 600, cursor: 'pointer',
                }}>
                  إلغاء
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

// ── أنماط مشتركة ────────────────────────────────────────────────────────────
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6,
};
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', fontSize: 14,
  border: '1.5px solid #d1d5db', borderRadius: 10,
  background: '#fff', color: '#1a2332',
  outline: 'none', boxSizing: 'border-box',
  fontFamily: 'inherit', direction: 'rtl',
};