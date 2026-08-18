// ==============================================================
// ManagerAnnouncements — واجهة إدارة التعميمات للمدير
// ==============================================================
// الجدول يعرض: # | العنوان | الجمهور المستهدف | الحالة | الإجراءات
// الإجراءات:  تعديل ✏️ / حذف 🗑️ / نشر فوري 📢 (للمجدلة فقط)
// الفورم: مدمج فوق الجدول، يختفي تلقائياً عند الإلغاء
// الجمهور: مخفي للمدير (تلقائي = قسمه)
// ==============================================================

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Send, Loader2, Megaphone, ClipboardList, CalendarDays } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useLanguage } from '../../../i18n/translations/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { getHolidays } from '../../../api/manager';
import { AnnouncementsService } from '../../../api/service/HrService/AnnouncementsService';
import type { Announcement, Priority, AnnouncementStatus } from '../../../api/service/HrService/Types/AnnouncementsService.types';

// ── Helpers ─────────────────────────────────────────────────

const STATUS_STYLE: Record<AnnouncementStatus, string> = {
  draft:     'bg-gray-100    text-gray-500',
  scheduled: 'bg-purple-50   text-purple-600',
  active:    'bg-green-50    text-green-600',
  expired:   'bg-orange-50   text-orange-500',
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
  title:    string;
  content:  string;
  priority: Priority;
  startsAt: string;
  expiresAt: string;
}

function defaultForm(): FormValues {
  return { title: '', content: '', priority: 'medium', startsAt: nowInput(), expiresAt: '' };
}

function annToForm(a: Announcement): FormValues {
  return {
    title:     a.title,
    content:   a.content,
    priority:  a.priority,
    startsAt:  toInput(a.starts_at),
    expiresAt: toInput(a.expires_at),
  };
}

interface AnnouncementFormProps {
  initial?: Announcement;
  onSave:   (f: FormValues) => Promise<void>;
  onCancel: () => void;
}

