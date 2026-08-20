import React, { useState } from "react";
import type { FormEvent } from "react";
import { Calendar, Clock, Hourglass, Wallet, X, FileText, CalendarCheck, ClipboardList } from "lucide-react";
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
import type { Paginated } from "../../../../../lib/http/client";
import { PaginationControls } from "../../../../../shared/components/ui/PaginationControls";
import { useLanguage } from "../../../../../i18n/translations/LanguageContext";

const LEAVE_TYPE_OPTIONS: { value: LeaveType; label: string }[] = [
  { value: "annual", label: "Annual" },
  { value: "sick", label: "Sick" },
  { value: "unpaid", label: "Unpaid" },
];

function DashboardCard({
  icon,
  title,
  color,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <article
      className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col relative overflow-hidden group hover:shadow-md transition-all duration-300"
      style={{ borderTop: `4px solid ${color}` }}
    >
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50">
        <div
          className="p-2.5 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
          style={{ backgroundColor: `${color}15`, color: color }}
        >
          {icon}
        </div>
        <h2 className="font-bold text-gray-800 text-[15px]">{title}</h2>
      </div>
      <div className="px-5 py-4 flex flex-col">{children}</div>
    </article>
  );
}

export interface RequestLeaveCardProps {
  onSubmit: (payload: CreateLeaveRequestPayload) => void;
  isSubmitting: boolean;
  errorMessage?: string | null;
}

