import { useState } from "react";
import type { FormEvent } from "react";
import { Bell, Calendar, Clock, Hourglass, Wallet, X } from "lucide-react";
import { Badge, LoadingSkeleton, QueryErrorNotice } from "../commend-components";
import { humanizeStatus } from "../../../../../lib/text";
import type {
  AttendanceRecord,
  CreateHourlyLeaveRequestPayload,
  CreateLeaveRequestPayload,
  HourlyLeaveRequest,
  LeaveBalance,
  LeaveRequest,
  LeaveType,
} from "../../../../../api/models";

export function AlertBannerCard({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      className="flex items-center gap-2 px-4 py-3 bg-beige rounded-xl text-brown text-sm"
      role="status"
    >
      <Bell size={16} aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}

const LEAVE_TYPE_OPTIONS: { value: LeaveType; label: string }[] = [
  { value: "annual", label: "Annual" },
  { value: "sick", label: "Sick" },
  { value: "unpaid", label: "Unpaid" },
];

export interface RequestLeaveCardProps {
  onSubmit: (payload: CreateLeaveRequestPayload) => void;
  isSubmitting: boolean;
  errorMessage?: string | null;
}

export function RequestLeaveCard({ onSubmit, isSubmitting, errorMessage }: RequestLeaveCardProps) {
  const [startDate, setStartDate] = useState("");
  const [type, setType] = useState<LeaveType>("annual");
  const [daysCount, setDaysCount] = useState(1);
  const [reason, setReason] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!startDate || daysCount < 1) return;
    onSubmit({ start_date: startDate, type, days_count: daysCount, reason: reason || undefined });
  }

  return (
    <article className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-50">
      <header className="flex items-center gap-2 text-gray-500 text-sm mb-3 sm:mb-4">
        <Calendar size={16} aria-hidden="true" />
        <span>Request Leave</span>
      </header>
      <form onSubmit={handleSubmit} className="space-y-3">
        {errorMessage && (
          <p role="alert" className="text-xs text-red-600">
            {errorMessage}
          </p>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="leave-start-date" className="block text-xs text-gray-500 mb-1">
              Start date
            </label>
            <input
              id="leave-start-date"
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
            />
          </div>
          <div>
            <label htmlFor="leave-days" className="block text-xs text-gray-500 mb-1">
              Days
            </label>
            <input
              id="leave-days"
              type="number"
              min={1}
              required
              value={daysCount}
              onChange={(e) => setDaysCount(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
            />
          </div>
        </div>
        <div>
          <label htmlFor="leave-type" className="block text-xs text-gray-500 mb-1">
            Type
          </label>
          <select
            id="leave-type"
            value={type}
            onChange={(e) => setType(e.target.value as LeaveType)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-dark bg-white focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
          >
            {LEAVE_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="leave-reason" className="block text-xs text-gray-500 mb-1">
            Reason (optional)
          </label>
          <input
            id="leave-reason"
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 bg-green text-white rounded-xl text-sm font-medium hover:bg-green-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting…" : "Submit Request"}
        </button>
      </form>
    </article>
  );
}

function leaveStatusVariant(status: LeaveRequest["status"]): "success" | "warning" | "danger" {
  if (status === "approved") return "success";
  if (status === "rejected") return "danger";
  return "warning";
}

export interface PendingRequestsCardProps {
  requests: LeaveRequest[] | undefined;
  isLoading: boolean;
  errorMessage?: string | null;
  onCancel: (id: number) => void;
  cancelingId?: number | null;
}

export function PendingRequestsCard({
  requests,
  isLoading,
  errorMessage,
  onCancel,
  cancelingId,
}: PendingRequestsCardProps) {
  return (
    <article className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-50">
      <h3 className="text-sm font-semibold text-dark mb-3 sm:mb-4">Pending Requests</h3>
      {isLoading ? (
        <LoadingSkeleton />
      ) : errorMessage ? (
        <QueryErrorNotice message={errorMessage} />
      ) : !requests || requests.length === 0 ? (
        <p className="text-sm text-gray-400">No pending leave requests.</p>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-dark capitalize truncate">
                  {request.type} leave — {request.days_count} day{request.days_count === 1 ? "" : "s"}
                </p>
                <p className="text-xs text-gray-400">From {request.start_date}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant={leaveStatusVariant(request.status)}>{humanizeStatus(request.status)}</Badge>
                {request.status === "pending" && (
                  <button
                    type="button"
                    onClick={() => onCancel(request.id)}
                    disabled={cancelingId === request.id}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                    aria-label="Cancel leave request"
                    title="Cancel request"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

export interface RecentAttendanceLogCardProps {
  log: AttendanceRecord[] | undefined;
  isLoading: boolean;
  errorMessage?: string | null;
}

function formatAttendanceDate(dateStr: string): string {
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function RecentAttendanceLogCard({ log, isLoading, errorMessage }: RecentAttendanceLogCardProps) {
  const entries = (log ?? [])
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10);

  return (
    <article className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-50 h-full">
      <header className="flex items-center gap-2 text-gray-500 text-sm mb-3 sm:mb-4">
        <Clock size={16} aria-hidden="true" />
        <span>Recent Attendance</span>
      </header>
      {isLoading ? (
        <LoadingSkeleton lines={5} />
      ) : errorMessage ? (
        <QueryErrorNotice message={errorMessage} />
      ) : entries.length === 0 ? (
        <p className="text-sm text-gray-400">No attendance records yet this month.</p>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0"
            >
              <span className="text-dark font-medium">{formatAttendanceDate(entry.date)}</span>
              <span className="text-gray-400">
                {entry.check_in ?? "—"} → {entry.check_out ?? "—"}
              </span>
              <Badge variant={entry.status === "present" ? "success" : entry.status === "late" ? "warning" : "default"}>
                {humanizeStatus(entry.status)}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

export interface LeaveBalanceCardProps {
  balance: LeaveBalance | undefined;
  isLoading: boolean;
  errorMessage?: string | null;
}

export function LeaveBalanceCard({ balance, isLoading, errorMessage }: LeaveBalanceCardProps) {
  const entries = balance?.leave_balances ?? [];

  return (
    <article className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-50">
      <header className="flex items-center gap-2 text-gray-500 text-sm mb-3 sm:mb-4">
        <Wallet size={16} aria-hidden="true" />
        <span>Leave Balance</span>
      </header>
      {isLoading ? (
        <LoadingSkeleton lines={2} />
      ) : errorMessage ? (
        <QueryErrorNotice message={errorMessage} />
      ) : entries.length === 0 ? (
        <p className="text-sm text-gray-400">No leave balance on file.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {entries.map((entry) => (
            <div key={entry.leave_type} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-gray-500 capitalize">
                {entry.leave_type} leave
              </p>
              <p className="mt-1 text-lg font-semibold text-dark">
                {entry.remaining_days ?? "—"}
                {entry.total_days != null && (
                  <span className="text-sm font-normal text-gray-400"> / {entry.total_days}</span>
                )}
              </p>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

export interface RequestHourlyLeaveCardProps {
  onSubmit: (payload: CreateHourlyLeaveRequestPayload) => void;
  isSubmitting: boolean;
  errorMessage?: string | null;
}

export function RequestHourlyLeaveCard({ onSubmit, isSubmitting, errorMessage }: RequestHourlyLeaveCardProps) {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!date || !startTime || !endTime || !reason) return;
    onSubmit({ date, start_time: startTime, end_time: endTime, reason });
    setDate("");
    setStartTime("");
    setEndTime("");
    setReason("");
  }

  return (
    <article className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-50">
      <header className="flex items-center gap-2 text-gray-500 text-sm mb-3 sm:mb-4">
        <Hourglass size={16} aria-hidden="true" />
        <span>Request Hourly Leave</span>
      </header>
      <form onSubmit={handleSubmit} className="space-y-3">
        {errorMessage && (
          <p role="alert" className="text-xs text-red-600">
            {errorMessage}
          </p>
        )}
        <div>
          <label htmlFor="hourly-leave-date" className="block text-xs text-gray-500 mb-1">
            Date
          </label>
          <input
            id="hourly-leave-date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="hourly-leave-start" className="block text-xs text-gray-500 mb-1">
              Start time
            </label>
            <input
              id="hourly-leave-start"
              type="time"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
            />
          </div>
          <div>
            <label htmlFor="hourly-leave-end" className="block text-xs text-gray-500 mb-1">
              End time
            </label>
            <input
              id="hourly-leave-end"
              type="time"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
            />
          </div>
        </div>
        <div>
          <label htmlFor="hourly-leave-reason" className="block text-xs text-gray-500 mb-1">
            Reason
          </label>
          <input
            id="hourly-leave-reason"
            type="text"
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 bg-green text-white rounded-xl text-sm font-medium hover:bg-green-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting…" : "Submit Request"}
        </button>
      </form>
    </article>
  );
}

export interface PendingHourlyRequestsCardProps {
  requests: HourlyLeaveRequest[] | undefined;
  isLoading: boolean;
  errorMessage?: string | null;
  onCancel: (id: number) => void;
  cancelingId?: number | null;
}

export function PendingHourlyRequestsCard({
  requests,
  isLoading,
  errorMessage,
  onCancel,
  cancelingId,
}: PendingHourlyRequestsCardProps) {
  return (
    <article className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-50">
      <h3 className="text-sm font-semibold text-dark mb-3 sm:mb-4">Hourly Leave Requests</h3>
      {isLoading ? (
        <LoadingSkeleton />
      ) : errorMessage ? (
        <QueryErrorNotice message={errorMessage} />
      ) : !requests || requests.length === 0 ? (
        <p className="text-sm text-gray-400">No hourly leave requests.</p>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-dark truncate">
                  {request.date} — {request.start_time} to {request.end_time}
                </p>
                <p className="text-xs text-gray-400 truncate">{request.reason}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant={leaveStatusVariant(request.status)}>{humanizeStatus(request.status)}</Badge>
                {request.status === "pending" && (
                  <button
                    type="button"
                    onClick={() => onCancel(request.id)}
                    disabled={cancelingId === request.id}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                    aria-label="Cancel hourly leave request"
                    title="Cancel request"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
