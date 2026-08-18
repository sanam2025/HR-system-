import { useState } from "react";
import type { FormEvent } from "react";
import { Banknote, Clock3, FileText, Gift, MinusCircle } from "lucide-react";
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
    <article className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-50">
      <header className="flex items-center gap-2 text-gray-500 text-sm mb-4">
        <FileText size={16} aria-hidden="true" />
        <span>Payslips</span>
      </header>
      {isLoading ? (
        <LoadingSkeleton lines={3} />
      ) : errorMessage ? (
        <QueryErrorNotice message={errorMessage} />
      ) : !payslips || payslips.length === 0 ? (
        <p className="text-sm text-gray-400">No payslips available yet.</p>
      ) : (
        <div className="space-y-2">
          {payslips.map((payslip) => (
            <div
              key={payslip.id}
              className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-dark truncate">
                  {String(payslip.period ?? payslip.month ?? `Payslip #${payslip.id}`)}
                </p>
                {"net" in payslip && (
                  <p className="text-xs text-gray-400">Net {money(payslip.net)}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => onDownload(Number(payslip.id))}
                disabled={downloadingId === payslip.id}
                className="flex-shrink-0 text-xs font-medium text-green hover:text-green-dark disabled:opacity-50"
              >
                {downloadingId === payslip.id ? "…" : "Download"}
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
    <article className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-50">
      <header className="flex items-center gap-2 text-gray-500 text-sm mb-4">
        <Banknote size={16} aria-hidden="true" />
        <span>Base Salary</span>
      </header>
      {isLoading ? (
        <LoadingSkeleton lines={2} />
      ) : errorMessage ? (
        <QueryErrorNotice message={errorMessage} />
      ) : !salaries || salaries.length === 0 ? (
        <p className="text-sm text-gray-400">No base salary on file.</p>
      ) : (
        <div className="space-y-2">
          {salaries.map((salary, i) => (
            <div key={salary.id ?? i} className="p-3 rounded-xl bg-gray-50">
              <p className="text-sm font-medium text-dark">Hourly rate: {money(salary.hour_price)}</p>
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
    <article className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-50">
      <header className="flex items-center gap-2 text-gray-500 text-sm mb-4">
        <MinusCircle size={16} aria-hidden="true" />
        <span>Deductions</span>
      </header>
      {isLoading ? (
        <LoadingSkeleton lines={2} />
      ) : errorMessage ? (
        <QueryErrorNotice message={errorMessage} />
      ) : !deductions || deductions.length === 0 ? (
        <p className="text-sm text-gray-400">No deductions on file.</p>
      ) : (
        <div className="space-y-2">
          {deductions.map((deduction) => (
            <div key={deduction.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
              <div className="min-w-0">
                <p className="text-sm font-medium text-dark truncate">{deduction.reason ?? "Deduction"}</p>
                <p className="text-xs text-gray-400">{deduction.date}</p>
              </div>
              <p className="text-sm font-semibold text-red-600 flex-shrink-0">-{money(deduction.amount)}</p>
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
    <article className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-50">
      <header className="flex items-center gap-2 text-gray-500 text-sm mb-4">
        <Gift size={16} aria-hidden="true" />
        <span>Incentives</span>
      </header>
      {isLoading ? (
        <LoadingSkeleton lines={2} />
      ) : errorMessage ? (
        <QueryErrorNotice message={errorMessage} />
      ) : !incentives || incentives.length === 0 ? (
        <p className="text-sm text-gray-400">No incentives on file.</p>
      ) : (
        <div className="space-y-2">
          {incentives.map((incentive) => (
            <div key={incentive.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
              <div className="min-w-0">
                <p className="text-sm font-medium text-dark truncate">{incentive.reason ?? "Incentive"}</p>
                <p className="text-xs text-gray-400">{incentive.date}</p>
              </div>
              <p className="text-sm font-semibold text-green-dark flex-shrink-0">+{money(incentive.amount)}</p>
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
    <article className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-50">
      <header className="flex items-center gap-2 text-gray-500 text-sm mb-4">
        <Clock3 size={16} aria-hidden="true" />
        <span>Overtime</span>
      </header>

      <form onSubmit={handleSubmit} className="space-y-3 mb-4">
        {submitError && (
          <p role="alert" className="text-xs text-red-600">
            {submitError}
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label htmlFor="overtime-date" className="block text-xs text-gray-500 mb-1">
              Date
            </label>
            <input
              id="overtime-date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
            />
          </div>
          <div>
            <label htmlFor="overtime-start" className="block text-xs text-gray-500 mb-1">
              Start
            </label>
            <input
              id="overtime-start"
              type="time"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
            />
          </div>
          <div>
            <label htmlFor="overtime-end" className="block text-xs text-gray-500 mb-1">
              End
            </label>
            <input
              id="overtime-end"
              type="time"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
            />
          </div>
        </div>
        <input
          type="text"
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 bg-green text-white rounded-xl text-sm font-medium hover:bg-green-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting…" : "Request Overtime"}
        </button>
      </form>

      {isLoading ? (
        <LoadingSkeleton lines={2} />
      ) : errorMessage ? (
        <QueryErrorNotice message={errorMessage} />
      ) : !overtimes || overtimes.length === 0 ? (
        <p className="text-sm text-gray-400">No overtime requests yet.</p>
      ) : (
        <div className="space-y-2">
          {overtimes.map((overtime) => (
            <div key={overtime.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
              <div className="min-w-0">
                <p className="text-sm font-medium text-dark truncate">
                  {overtime.date} — {overtime.start_time} to {overtime.end_time}
                </p>
                {overtime.notes && <p className="text-xs text-gray-400 truncate">{overtime.notes}</p>}
              </div>
              {overtime.status && (
                <Badge variant={overtimeStatusVariant(overtime.status)}>{humanizeStatus(overtime.status)}</Badge>
              )}
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
