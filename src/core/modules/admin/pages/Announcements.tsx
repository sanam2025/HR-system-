// core/modules/Admin/pages/Announcements.tsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Megaphone, Plus, Edit, Trash2, Clock,
  Users, Calendar, AlertCircle, X, Loader2
} from "lucide-react";
import { AnnouncementsService } from "@/api/service/HrService/AnnouncementsService";
import type {
  Announcement,
  CreateAnnouncementData,
} from "@/api/service/HrService/Types/AnnouncementsService.types";

// ─── helpers ─────────────────────────────────────────────────────────────────
function fmtDate(d?: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

const AUDIENCE_LABELS: Record<string, string> = {
  all: "All Employees",
  employees: "Employees",
  managers: "Managers",
  hr: "HR Department",
};

// ─── Modal ────────────────────────────────────────────────────────────────────
interface ModalProps {
  onClose: () => void;
  onSave: (d: CreateAnnouncementData) => Promise<void>;
  initial?: Announcement | null;
  saving: boolean;
}

function AnnouncementModal({ onClose, onSave, initial, saving }: ModalProps) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const [title, setTitle]       = useState(initial?.title ?? "");
  const [content, setContent]   = useState(initial?.content ?? "");
  const [audience, setAudience] = useState<CreateAnnouncementData["audience"]>(initial?.audience ?? "all");
  const [status, setStatus]     = useState<CreateAnnouncementData["status"]>(
    (initial?.status === "expired" ? "active" : initial?.status) ?? "active"
  );
  const [startsAt, setStartsAt] = useState(initial?.starts_at?.split("T")[0] ?? "");
  const [endsAt, setEndsAt]     = useState(initial?.ends_at?.split("T")[0] ?? "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !content || !startsAt) return;
    await onSave({ title, content, audience, status, starts_at: startsAt, ends_at: endsAt || undefined });
  }

  const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green/40 focus:border-green bg-white";

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6" dir={isRtl ? "rtl" : "ltr"}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-gray-900">
            {initial ? (isRtl ? "تعديل التعميم" : "Edit Announcement") : (isRtl ? "تعميم جديد" : "New Announcement")}
          </h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{isRtl ? "العنوان" : "Title"}</label>
            <input value={title} onChange={e => setTitle(e.target.value)} required className={inputCls}
              placeholder={isRtl ? "عنوان التعميم" : "Announcement title"} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{isRtl ? "المحتوى" : "Content"}</label>
            <textarea value={content} onChange={e => setContent(e.target.value)} required rows={3}
              className={inputCls + " resize-none"}
              placeholder={isRtl ? "محتوى التعميم" : "Announcement content"} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{isRtl ? "الجمهور" : "Audience"}</label>
              <select value={audience} onChange={e => setAudience(e.target.value as any)} className={inputCls}>
                <option value="all">{isRtl ? "الكل" : "All Employees"}</option>
                <option value="employees">{isRtl ? "الموظفون" : "Employees"}</option>
                <option value="managers">{isRtl ? "المدراء" : "Managers"}</option>
                <option value="hr">{isRtl ? "HR" : "HR Department"}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{isRtl ? "الحالة" : "Status"}</label>
              <select value={status} onChange={e => setStatus(e.target.value as any)} className={inputCls}>
                <option value="active">{isRtl ? "نشط" : "Active"}</option>
                <option value="draft">{isRtl ? "مسودة" : "Draft"}</option>
                <option value="scheduled">{isRtl ? "مجدول" : "Scheduled"}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{isRtl ? "تاريخ البدء" : "Start Date"}</label>
              <input type="date" value={startsAt} onChange={e => setStartsAt(e.target.value)} required className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{isRtl ? "تاريخ الانتهاء (اختياري)" : "End Date (optional)"}</label>
              <input type="date" value={endsAt} onChange={e => setEndsAt(e.target.value)} className={inputCls} />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
              {isRtl ? "إلغاء" : "Cancel"}
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 px-4 py-2.5 bg-green text-white rounded-xl text-sm font-medium hover:bg-green-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {initial ? (isRtl ? "حفظ" : "Save") : (isRtl ? "إنشاء" : "Create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Announcements() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const [items, setItems]         = useState<Announcement[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [saving, setSaving]       = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]     = useState<Announcement | null>(null);

  // ── Fetch ──
  async function fetchAll() {
    try {
      setLoading(true);
      setError(null);
      const res = await AnnouncementsService.getAll();
      setItems(res.data?.data ?? []);
    } catch {
      setError(isRtl ? "تعذّر تحميل التعميمات" : "Failed to load announcements");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAll(); }, []);

  // ── Create ──
  async function handleAdd(data: CreateAnnouncementData) {
    setSaving(true);
    try {
      await AnnouncementsService.create(data);
      await fetchAll();
      setShowModal(false);
    } catch {
      alert(isRtl ? "فشل الإنشاء" : "Failed to create announcement");
    } finally { setSaving(false); }
  }

  // ── Update ──
  async function handleEdit(data: CreateAnnouncementData) {
    if (!editing) return;
    setSaving(true);
    try {
      await AnnouncementsService.update(editing.id, data);
      await fetchAll();
      setShowModal(false);
      setEditing(null);
    } catch {
      alert(isRtl ? "فشل التعديل" : "Failed to update announcement");
    } finally { setSaving(false); }
  }

  // ── Delete ──
  async function handleDelete(id: number) {
    if (!confirm(isRtl ? "هل تريد حذف هذا التعميم؟" : "Delete this announcement?")) return;
    try {
      await AnnouncementsService.delete(id);
      setItems(prev => prev.filter(a => a.id !== id));
    } catch {
      alert(isRtl ? "فشل الحذف" : "Failed to delete announcement");
    }
  }

  // ── Stats ──
  const total   = items.length;
  const active  = items.filter(a => a.status === "active").length;
  const expired = items.filter(a => a.status === "expired").length;
  const draft   = items.filter(a => a.status === "draft").length;

  // ── Status badge ──
  function statusBadge(status: string) {
    const map: Record<string, string> = {
      active:    "bg-emerald-50 text-emerald-600",
      scheduled: "bg-yellow-50 text-yellow-600",
      draft:     "bg-gray-100 text-gray-500",
      expired:   "bg-gray-50 text-gray-400",
    };
    const labels: Record<string, string> = {
      active:    isRtl ? "نشط" : "Active",
      scheduled: isRtl ? "مجدول" : "Scheduled",
      draft:     isRtl ? "مسودة" : "Draft",
      expired:   isRtl ? "منتهي" : "Expired",
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[status] ?? "bg-gray-100 text-gray-500"}`}>
        {labels[status] ?? status}
      </span>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir={isRtl ? "rtl" : "ltr"}>
      {/* ── Header ── */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("announcements")}</h1>
          <p className="text-gray-500 mt-1 text-sm">{t("manageAnnouncements")}</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowModal(true); }}
          className="bg-green text-white px-4 py-2.5 rounded-xl hover:bg-green-dark transition-all flex items-center gap-2 text-sm font-semibold shadow-[0_4px_14px_rgba(74,124,89,.3)]"
        >
          <Plus className="w-4 h-4" />
          {t("newAnnouncement")}
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        {[
          { label: t("total"),       value: total,   color: "text-gray-900",    bg: "bg-blue-50 text-blue-600",    icon: <Megaphone className="w-5 h-5" /> },
          { label: t("active"),      value: active,  color: "text-emerald-600", bg: "bg-emerald-50 text-emerald-600", icon: <AlertCircle className="w-5 h-5" /> },
          { label: t("expired"),     value: expired, color: "text-gray-400",    bg: "bg-gray-50 text-gray-400",    icon: <Clock className="w-5 h-5" /> },
          { label: isRtl ? "مسودة" : "Draft", value: draft, color: "text-yellow-600", bg: "bg-yellow-50 text-yellow-600", icon: <AlertCircle className="w-5 h-5" /> },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className={`text-2xl font-bold mt-0.5 ${s.color}`}>{s.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${s.bg}`}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── List ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">{t("allAnnouncements")}</h3>
          <p className="text-sm text-gray-400 mt-0.5">{items.length} {isRtl ? "تعميم" : "announcements"}</p>
        </div>

        <div className="divide-y divide-gray-50">
          {loading && (
            <div className="px-6 py-12 flex items-center justify-center gap-2 text-gray-400 text-sm">
              <Loader2 className="w-5 h-5 animate-spin" />
              {isRtl ? "جارٍ التحميل..." : "Loading..."}
            </div>
          )}
          {!loading && error && (
            <div className="px-6 py-12 text-center text-red-500 text-sm">
              {error}
              <button onClick={fetchAll} className="block mx-auto mt-2 text-green underline text-xs">
                {isRtl ? "إعادة المحاولة" : "Retry"}
              </button>
            </div>
          )}
          {!loading && !error && items.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-400 text-sm">
              {isRtl ? "لا توجد تعميمات بعد" : "No announcements yet"}
            </div>
          )}
          {!loading && !error && items.map(ann => (
            <div key={ann.id} className="px-6 py-5 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <h4 className="font-semibold text-gray-900">{ann.title}</h4>
                    {statusBadge(ann.status)}
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{ann.content}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {fmtDate(ann.starts_at)}
                      {ann.ends_at && ` → ${fmtDate(ann.ends_at)}`}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {AUDIENCE_LABELS[ann.audience] ?? ann.audience}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => { setEditing(ann); setShowModal(true); }}
                    className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                    title={isRtl ? "تعديل" : "Edit"}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(ann.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title={isRtl ? "حذف" : "Delete"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <AnnouncementModal
          onClose={() => { setShowModal(false); setEditing(null); }}
          onSave={editing ? handleEdit : handleAdd}
          initial={editing}
          saving={saving}
        />
      )}
    </div>
  );
}
