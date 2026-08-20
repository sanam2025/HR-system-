import { useState } from "react";
import type { FormEvent } from "react";
import { Banknote, Clock3, FileText, Gift, MinusCircle, Download } from "lucide-react";
import { Badge, LoadingSkeleton, QueryErrorNotice } from "../commend-components";
import { humanizeStatus } from "../../../../../lib/text";
import type {
  BaseSalary,
  CreateOvertimePayload,
  Deduction,
  Incentive,
  Overtime,
  Payslip,
} from "../../../../../api/models";

function money(value: unknown): string {
  return typeof value === "number" ? value.toLocaleString() : String(value ?? "—");
}

function overtimeStatusVariant(status: string): "success" | "warning" | "danger" | "default" {
  const normalized = status.toLowerCase();
  if (normalized === "approved") return "success";
  if (normalized.startsWith("pending")) return "warning";
  if (normalized === "rejected") return "danger";
  return "default";
}

export interface PayslipsCardProps {
  payslips: Payslip[] | undefined;
  isLoading: boolean;
  errorMessage?: string | null;
  onDownload: (id: number) => void;
  downloadingId?: number | null;
}

export function PayslipsCard({ payslips, isLoading, errorMessage, onDownload, downloadingId }: PayslipsCardProps) {
  return (
    <article className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 relative overflow-hidden hover:shadow-md transition-all">
      <div className="absolute top-0 right-0 w-1.5 h-full bg-[#4A7C59]" />
      <header className="flex items-center gap-3 text-[#4A7C59] font-bold text-lg mb-5 pb-3 border-b border-gray-100">
        <div className="p-2 bg-[#4A7C59]/10 rounded-xl">
          <FileText size={22} aria-hidden="true" strokeWidth={2.5} />
        </div>
        <span>Payslips - قسائم الراتب</span>
      </header>
      {isLoading ? (
        <LoadingSkeleton lines={3} />
      ) : errorMessage ? (
        <QueryErrorNotice message={errorMessage} />
      ) : !payslips || payslips.length === 0 ? (
        <div className="text-center py-6">
           <FileText className="mx-auto text-gray-300 mb-2" size={32} />
           <p className="text-sm font-semibold text-gray-400">No payslips available yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {payslips.map((payslip) => (
            <div
              key={payslip.id}
              className="flex items-center justify-between gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">
                  {String(payslip.period ?? payslip.month ?? `Payslip #${payslip.id}`)}
                </p>
                {"net" in payslip && (
                  <p className="text-sm font-black text-[#4A7C59] mt-1">{money(payslip.net)}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => onDownload(Number(payslip.id))}
                disabled={downloadingId === payslip.id}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-[#4A7C59] text-[#4A7C59] rounded-xl text-xs font-bold hover:bg-[#4A7C59]/10 disabled:opacity-50 transition-all shadow-sm"
              >
                <Download size={14} />
                {downloadingId === payslip.id ? "..." : "Download"}
              </button>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

export function BaseSalaryCard({
  salaries,
  isLoading,
  errorMessage,
}: {
  salaries: BaseSalary[] | undefined;
  isLoading: boolean;
  errorMessage?: string | null;
}) {
  return (
    <article className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 relative overflow-hidden hover:shadow-md transition-all">
      <div className="absolute top-0 right-0 w-1.5 h-full bg-[#4A7C59]" />
      <header className="flex items-center gap-3 text-[#4A7C59] font-bold text-lg mb-5 pb-3 border-b border-gray-100">
        <div className="p-2 bg-[#4A7C59]/10 rounded-xl">
          <Banknote size={22} aria-hidden="true" strokeWidth={2.5} />
        </div>
        <span>Base Salary - الراتب الأساسي</span>
      </header>
      {isLoading ? (
        <LoadingSkeleton lines={2} />
      ) : errorMessage ? (
        <QueryErrorNotice message={errorMessage} />
      ) : !salaries || salaries.length === 0 ? (
        <div className="text-center py-6">
           <Banknote className="mx-auto text-gray-300 mb-2" size={32} />
           <p className="text-sm font-semibold text-gray-400">No base salary on file.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {salaries.map((salary, i) => (
            <div key={salary.id ?? i} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <p className="text-sm font-bold text-gray-600">Hourly rate</p>
              <p className="text-lg font-black text-[#4A7C59]">{money(salary.hour_price)}</p>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

export function DeductionsCard({
  deductions,
  isLoading,
  errorMessage,
}: {
  deductions: Deduction[] | undefined;
  isLoading: boolean;
  errorMessage?: string | null;
}) {
  return (
    <article className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 relative overflow-hidden hover:shadow-md transition-all">
      <div className="absolute top-0 right-0 w-1.5 h-full bg-red-500" />
      <header className="flex items-center gap-3 text-red-600 font-bold text-lg mb-5 pb-3 border-b border-gray-100">
        <div className="p-2 bg-red-50 rounded-xl">
          <MinusCircle size={22} aria-hidden="true" strokeWidth={2.5} />
        </div>
        <span>Deductions - الخصومات</span>
      </header>
      {isLoading ? (
        <LoadingSkeleton lines={2} />
      ) : errorMessage ? (
        <QueryErrorNotice message={errorMessage} />
      ) : !deductions || deductions.length === 0 ? (
        <div className="text-center py-6">
           <MinusCircle className="mx-auto text-gray-300 mb-2" size={32} />
           <p className="text-sm font-semibold text-gray-400">No deductions on file.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {deductions.map((deduction) => (
            <div key={deduction.id} className="flex items-center justify-between p-4 rounded-xl border border-red-100 bg-red-50/30 hover:bg-red-50/80 transition-colors">
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">{deduction.reason ?? "Deduction"}</p>
                <p className="text-xs font-semibold text-gray-500 mt-1">{deduction.date}</p>
              </div>
              <p className="text-lg font-black text-red-600 flex-shrink-0">-{money(deduction.amount)}</p>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

export function IncentivesCard({
  incentives,
  isLoading,
  errorMessage,
}: {
  incentives: Incentive[] | undefined;
  isLoading: boolean;
  errorMessage?: string | null;
}) {
  return (
    <article className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 relative overflow-hidden hover:shadow-md transition-all">
      <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-500" />
      <header className="flex items-center gap-3 text-emerald-600 font-bold text-lg mb-5 pb-3 border-b border-gray-100">
        <div className="p-2 bg-emerald-50 rounded-xl">
          <Gift size={22} aria-hidden="true" strokeWidth={2.5} />
        </div>
        <span>Incentives - الحوافز</span>
      </header>
      {isLoading ? (
        <LoadingSkeleton lines={2} />
      ) : errorMessage ? (
        <QueryErrorNotice message={errorMessage} />
      ) : !incentives || incentives.length === 0 ? (
        <div className="text-center py-6">
           <Gift className="mx-auto text-gray-300 mb-2" size={32} />
           <p className="text-sm font-semibold text-gray-400">No incentives on file.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {incentives.map((incentive) => (
            <div key={incentive.id} className="flex items-center justify-between p-4 rounded-xl border border-emerald-100 bg-emerald-50/30 hover:bg-emerald-50/80 transition-colors">
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">{incentive.reason ?? "Incentive"}</p>
                <p className="text-xs font-semibold text-gray-500 mt-1">{incentive.date}</p>
              </div>
              <p className="text-lg font-black text-emerald-600 flex-shrink-0">+{money(incentive.amount)}</p>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

export interface OvertimeCardProps {
  overtimes: Overtime[] | undefined;
  isLoading: boolean;
  errorMessage?: string | null;
  onSubmit: (payload: CreateOvertimePayload) => void;
  isSubmitting: boolean;
  submitError?: string | null;
}

export function OvertimeCard({
  overtimes,
  isLoading,
  errorMessage,
  onSubmit,
  isSubmitting,
  submitError,
}: OvertimeCardProps) {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!date || !startTime || !endTime) return;
    onSubmit({ date, start_time: startTime, end_time: endTime, notes: notes || undefined });
    setDate("");
    setStartTime("");
    setEndTime("");
    setNotes("");
  }

  return (
    <article className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 relative overflow-hidden hover:shadow-md transition-all">
      <div className="absolute top-0 right-0 w-1.5 h-full bg-[#4A7C59]" />
      <header className="flex items-center gap-3 text-[#4A7C59] font-bold text-lg mb-5 pb-3 border-b border-gray-100">
        <div className="p-2 bg-[#4A7C59]/10 rounded-xl">
          <Clock3 size={22} aria-hidden="true" strokeWidth={2.5} />
        </div>
        <span>Overtime - العمل الإضافي</span>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6 bg-gray-50/50 p-4 sm:p-5 rounded-2xl border border-gray-100">
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-bold">
            {submitError}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="overtime-date" className="block text-xs font-bold text-gray-600 mb-1.5">
              Date - التاريخ
            </label>
            <input
              id="overtime-date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-800 focus:outline-none focus:ring-4 focus:ring-[#4A7C59]/10 focus:border-[#4A7C59] transition-all bg-white"
            />
          </div>
          <div>
            <label htmlFor="overtime-start" className="block text-xs font-bold text-gray-600 mb-1.5">
              Start - البداية
            </label>
            <input
              id="overtime-start"
              type="time"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-800 focus:outline-none focus:ring-4 focus:ring-[#4A7C59]/10 focus:border-[#4A7C59] transition-all bg-white"
            />
          </div>
          <div>
            <label htmlFor="overtime-end" className="block text-xs font-bold text-gray-600 mb-1.5">
              End - النهاية
            </label>
            <input
              id="overtime-end"
              type="time"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-800 focus:outline-none focus:ring-4 focus:ring-[#4A7C59]/10 focus:border-[#4A7C59] transition-all bg-white"
            />
          </div>
        </div>
        <div>
           <label htmlFor="overtime-notes" className="block text-xs font-bold text-gray-600 mb-1.5">
              Notes (optional) - ملاحظات (اختياري)
           </label>
           <input
             id="overtime-notes"
             type="text"
             placeholder="Enter notes..."
             value={notes}
             onChange={(e) => setNotes(e.target.value)}
             className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-800 focus:outline-none focus:ring-4 focus:ring-[#4A7C59]/10 focus:border-[#4A7C59] transition-all bg-white"
           />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-[#4A7C59] text-white rounded-xl text-sm font-bold shadow-md hover:bg-opacity-90 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:transform-none"
        >
          <Clock3 size={16} />
          {isSubmitting ? "Submitting... - جاري الإرسال" : "Request Overtime - طلب عمل إضافي"}
        </button>
      </form>

      {isLoading ? (
        <LoadingSkeleton lines={2} />
      ) : errorMessage ? (
        <QueryErrorNotice message={errorMessage} />
      ) : !overtimes || overtimes.length === 0 ? (
        <div className="text-center py-6">
           <Clock3 className="mx-auto text-gray-300 mb-2" size={32} />
           <p className="text-sm font-semibold text-gray-400">No overtime requests yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {overtimes.map((overtime) => (
            <div key={overtime.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">
                  {overtime.date} <span className="mx-2 text-gray-400">|</span> {overtime.start_time} - {overtime.end_time}
                </p>
                {overtime.notes && <p className="text-xs font-semibold text-gray-500 mt-1 truncate">{overtime.notes}</p>}
              </div>
              {overtime.status && (
                <div className="flex-shrink-0 ml-3">
                  <Badge variant={overtimeStatusVariant(overtime.status)}>{humanizeStatus(overtime.status)}</Badge>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
