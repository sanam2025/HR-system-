// ==============================================================
// ManagerAnnouncements — واجهة إدارة التعميمات للمدير
// ==============================================================
// الجدول يعرض: # | العنوان | الجمهور المستهدف | الحالة | الإجراءات
// الإجراءات:  تعديل ✏️ / حذف 🗑️ / نشر فوري 📢 (للمجدلة فقط)
// الفورم: مدمج فوق الجدول، يختفي تلقائياً عند الإلغاء
// الجمهور: مخفي للمدير (تلقائي = قسمه)
// ==============================================================

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Send, Loader2, Megaphone, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '../../../i18n/translations/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { AnnouncementsService } from '../../../api/service/HrService/AnnouncementsService';
import type { Announcement, Priority, AnnouncementStatus } from '../../../api/service/HrService/Types/AnnouncementsService.types';
import { useAuthStore } from '../../../store/authStore';
import { useDepartments } from '../../modules/HR/hooks/useDepartments';

// ── Helpers ─────────────────────────────────────────────────

const STATUS_STYLE: Record<AnnouncementStatus, string> = {
  draft: 'bg-gray-100    text-gray-500',
  scheduled: 'bg-purple-50   text-purple-600',
  active: 'bg-green-50    text-green-600',
  expired: 'bg-orange-50   text-orange-500',
};



// datetime-local  ←→  ISO helpers
const toInput = (iso?: string | null) => {
  if (!iso) return '';
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};
// adds buffer minutes to a date
const addMinutes = (date: Date, mins: number) => new Date(date.getTime() + mins * 60000);
const nowInput = () => toInput(addMinutes(new Date(), 2).toISOString());
const fromInput = (v: string) => new Date(v).toISOString();

// ── Form component ───────────────────────────────────────────

interface FormValues {
  title: string;
  content: string;
  priority: Priority;
  startsAt: string;
  expiresAt: string;
  target_audience: string;
  department_id: number | '';
}

function defaultForm(): FormValues {
  return { title: '', content: '', priority: 'medium', startsAt: nowInput(), expiresAt: '', target_audience: 'all', department_id: '' };
}

function annToForm(a: any): FormValues {
  return {
    title: a.title,
    content: a.content,
    priority: a.priority,
    startsAt: toInput(a.starts_at),
    expiresAt: toInput(a.expires_at),
    target_audience: a.target_audience || a.audience_type || 'all',
    department_id: a.department_id || '',
  };
}

interface AnnouncementFormProps {
  initial?: Announcement;
  onSave: (f: FormValues) => Promise<void>;
  onCancel: () => void;
}

