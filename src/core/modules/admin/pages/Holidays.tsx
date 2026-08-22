import React, { useState } from "react";
import { useLanguage } from "../../../../i18n/translations/LanguageContext";
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  Clock,
  CheckCircle,
  X,
} from "lucide-react";

interface Holiday {
  id: number;
  name: string;
  date: string;
  type: "official" | "company";
  updatedAt: string;
}

const today = new Date();

const todayStr = today.toLocaleDateString("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const initialHolidays: Holiday[] = [
  { id: 1, name: "Nowruzss", date: "Mar 21, 2026", type: "company", updatedAt: "Jul 24, 2026" },
  { id: 2, name: "Evacuation Day", date: "Apr 17, 2026", type: "official", updatedAt: "Jul 23, 2026" },
  { id: 3, name: "Labour Day", date: "May 1, 2026", type: "official", updatedAt: "Jul 23, 2026" },
  { id: 4, name: "عيد جديد", date: "Dec 25, 2026", type: "company", updatedAt: "Jul 24, 2026" },
  { id: 5, name: "National Day", date: "Nov 22, 2026", type: "official", updatedAt: "Jul 23, 2026" },
  { id: 6, name: "New Year", date: "Jan 1, 2026", type: "official", updatedAt: "Jul 22, 2026" },
];

function isUpcoming(dateStr: string) { return new Date(dateStr) > today; }
function isPassed(dateStr: string) { return new Date(dateStr) <= today; }interface ModalProps {
  onClose: () => void;
  onSave: (h: Omit<Holiday, "id" | "updatedAt">) => void;
  initial?: Holiday | null;
}

function HolidayModal({ onClose, onSave, initial }: ModalProps) {
  const { t, lang } = useLanguage();
  const [name, setName] = useState(initial?.name ?? "");
  const [date, setDate] = useState(
    initial ? new Date(initial.date).toISOString().split("T")[0] : ""
  );
  const [type, setType] = useState<"official" | "company">(initial?.type ?? "official");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !date) return;
    const formatted = new Date(date).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
    onSave({ name, date: formatted, type });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" dir={isRtl ? "rtl" : "ltr"}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-gray-900">
            {initial
              ? (t.adminHolidays?.editHoliday || "Edit Holiday")
              : (t.adminHolidays?.addHoliday || "Add Holiday")}
          </h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.adminHolidays?.holidayName || "Holiday Name"}
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green/40 focus:border-green"
              placeholder={t.adminHolidays?.holidayNamePlaceholder || "Enter holiday name"}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.adminHolidays?.date || "Date"}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green/40 focus:border-green"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.adminHolidays?.type || "Type"}
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "official" | "company")}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green/40 focus:border-green bg-white"
            >
              <option value="official">{t.adminHolidays?.official || "Official"}</option>
              <option value="company">{t.adminHolidays?.company || "Company"}</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              {t.adminHolidays?.cancel || "Cancel"}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-green text-white rounded-xl text-sm font-medium hover:bg-green-dark transition-colors"
            >
              {initial ? (t.adminHolidays?.save || "Save") : (t.adminHolidays?.add || "Add")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}export default function Holidays() {
  const { t, lang } = useLanguage();

  const [holidays, setHolidays] = useState<Holiday[]>(initialHolidays);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Holiday | null>(null);

  const total = holidays.length;
  const upcoming = holidays.filter((h) => isUpcoming(h.date)).length;
  const passed = holidays.filter((h) => isPassed(h.date)).length;

  function handleAdd(data: Omit<Holiday, "id" | "updatedAt">) {
    setHolidays((prev) => [...prev, { id: Date.now(), ...data, updatedAt: todayStr }]);
  }

  function handleEdit(data: Omit<Holiday, "id" | "updatedAt">) {
    if (!editing) return;
    setHolidays((prev) =>
      prev.map((h) => (h.id === editing.id ? { ...h, ...data, updatedAt: todayStr } : h))
    );
    setEditing(null);
  }

  function handleDelete(id: number) {
    setHolidays((prev) => prev.filter((h) => h.id !== id));
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir={lang === 'ar' ? 'rtl' : 'ltr'}>      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t.adminHolidays?.title || "Holidays"}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {t.adminHolidays?.subtitle || "Manage company holidays and official days off"}
          </p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-green text-white px-4 py-2.5 rounded-xl hover:bg-green-dark transition-all shadow-[0_4px_14px_rgba(74,124,89,.3)] text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          {t.adminHolidays?.addHoliday || "Add Holiday"}
        </button>
      </div>      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{t.adminHolidays?.totalHolidays || "Total Holidays"}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{total}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-green/10 flex items-center justify-center text-green">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{t.adminHolidays?.upcoming || "Upcoming"}</p>
            <p className="text-3xl font-bold text-green mt-1">{upcoming}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{t.adminHolidays?.passed || "Passed"}</p>
            <p className="text-3xl font-bold text-gray-400 mt-1">{passed}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>
      </div>      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">
            {t.adminHolidays?.allHolidays || "All Holidays"}
          </h3>
          <p className="text-sm text-gray-400 mt-0.5">
            {holidays.length} {t.adminHolidays?.holidaysScheduled || "holidays scheduled"}
          </p>
        </div>

        <div className="divide-y divide-gray-50">
          {holidays.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-400 text-sm">
              {t.adminHolidays?.noHolidaysFound || "No holidays added yet"}
            </div>
          )}
          {holidays.map((holiday) => (
            <div
              key={holiday.id}
              className="px-6 py-5 hover:bg-gray-50/60 transition-colors flex items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-semibold text-gray-900">{holiday.name}</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${holiday.type === "official"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-purple-50 text-purple-600"
                    }`}>
                    {holiday.type === "official"
                      ? (t.adminHolidays?.official || "Official")
                      : (t.adminHolidays?.company || "Company")}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {holiday.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {t.adminHolidays?.updated || "Updated:"} {holiday.updatedAt}
                  </span>
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={() => { setEditing(holiday); setShowModal(true); }}
                  className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                  title={t.adminHolidays?.edit || "Edit"}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(holiday.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title={t.adminHolidays?.delete || "Delete"}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>      {showModal && (
        <HolidayModal
          onClose={() => { setShowModal(false); setEditing(null); }}
          onSave={editing ? handleEdit : handleAdd}
          initial={editing}
        />
      )}
    </div>
  );
}