export function RequestLeaveCard({ onSubmit, isSubmitting, errorMessage }: RequestLeaveCardProps) {
  const { t } = useLanguage();
  const [startDate, setStartDate] = useState("");
  const [type, setType] = useState<LeaveType>("annual");
  const [daysCount, setDaysCount] = useState(1);
  const [reason, setReason] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!startDate || daysCount < 1 || reason.trim().length < 5) return;
    onSubmit({ start_date: startDate, type, days_count: daysCount, reason });
    setStartDate("");
    setDaysCount(1);
    setType("annual");
    setReason("");
  }

  return (
    <DashboardCard icon={<FileText size={18} />} title={t.leaves?.myLeaves?.form?.title || "Request Leave - تقديم إجازة"} color="#C4A66A">
      <form onSubmit={handleSubmit} className="space-y-3 flex flex-col">
        {errorMessage && (
          <p role="alert" className="text-xs text-red-600">
            {errorMessage}
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="leave-start-date" className="block text-xs text-gray-500 mb-1">
              {t.leaves?.myLeaves?.form?.startDate || "Start date - تاريخ البدء"}
            </label>
            <input
              id="leave-start-date"
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green text-dark"
            />
          </div>
          <div>
            <label htmlFor="leave-days" className="block text-xs text-gray-500 mb-1">
              {t.leaves?.myLeaves?.form?.daysCount || "Days - عدد الأيام"}
            </label>
            <input
              id="leave-days"
              type="number"
              min={1}
              required
              value={daysCount}
              onChange={(e) => setDaysCount(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green text-dark"
            />
          </div>
        </div>
        <div>
          <label htmlFor="leave-type" className="block text-xs text-gray-500 mb-1">
            {t.leaves?.myLeaves?.form?.type || "Type - نوع الإجازة"}
          </label>
          <select
            id="leave-type"
            value={type}
            onChange={(e) => setType(e.target.value as LeaveType)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green text-dark bg-white"
          >
            {LEAVE_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label htmlFor="leave-reason" className="block text-xs text-gray-500 mb-1">
            {t.leaves?.myLeaves?.form?.reason || "Reason - السبب"}
          </label>
          <input
            id="leave-reason"
            type="text"
            required
            minLength={5}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t.leaves?.myLeaves?.form?.reasonPlaceholder || "Brief reason for leave - سبب الإجازة..."}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green text-dark"
          />
        </div>
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-[#4A7C59] text-white rounded-xl text-sm font-medium hover:bg-opacity-90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t.leaves?.myLeaves?.form?.submitting || "Submitting..." : t.leaves?.myLeaves?.form?.submit || "Submit Request - تقديم الطلب"}
          </button>
        </div>
      </form>
    </DashboardCard>
  );
}

function leaveStatusVariant(status: LeaveRequest["status"]): "success" | "warning" | "danger" {
  if (status === "approved") return "success";
  if (status === "rejected") return "danger";
  return "warning";
}

export interface LeaveRequestsCardProps {
  requests: Paginated<LeaveRequest> | undefined;
  isLoading: boolean;
  errorMessage?: string | null;
  onCancel: (id: number) => void;
  cancelingId?: number | null;
  page?: number;
  onPageChange?: (page: number) => void;
}

export function LeaveRequestsCard({
  requests,
  isLoading,
  errorMessage,
  onCancel,
  cancelingId,
  page,
  onPageChange,
}: LeaveRequestsCardProps) {
  const { t } = useLanguage();
  const items = requests?.items;

  return (
    <DashboardCard icon={<ClipboardList size={18} />} title={t.leaves?.myLeaves?.requestsTitle || "Leave Requests - طلبات الإجازة"} color="#6B6358">
      {isLoading ? (
        <LoadingSkeleton />
      ) : errorMessage ? (
        <QueryErrorNotice message={errorMessage} />
      ) : !items || items.length === 0 ? (
        <p className="text-sm text-gray-400 py-2">{t.leaves?.myLeaves?.noRequests || "No leave requests - لا توجد طلبات إجازة."}</p>
      ) : (
        <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar">
          {items.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100/50"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-dark capitalize truncate">
                  {t.leaves?.types?.[String(request.type).toLowerCase() as keyof typeof t.leaves.types] || request.type} {t.leaves?.title || "Leave"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {request.start_date} • {request.days_count} {t.common?.days || "day(s)"}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant={leaveStatusVariant(request.status)}>
                  {t.leaves?.myLeaves?.status?.[String(request.status).toLowerCase() as keyof typeof t.leaves.myLeaves.status] || humanizeStatus(request.status)}
                </Badge>
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
          {requests && onPageChange && page && (
            <div className="pt-2">
              <PaginationControls
                page={page}
                lastPage={requests.lastPage}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </div>
      )}
    </DashboardCard>
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
  const { t } = useLanguage();
  const entries = (log ?? [])
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10);

  return (
    <DashboardCard icon={<CalendarCheck size={18} />} title={t.attendance?.recentTitle || "Recent Attendance - الحضور الأخير"} color="#4A7C59">
      {isLoading ? (
        <LoadingSkeleton />
      ) : errorMessage ? (
        <QueryErrorNotice message={errorMessage} />
      ) : entries.length === 0 ? (
        <p className="text-sm text-gray-400 py-2">{t.attendance?.noRecentRecords || "No attendance records found - لا توجد سجلات حضور."}</p>
      ) : (
        <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-1">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100/50"
            >
              <div className="flex flex-col min-w-0">
                <Badge variant={entry.status === "present" ? "success" : entry.status === "absent" ? "danger" : entry.status === "late" ? "warning" : "default"}>
                  {t.attendance?.filter?.[String(entry.status).toLowerCase() as keyof typeof t.attendance.filter] || humanizeStatus(entry.status)}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                <span className="text-dark">{formatAttendanceDate(entry.date)}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span className={entry.check_in ? "text-[#4A7C59]" : "text-gray-400"}>
                  {entry.check_in ?? "--:--"}
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span className={entry.check_out ? "text-[#4A7C59]" : "text-gray-400"}>
                  {entry.check_out ?? "--:--"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}

export interface LeaveBalanceCardProps {
  balance: LeaveBalance | undefined;
  isLoading: boolean;
  errorMessage?: string | null;
}

export function LeaveBalanceCard({ balance, isLoading, errorMessage }: LeaveBalanceCardProps) {
  const { t } = useLanguage();
  const entries = balance?.leave_balances ?? [];

  return (
    <div className="mb-4 sm:mb-6">
      <DashboardCard icon={<Wallet size={18} />} title={t.leaves?.myLeaves?.balanceTitle || "Leave Balance - رصيد الإجازات"} color="#4A7C59">
        {isLoading ? (
          <LoadingSkeleton lines={2} />
        ) : errorMessage ? (
          <QueryErrorNotice message={errorMessage} />
        ) : entries.length === 0 ? (
          <p className="text-sm text-gray-400 py-2">{t.leaves?.myLeaves?.noBalances || "No leave balances found - لم يتم العثور على رصيد إجازات."}</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-2">
            {entries.map((b, index) => {
              const total = b.total_days || 0;
              const remaining = b.remaining_days ?? total;
              // Percentage represents how much is remaining (100% = full balance)
              const fraction = total > 0 ? remaining / total : 0;
              const percentage = Math.min(100, Math.max(0, fraction * 100));
              
              return (
                <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-100/50">
                  <p className="text-xs text-gray-400 mb-1 uppercase font-semibold tracking-wider">
                    {t.leaves?.types?.[String(b.leave_type).toLowerCase() as keyof typeof t.leaves.types] || b.leave_type} {t.leaves?.title || "LEAVE"}
                  </p>
                  <div className="flex items-baseline gap-1 mb-3" dir="ltr">
                    <span className="text-2xl font-bold text-gray-800">{remaining}</span>
                    <span className="text-sm text-gray-400">/ {total}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden" dir="ltr">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        percentage <= 10 ? "bg-red-500" : percentage <= 25 ? "bg-yellow-400" : "bg-[#4A7C59]"
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </DashboardCard>
    </div>
  );
}

export interface RequestHourlyLeaveCardProps {
  onSubmit: (payload: CreateHourlyLeaveRequestPayload) => void;
  isSubmitting: boolean;
  errorMessage?: string | null;
}

export function RequestHourlyLeaveCard({
  onSubmit,
  isSubmitting,
  errorMessage,
}: RequestHourlyLeaveCardProps) {
  const { t } = useLanguage();
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError(null);

    if (!date || !startTime || !endTime || reason.trim().length < 5) return;

    if (startTime < "09:00" || startTime > "17:00" || endTime < "09:00" || endTime > "17:00") {
      setLocalError(t.leaves?.myLeaves?.form?.workingHoursError || "Working hours are from 09:00 to 17:00.");
      return;
    }

    if (startTime >= endTime) {
      setLocalError(t.leaves?.myLeaves?.form?.timeOrderError || "Start time must be before end time.");
      return;
    }

    onSubmit({ date, start_time: startTime, end_time: endTime, reason });
    setDate("");
    setStartTime("");
    setEndTime("");
    setReason("");
  }

  const displayError = localError || errorMessage;

  return (
    <DashboardCard icon={<Hourglass size={18} />} title={t.leaves?.myLeaves?.form?.hourlyTitle || "Request Hourly Leave - إجازة ساعية"} color="#C4A66A">
      <form onSubmit={handleSubmit} className="space-y-3 flex flex-col">
        {displayError && (
          <p role="alert" className="text-xs text-red-600 bg-red-50 p-2 rounded-md border border-red-100">
            {displayError}
          </p>
        )}
        <div>
          <label htmlFor="hourly-date" className="block text-xs text-gray-500 mb-1">
            {t.leaves?.myLeaves?.form?.date || "Date - التاريخ"}
          </label>
          <input
            id="hourly-date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green text-dark"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="hourly-start-time" className="block text-xs text-gray-500 mb-1">
              {t.leaves?.myLeaves?.form?.startTime || "Start time - وقت البدء"}
            </label>
            <input
              id="hourly-start-time"
              type="time"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green text-dark"
            />
          </div>
          <div>
            <label htmlFor="hourly-end-time" className="block text-xs text-gray-500 mb-1">
              {t.leaves?.myLeaves?.form?.endTime || "End time - وقت الانتهاء"}
            </label>
            <input
              id="hourly-end-time"
              type="time"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green text-dark"
            />
          </div>
        </div>
        <div className="mb-2">
          <label htmlFor="hourly-reason" className="block text-xs text-gray-500 mb-1">
            {t.leaves?.myLeaves?.form?.reason || "Reason - السبب"}
          </label>
          <input
            id="hourly-reason"
            type="text"
            required
            minLength={5}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t.leaves?.myLeaves?.form?.hourlyReasonPlaceholder || "Brief reason for hourly leave - سبب الإجازة الساعية..."}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green text-dark"
          />
        </div>
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-[#4A7C59] text-white rounded-xl text-sm font-medium hover:bg-opacity-90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t.leaves?.myLeaves?.form?.submitting || "Submitting..." : t.leaves?.myLeaves?.form?.submit || "Submit Request - تقديم الطلب"}
          </button>
        </div>
      </form>
    </DashboardCard>
  );
}

export interface HourlyLeaveRequestsCardProps {
  requests: Paginated<HourlyLeaveRequest> | undefined;
  isLoading: boolean;
  errorMessage?: string | null;
  onCancel: (id: number) => void;
  cancelingId?: number | null;
  page?: number;
  onPageChange?: (page: number) => void;
}

export function HourlyLeaveRequestsCard({
  requests,
  isLoading,
  errorMessage,
  onCancel,
  cancelingId,
  page,
  onPageChange,
}: HourlyLeaveRequestsCardProps) {
  const { t } = useLanguage();
  const items = requests?.items;

  return (
    <DashboardCard icon={<Clock size={18} />} title={t.leaves?.myLeaves?.hourlyRequestsTitle || "Hourly Leave Requests - الإجازات الساعية"} color="#6B6358">
      {isLoading ? (
        <LoadingSkeleton />
      ) : errorMessage ? (
        <QueryErrorNotice message={errorMessage} />
      ) : !items || items.length === 0 ? (
        <p className="text-sm text-gray-400 py-2">{t.leaves?.myLeaves?.noHourlyRequests || "No hourly leave requests - لا توجد طلبات إجازة ساعية."}</p>
      ) : (
        <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar">
          {items.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100/50"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-dark truncate">
                  {request.date}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {request.start_time} - {request.end_time}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant={leaveStatusVariant(request.status)}>
                  {t.leaves?.myLeaves?.status?.[String(request.status).toLowerCase() as keyof typeof t.leaves.myLeaves.status] || humanizeStatus(request.status)}
                </Badge>
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
          {requests && onPageChange && page && (
            <div className="pt-2">
              <PaginationControls
                page={page}
                lastPage={requests.lastPage}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </div>
      )}
    </DashboardCard>
  );
}

export interface MonthlyAttendanceCardProps {
  records: AttendanceRecord[] | undefined;
  isLoading: boolean;
  errorMessage?: string | null;
}

export function MonthlyAttendanceCard({ records, isLoading, errorMessage }: MonthlyAttendanceCardProps) {
  const { t } = useLanguage();
  const entries = (records ?? [])
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="mb-4 sm:mb-6">
      <DashboardCard icon={<CalendarCheck size={18} />} title={t.attendance?.monthlyTitle || "Monthly Attendance - الحضور الشهري"} color="#4A7C59">
        {isLoading ? (
          <LoadingSkeleton lines={3} />
        ) : errorMessage ? (
          <QueryErrorNotice message={errorMessage} />
        ) : entries.length === 0 ? (
          <p className="text-sm text-gray-400 py-2">{t.attendance?.noRecords || "No attendance records yet this month - لا توجد سجلات حضور هذا الشهر."}</p>
        ) : (
          <div className="flex flex-col gap-3 mt-2">
            {entries.map((entry) => (
              <div key={entry.id} className="flex flex-col sm:flex-row justify-between sm:items-center p-3 sm:p-4 rounded-xl border border-gray-100 bg-gray-50/50 gap-3">
                <div className="flex items-center gap-4" dir="ltr">
                  <span className="text-base font-semibold text-gray-800 whitespace-nowrap">
                    {formatAttendanceDate(entry.date)}
                  </span>
                  <Badge variant={entry.status === "present" ? "success" : entry.status === "absent" ? "danger" : entry.status === "late" ? "warning" : "default"}>
                    {t.attendance?.filter?.[String(entry.status).toLowerCase() as keyof typeof t.attendance.filter] || humanizeStatus(entry.status)}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-6" dir="ltr">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 flex items-center gap-1 font-medium">
                      <Clock size={14} /> {t.attendance?.columns?.delay || "Late - تأخير"}:
                    </span>
                    <span className={`text-base font-bold ${entry.late_minutes && entry.late_minutes > 0 ? 'text-red-500' : 'text-gray-800'}`}>
                      {entry.late_minutes ?? 0} <span className="text-sm text-gray-400 font-normal">{t.attendance?.min || "m - د"}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 flex items-center gap-1 font-medium">
                      <Hourglass size={14} /> {t.attendance?.columns?.earlyLeave || "Early Leave - مغادرة مبكرة"}:
                    </span>
                    <span className={`text-base font-bold ${entry.early_leave_minutes && entry.early_leave_minutes > 0 ? 'text-red-500' : 'text-gray-800'}`}>
                      {entry.early_leave_minutes ?? 0} <span className="text-sm text-gray-400 font-normal">{t.attendance?.min || "m - د"}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DashboardCard>
    </div>
  );
}