function AnnouncementForm({ initial, onSave, onCancel }: AnnouncementFormProps) {
  const { t, lang } = useLanguage();
  const { currentUser } = useAuthStore();
  const [form, setForm] = useState<FormValues>(initial ? annToForm(initial) : defaultForm());
  const [saving, setSaving] = useState(false);
  const { departments } = useDepartments();

  const set = (k: keyof FormValues, v: any) => setForm(p => ({ ...p, [k]: v }));
  // minimum datetime = now + 1 minute
  const minDatetime = toInput(addMinutes(new Date(), 1).toISOString());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error(t.announcements.form.fillRequired);
      return;
    }
    setSaving(true);
    try { await onSave(form); }
    finally { setSaving(false); }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 space-y-5"
    >
      <h3 className="font-bold text-dark text-lg flex items-center gap-2">
        <ClipboardList size={20} className="text-[#6B6358]" />
        {initial ? t.announcements.form.editTitle : t.announcements.form.createTitle}
      </h3>

      {/* العنوان */}
      <div>
        <label className="form-label">{t.announcements.form.titleLabel} <span className="text-red-500">*</span></label>
        <input
          className="form-input"
          value={form.title}
          onChange={e => set('title', e.target.value)}
          required
        />
      </div>

      {/* النص */}
      <div>
        <label className="form-label">{t.announcements.form.bodyLabel} <span className="text-red-500">*</span></label>
        <textarea
          className="form-input resize-none h-24"
          value={form.content}
          onChange={e => set('content', e.target.value)}
          required
        />
      </div>

      {/* الأولوية + التواريخ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="form-label">{t.announcements.form.priorityLabel}</label>
          <select
            className="form-input"
            value={form.priority}
            onChange={e => set('priority', e.target.value)}
          >
            <option value="low">{t.announcements.priorities.info}</option>
            <option value="medium">{t.announcements.priorities.normal}</option>
            <option value="high">{t.announcements.priorities.urgent}</option>
          </select>
        </div>
        <div>
          <label className="form-label">{t.announcements.form.startsAtLabel} <span className="text-red-500">*</span></label>
          <input
            type="datetime-local"
            className="form-input"
            min={minDatetime}
            value={form.startsAt}
            onChange={e => set('startsAt', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="form-label">{t.announcements.form.endsAtLabel} <span className="text-red-500">*</span></label>
          <input
            type="datetime-local"
            className="form-input"
            min={form.startsAt || minDatetime}
            value={form.expiresAt}
            onChange={e => set('expiresAt', e.target.value)}
            required
          />
        </div>
      </div>

      {/* الجمهور */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">{lang === 'ar' ? 'الجمهور المستهدف' : 'Target Audience'} <span className="text-red-500">*</span></label>
          <select
            className="form-input"
            value={form.target_audience}
            onChange={e => set('target_audience', e.target.value)}
          >
            <option value="all">{lang === 'ar' ? 'الكل' : 'All'}</option>
            <option value="employees">{lang === 'ar' ? 'الموظفون' : 'Employees'}</option>
            <option value="managers">{lang === 'ar' ? 'المدراء' : 'Managers'}</option>
            <option value="department">{lang === 'ar' ? 'قسم محدد' : 'Specific Department'}</option>
          </select>
        </div>

        {form.target_audience === 'department' && (
          <div>
            <label className="form-label">{lang === 'ar' ? 'اختر القسم' : 'Select Department'} <span className="text-red-500">*</span></label>
            <select
              className="form-input"
              value={form.department_id}
              onChange={e => set('department_id', e.target.value ? Number(e.target.value) : '')}
              required
            >
              <option value="">{lang === 'ar' ? 'اختر...' : 'Select...'}</option>
              {departments.map((dep: any) => (
                <option key={dep.id} value={dep.id}>{dep.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* أزرار */}
      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="btn btn-primary flex items-center gap-2"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          {saving ? t.announcements.form.savingBtn : t.announcements.form.saveBtn}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 px-6"
        >
          {t.announcements.form.cancelBtn}
        </button>
      </div>
    </form>
  );
}

// ── Main page ────────────────────────────────────────────────

export default function ManagerAnnouncements() {
  const { t, lang } = useLanguage();
  const { currentUser } = useAuthStore();
  const isHR = currentUser?.role === 'hr';

  const [list, setList] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [deleting, setDeleting] = useState<Announcement | null>(null);

  // ── data ──
  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await AnnouncementsService.getAll();
      const raw = res.data;
      const arr = Array.isArray(raw) ? raw : Array.isArray((raw as any)?.data) ? (raw as any).data : [];
      setList(arr);
    }
    catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  // ── handlers ──
  const handleCreate = async (f: FormValues) => {
    const starts = fromInput(f.startsAt);
    // Remove the validation that it must be in the future, as it will be a draft
    const status: AnnouncementStatus = 'draft';
    try {
      await AnnouncementsService.create({
        title: f.title,
        content: f.content,
        priority: f.priority,
        starts_at: starts,
        expires_at: fromInput(f.expiresAt),
        status,
        audience: f.target_audience,
        target_audience: f.target_audience,
        department_id: f.target_audience === 'department' ? (f.department_id || undefined) : undefined,
      } as any);
      toast.success(t.announcements.form.createdSuccess);
      setShowNew(false);
      fetchAll();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create announcement');
      throw err;
    }
  };

  const handleUpdate = async (f: FormValues) => {
    if (!editing) return;
    const starts = fromInput(f.startsAt);
    const status: AnnouncementStatus = editing.status === 'active' ? 'active' : 'draft';
    try {
      await AnnouncementsService.update(editing.id, {
        title: f.title,
        content: f.content,
        priority: f.priority,
        starts_at: starts,
        expires_at: fromInput(f.expiresAt),
        status,
        audience: f.target_audience,
        target_audience: f.target_audience,
        department_id: f.target_audience === 'department' ? (f.department_id || undefined) : undefined,
      } as any);
      toast.success(t.announcements.form.updatedSuccess);
      setEditing(null);
      fetchAll();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update announcement');
      throw err;
    }
  };

  const handleDelete = async (ann: Announcement) => {
    setDeleting(ann);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await AnnouncementsService.delete(deleting.id);
      toast.success(t.announcements.deleteConfirm.success);
      setDeleting(null);
      fetchAll();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete announcement');
    }
  };

  const [publishing, setPublishing] = useState<number | null>(null);

  const handlePublish = async (id: number) => {
    if (publishing === id) return;          // منع الضغط المتكرر
    setPublishing(id);
    try {
      await AnnouncementsService.publishNow(id);
      toast.success(t.announcements.list.publishedSuccess);
      fetchAll();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'فشل النشر');
    } finally {
      setPublishing(null);
    }
  };

  const formatDate = (iso: string | null) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-dark">{t.announcements.title}</h2>
          <p className="text-sm text-brown mt-1">{t.announcements.subtitle}</p>
        </div>
        {!showNew && !editing && (
          <button
            onClick={() => setShowNew(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            {t.announcements.createNew}
          </button>
        )}
      </div>

      {/* ── فورم الإنشاء ── */}
      {showNew && (
        <AnnouncementForm
          onSave={handleCreate}
          onCancel={() => setShowNew(false)}
        />
      )}

      {/* ── فورم التعديل ── */}
      {editing && (
        <AnnouncementForm
          key={editing.id}
          initial={editing}
          onSave={handleUpdate}
          onCancel={() => setEditing(null)}
        />
      )}

      {/* ── تأكيد الحذف ── */}
      {deleting && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-red-800 text-sm">{t.announcements.deleteConfirm.title}</h4>
            <p className="text-xs text-red-600 mt-1">{t.announcements.deleteConfirm.desc.replace('{title}', deleting.title)}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={confirmDelete} className="btn bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2">
              {t.announcements.deleteConfirm.yesBtn}
            </button>
            <button onClick={() => setDeleting(null)} className="btn bg-white border border-gray-200 text-gray-600 text-xs px-4 py-2 hover:bg-gray-50">
              {t.announcements.deleteConfirm.cancelBtn}
            </button>
          </div>
        </div>
      )}

      {/* ── الجدول ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">

        {/* رأس الجدول-كارد */}
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
          <Megaphone size={18} className="text-[#6B6358]" />
          <span className="font-bold text-dark">{t.announcements.list.title}</span>
          {!loading && (
            <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5 font-semibold ms-1">
              {list.length}
            </span>
          )}
        </div>

        {/* حالة التحميل */}
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400 gap-3">
            <Loader2 size={24} className="animate-spin" />
            <span className="text-sm">{t.announcements.list.loading}</span>
          </div>
        ) : list.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
            <Megaphone size={40} className="opacity-25" />
            <p className="text-sm font-medium">{t.announcements.list.emptyMsg}</p>
            <button
              onClick={() => setShowNew(true)}
              className="text-green text-sm font-semibold hover:underline"
            >
              {t.announcements.list.createFirst}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/70 text-xs text-gray-400 uppercase">
                <tr>
                  <th className="px-5 py-3 text-start font-semibold w-10">#</th>
                  <th className="px-5 py-3 text-start font-semibold">{t.announcements.list.columns.title}</th>
                  <th className="px-5 py-3 text-start font-semibold">{t.announcements.list.columns.audience}</th>
                  <th className="px-5 py-3 text-start font-semibold">{t.announcements.list.columns.priority}</th>
                  <th className="px-5 py-3 text-start font-semibold">{t.announcements.list.columns.status}</th>
                  <th className="px-5 py-3 text-start font-semibold">{t.announcements.list.columns.date}</th>
                  <th className="px-5 py-3 text-center font-semibold w-[1%] whitespace-nowrap">{t.announcements.list.columns.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {list.map((ann, idx) => (
                  <tr key={ann.id} className="hover:bg-gray-50/40 transition-colors">
                    <td className="px-5 py-3.5 text-gray-400 font-medium">{idx + 1}</td>

                    {/* العنوان + النص المختصر */}
                    <td className="px-5 py-3.5 max-w-[200px]">
                      <p className="font-semibold text-dark leading-snug truncate" title={ann.title}>
                        {ann.title.length > 20 ? ann.title.substring(0, 20) + '...' : ann.title}
                      </p>
                      <p className="text-xs text-brown truncate mt-0.5" title={ann.content}>{ann.content}</p>
                    </td>

                    {/* الجمهور */}
                    <td className="px-5 py-3.5">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                        {t.announcements.audiences[(ann.target_audience || ann.audience_type) as keyof typeof t.announcements.audiences] ?? ann.target_audience ?? ann.audience_type}
                      </span>
                    </td>

                    {/* الأولوية */}
                    <td className="px-5 py-3.5 text-xs text-brown font-medium">
                      {(t.announcements.priorities as any)[ann.priority] ?? ann.priority}
                    </td>

                    {/* الحالة */}
                    <td className="px-5 py-3.5">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLE[ann.status]}`}>
                        {t.announcements.statuses[ann.status as keyof typeof t.announcements.statuses]}
                      </span>
                    </td>

                    {/* التاريخ */}
                    <td className="px-5 py-3.5 text-xs text-brown">
                      {formatDate(ann.starts_at)}
                    </td>

                    {/* الإجراءات */}
                    <td className="px-5 py-3.5 w-[1%] whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        {/* نشر فوري — يظهر للمسودة والمجدول */}
                        {((ann as any).author?.id !== 1 || currentUser?.id === 1) && (ann.status?.toLowerCase() === 'scheduled' || ann.status?.toLowerCase() === 'draft') && (
                          <button
                            onClick={() => handlePublish(ann.id)}
                            disabled={publishing === ann.id}
                            title={t.announcements.list.publishNow}
                            className="p-2 text-green hover:bg-green/10 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {publishing === ann.id
                              ? <span className="inline-block w-4 h-4 border-2 border-green border-t-transparent rounded-full animate-spin" />
                              : <Send size={16} />
                            }
                          </button>
                        )}

                        {/* 
                          يمكنه التعديل/الحذف إذا لم يكن المنشئ هو المدير صاحب ال id 1 
                          والحالة ليست active
                        */}
                        {((ann as any).author?.id !== 1 || currentUser?.id === 1) && ann.status?.toLowerCase() !== 'active' && (
                          <>
                            {/* تعديل */}
                            <button
                              onClick={() => { setEditing(ann); setShowNew(false); }}
                              title={t.announcements.list.edit}
                              className="p-2 rounded-xl transition-colors text-[#6B6358] hover:bg-gray-100"
                            >
                              <Edit2 size={16} />
                            </button>
                            {/* حذف */}
                            <button
                              onClick={() => handleDelete(ann)}
                              title={t.announcements.list.delete}
                              className="p-2 rounded-xl transition-colors text-red-500 hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