function AnnouncementForm({ initial, onSave, onCancel }: AnnouncementFormProps) {
  const { t } = useLanguage();
  const [form,   setForm]   = useState<FormValues>(initial ? annToForm(initial) : defaultForm());
  const [saving, setSaving] = useState(false);

  const set = (k: keyof FormValues, v: string) => setForm(p => ({ ...p, [k]: v }));
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

      {/* ملاحظة الجمهور — مخفية للمدير (تلقائي = قسمه) */}
      <p className="text-xs text-green bg-green/5 border border-green/10 rounded-xl px-4 py-2">
        {t.announcements.form.audienceNote}
      </p>

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

  const [list,    setList]    = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [deleting, setDeleting] = useState<Announcement | null>(null);

  // ── data ──
  const fetchAll = async () => {
    setLoading(true);
    try   { 
      const res = await AnnouncementsService.getAll();
      const raw = res.data;
      const arr = Array.isArray(raw) ? raw : Array.isArray((raw as any)?.data) ? (raw as any).data : [];
      setList(arr); 
    }
    catch  { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  // ── handlers ──
  const handleCreate = async (f: FormValues) => {
    const starts  = fromInput(f.startsAt);
    // التحقق من أن تاريخ البدء في المستقبل
    if (new Date(starts) <= new Date()) {
      toast.error('يجب أن يكون تاريخ النشر في المستقبل');
      return;
    }
    const status: AnnouncementStatus = 'scheduled';
    await AnnouncementsService.create({
      title:     f.title,
      content:   f.content,
      priority:  f.priority,
      starts_at: starts,
      expires_at: fromInput(f.expiresAt),
      status,
    });
    toast.success(t.announcements.form.createdSuccess);
    setShowNew(false);
    fetchAll();
  };

  const handleUpdate = async (f: FormValues) => {
    if (!editing) return;
    const starts  = fromInput(f.startsAt);
    const status: AnnouncementStatus = new Date(starts) > new Date() ? 'scheduled' : 'active';
    await AnnouncementsService.update(editing.id, {
      title:     f.title,
      content:   f.content,
      priority:  f.priority,
      starts_at: starts,
      expires_at: fromInput(f.expiresAt),
      status,
    });
    toast.success(t.announcements.form.updatedSuccess);
    setEditing(null);
    fetchAll();
  };

  const handleDelete = async (ann: Announcement) => {
    setDeleting(ann);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    await AnnouncementsService.delete(deleting.id);
    toast.success(t.announcements.deleteConfirm.success);
    setDeleting(null);
    fetchAll();
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

  // ── Holidays Query ──
  const { data: holidays = [], isLoading: holidaysLoading } = useQuery({
    queryKey: ['holidays'],
    queryFn: getHolidays,
    retry: false,
  });

  // ── render ──
  return (
    <div className="space-y-6">
      <Toaster position="top-center" />

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

      {/* ── قسم العطل الرسمية ── */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-card overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-amber-100 bg-amber-50/40">
          <CalendarDays size={18} className="text-amber-600" />
          <span className="font-bold text-dark">{lang === 'ar' ? 'العطل الرسمية' : 'Official Holidays'}</span>
          {!holidaysLoading && (
            <span className="text-xs bg-amber-100 text-amber-700 rounded-full px-2 py-0.5 font-semibold ms-1">
              {holidays.length}
            </span>
          )}
        </div>

        {holidaysLoading ? (
          <div className="flex items-center justify-center py-8 text-gray-400 gap-3">
            <Loader2 size={20} className="animate-spin" />
          </div>
        ) : holidays.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400 gap-2">
            <CalendarDays size={32} className="opacity-20" />
            <p className="text-sm">{lang === 'ar' ? 'لا توجد عطل مسجلة' : 'No holidays found'}</p>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {holidays.map((h: any) => {
              const start = new Date(h.start_date || h.date || h.starts_at || h.from);
              const end   = h.end_date || h.ends_at || h.to ? new Date(h.end_date || h.ends_at || h.to) : null;
              const isUpcoming = start > new Date();
              const isToday = start.toDateString() === new Date().toDateString();
              return (
                <div
                  key={h.id}
                  className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
                    isToday
                      ? 'bg-green/5 border-green/20'
                      : isUpcoming
                        ? 'bg-amber-50/50 border-amber-100'
                        : 'bg-gray-50 border-gray-100 opacity-70'
                  }`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex flex-col items-center justify-center text-center ${
                    isToday ? 'bg-green text-white' : isUpcoming ? 'bg-amber-100 text-amber-700' : 'bg-gray-200 text-gray-500'
                  }`}>
                    <span className="text-[10px] font-bold uppercase leading-none">
                      {start.toLocaleString(lang === 'ar' ? 'ar-SY' : 'en', { month: 'short' })}
                    </span>
                    <span className="text-lg font-extrabold leading-none">{start.getDate()}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-dark text-sm leading-snug">{h.name || h.title || (lang === 'ar' ? 'عطلة رسمية' : 'Holiday')}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {start.toLocaleDateString(lang === 'ar' ? 'ar-SY' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      {end && ` → ${end.toLocaleDateString(lang === 'ar' ? 'ar-SY' : 'en-US', { month: 'short', day: 'numeric' })}`}
                    </p>
                    {isToday && (
                      <span className="inline-block mt-1 text-[10px] bg-green text-white px-2 py-0.5 rounded-full font-bold">
                        {lang === 'ar' ? 'اليوم' : 'Today'}
                      </span>
                    )}
                    {isUpcoming && !isToday && (
                      <span className="inline-block mt-1 text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                        {lang === 'ar' ? 'قادم' : 'Upcoming'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
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
                  <th className="px-5 py-3 text-center font-semibold">{t.announcements.list.columns.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {list.map((ann, idx) => (
                  <tr key={ann.id} className="hover:bg-gray-50/40 transition-colors">
                    <td className="px-5 py-3.5 text-gray-400 font-medium">{idx + 1}</td>

                    {/* العنوان + النص المختصر */}
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-dark leading-snug">{ann.title}</p>
                      <p className="text-xs text-brown truncate max-w-xs mt-0.5">{ann.content}</p>
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
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-1">
                        {/* نشر فوري — يظهر للمجدول فقط */}
                        {ann.status === 'scheduled' && (
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
                        {/* تعديل */}
                        <button
                          onClick={() => { setEditing(ann); setShowNew(false); }}
                          disabled={ann.target_audience === 'all' || ann.audience_type === 'all'}
                          title={ann.target_audience === 'all' || ann.audience_type === 'all' ? t.announcements.list.hrNote : t.announcements.list.edit}
                          className={`p-2 rounded-xl transition-colors ${ann.target_audience === 'all' || ann.audience_type === 'all' ? 'text-gray-300 cursor-not-allowed' : 'text-[#6B6358] hover:bg-gray-100'}`}
                        >
                          <Edit2 size={16} />
                        </button>
                        {/* حذف */}
                        <button
                          onClick={() => handleDelete(ann)}
                          disabled={ann.target_audience === 'all' || ann.audience_type === 'all'}
                          title={ann.target_audience === 'all' || ann.audience_type === 'all' ? t.announcements.list.hrNote : t.announcements.list.delete}
                          className={`p-2 rounded-xl transition-colors ${ann.target_audience === 'all' || ann.audience_type === 'all' ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:bg-red-50'}`}
                        >
                          <Trash2 size={16} />
                        </button>
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
