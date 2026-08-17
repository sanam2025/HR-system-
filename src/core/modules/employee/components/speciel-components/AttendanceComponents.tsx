import { useState } from "react";
import type { FormEvent } from "react";
import { Bell, Calendar, Clock, X } from "lucide-react";
import { Badge, LoadingSkeleton, QueryErrorNotice } from "../commend-components";
import type {
  AttendanceRecord,
  CreateLeaveRequestPayload,
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!startDate || daysCount < 1) return;
    onSubmit({ start_date: startDate, type, days_count: daysCount });
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
                <Badge variant={leaveStatusVariant(request.status)}>{request.status}</Badge>
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
  filter: { from: string; to: string };
  onFilterChange: (filter: { from: string; to: string }) => void;
  onClearFilter: () => void;
  isFiltered: boolean;
}

export function RecentAttendanceLogCard({
  log,
  isLoading,
  errorMessage,
  filter,
  onFilterChange,
  onClearFilter,
  isFiltered,
}: RecentAttendanceLogCardProps) {
  const entries = (log ?? [])
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, isFiltered ? undefined : 10);

  return (
    <article className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-50 h-full">
      <header className="flex items-center gap-2 text-gray-500 text-sm mb-3 sm:mb-4">
        <Clock size={16} aria-hidden="true" />
        <span>{isFiltered ? "Attendance History" : "Recent Attendance"}</span>
      </header>
      <div className="flex flex-wrap items-end gap-2 mb-3 sm:mb-4">
        <div>
          <label htmlFor="attendance-from" className="block text-xs text-gray-500 mb-1">
            From
          </label>
          <input
            id="attendance-from"
            type="date"
            value={filter.from}
            max={filter.to || undefined}
            onChange={(e) => onFilterChange({ ...filter, from: e.target.value })}
            className="px-3 py-1.5 rounded-xl border border-gray-200 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
          />
        </div>
        <div>
          <label htmlFor="attendance-to" className="block text-xs text-gray-500 mb-1">
            To
          </label>
          <input
            id="attendance-to"
            type="date"
            value={filter.to}
            min={filter.from || undefined}
            onChange={(e) => onFilterChange({ ...filter, to: e.target.value })}
            className="px-3 py-1.5 rounded-xl border border-gray-200 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
          />
        </div>
        {isFiltered && (
          <button
            type="button"
            onClick={onClearFilter}
            className="px-3 py-1.5 rounded-xl text-sm text-gray-500 hover:text-dark hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
        )}
      </div>
      {isLoading ? (
        <LoadingSkeleton lines={5} />
      ) : errorMessage ? (
        <QueryErrorNotice message={errorMessage} />
      ) : entries.length === 0 ? (
        <p className="text-sm text-gray-400">
          {isFiltered ? "No attendance records in that range." : "No attendance records yet this month."}
        </p>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0"
            >
              <span className="text-dark font-medium">{entry.date}</span>
              <span className="text-gray-400">
                {entry.check_in ?? "—"} → {entry.check_out ?? "—"}
              </span>
              <Badge variant={entry.status === "present" ? "success" : entry.status === "late" ? "warning" : "default"}>
                {entry.status}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
