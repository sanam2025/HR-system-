import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  CalendarCheck, ClipboardList, Megaphone, DollarSign,
  MessageSquareWarning, CheckCircle2, Clock, AlertCircle,
  ChevronRight, TrendingUp, FileText
} from "lucide-react";
import { useMyMonthlyAttendance, useCheckIn, useCheckOut } from "../../../../api/hooks/useAttendance";
import { useActiveAnnouncements } from "../../../../api/hooks/useAnnouncements";
import { useTasks, useStartTask, useSubmitTask } from "../../../../api/hooks/useTasks";
import { useMyComplaints } from "../../../../api/hooks/useComplaints";
import { useMyPayslips, useMyDeductions } from "../../../../api/hooks/usePayroll";
import { useMyLeaveRequests } from "../../../../api/hooks/useLeaveRequests";
import useAuthStore from "../../../../store/authStore";
import { ApiError } from "../../../../lib/http/ApiError";
import { isSameCalendarDay } from "../../../../lib/date";
import type { AttendanceRecord } from "../../../../api/models";

// ─── small helpers ───────────────────────────────────────────────────────────

function StatusDot({ color }: { color: "green" | "yellow" | "red" | "gray" }) {
  const cls =
    color === "green" ? "bg-green-500" :
    color === "yellow" ? "bg-yellow-400" :
    color === "red" ? "bg-red-500" : "bg-gray-300";
  return <span className={`inline-block w-2.5 h-2.5 rounded-full ${cls}`} />;
}

function SectionCard({
  icon, title, to, children, color,
}: {
  icon: React.ReactNode;
  title: string;
  title: string;
  to?: string;
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <div 
      className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col min-h-[160px] relative overflow-hidden group hover:shadow-md transition-all duration-300"
      style={{ borderTop: color ? `4px solid ${color}` : undefined }}
    >
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50">
        <div 
          className="p-2.5 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105" 
          style={{ backgroundColor: color ? `${color}15` : '#f3f4f6', color: color || '#4b5563' }}
        >
          {icon}
        </div>
        <h2 className="font-bold text-gray-800 text-[15px]">{title}</h2>
      </div>
      <div className="flex-1 px-5 py-4 overflow-y-auto max-h-[280px]">{children}</div>
      {to && (
        <div 
          className="mt-auto px-5 py-3 border-t border-gray-50 flex items-center justify-between text-xs font-semibold group-hover:bg-gray-50/80 transition-colors"
          style={{ color: color || '#6b7280' }}
        >
          <Link to={to} className="absolute inset-0 z-10">
            <span className="sr-only">View {title} details</span>
          </Link>
          <span>View all</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      )}
    </div>
  );
}

function StatRow({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm font-semibold ${color ?? "text-dark"}`}>{value}</span>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="text-sm text-gray-400 py-2">{text}</p>;
}

function ErrorState({ msg }: { msg: string }) {
  return <p className="text-sm text-red-500 flex items-center gap-1.5"><AlertCircle size={14} />{msg}</p>;
}

// ─── Attendance summary ───────────────────────────────────────────────────────
function AttendanceSummary() {
  const monthly = useMyMonthlyAttendance();
  const checkIn = useCheckIn();
  const checkOut = useCheckOut();

  const todayRecord: AttendanceRecord | null | undefined = useMemo(() => {
    if (!monthly.data) return undefined;
    return monthly.data.find((r) => isSameCalendarDay(r.date)) ?? null;
  }, [monthly.data]);

  const checkedIn = Boolean(todayRecord?.check_in);
  const checkedOut = Boolean(todayRecord?.check_out);

  const presentDays = monthly.data?.filter((r) => r.check_in).length ?? 0;
  const absentDays = monthly.data?.filter((r) => !r.check_in).length ?? 0;

  if (monthly.isLoading) return <p className="text-sm text-gray-400 animate-pulse">Loading...</p>;
  if (monthly.isError) return <ErrorState msg={(monthly.error as ApiError).message} />;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <StatusDot color={checkedOut ? "green" : checkedIn ? "yellow" : "gray"} />
        <span className="text-sm font-medium text-dark">
          {checkedOut ? "Checked Out" : checkedIn ? "Checked In" : "Not Checked In Today"}
        </span>
      </div>
      <StatRow label="Present this month" value={presentDays} color="text-green-600" />
      <StatRow label="Absent this month" value={absentDays} color="text-red-500" />
    </div>
  );
}

// ─── Tasks summary ────────────────────────────────────────────────────────────
function TasksSummary() {
  const userId = useAuthStore((s) => s.user?.id);
  const taskQuery = useTasks(userId ? { user_id: userId } : {}, { enabled: Boolean(userId) });
  const startTask = useStartTask();
  const submitTask = useSubmitTask();
  const tasks = taskQuery.data?.items ?? [];

  const pending = tasks.filter((t) => String(t.status).toLowerCase() === "pending").length;
  const inProgress = tasks.filter((t) => String(t.status).toLowerCase() === "in_progress").length;
  const submitted = tasks.filter((t) => String(t.status).toLowerCase() === "submitted").length;
  const completed = tasks.filter((t) => ["completed", "approved"].includes(String(t.status).toLowerCase())).length;

  if (taskQuery.isLoading) return <p className="text-sm text-gray-400 animate-pulse">Loading...</p>;
  if (taskQuery.isError) return <ErrorState msg={(taskQuery.error as ApiError).message} />;
  if (tasks.length === 0) return <EmptyState text="No tasks assigned yet." />;

  return (
    <div className="space-y-1">
      <StatRow label="Pending" value={pending} color="text-yellow-600" />
      <StatRow label="In Progress" value={inProgress} color="text-blue-600" />
      <StatRow label="Submitted" value={submitted} color="text-purple-600" />
      <StatRow label="Completed" value={completed} color="text-green-600" />
      {/* Quick-action: start first pending task */}
      {pending > 0 && (() => {
        const first = tasks.find((t) => String(t.status).toLowerCase() === "pending");
        return first ? (
          <button
            type="button"
            onClick={() => startTask.mutate(first.id)}
            disabled={startTask.isPending}
            className="mt-2 w-full py-2 text-xs font-medium bg-green-500 text-white rounded-xl disabled:opacity-40 hover:bg-green-600 transition-colors"
          >
            {startTask.isPending ? "Starting…" : `▶ Start "${first.title}"`}
          </button>
        ) : null;
      })()}
      {/* Quick-action: submit first in_progress task */}
      {inProgress > 0 && (() => {
        const first = tasks.find((t) => String(t.status).toLowerCase() === "in_progress");
        return first ? (
          <button
            type="button"
            onClick={() => submitTask.mutate({ id: first.id, payload: { notes: "Submitted via dashboard" } })}
            disabled={submitTask.isPending}
            className="mt-1 w-full py-2 text-xs font-medium border border-green-500 text-green-600 rounded-xl disabled:opacity-40 hover:bg-green-50 transition-colors"
          >
            {submitTask.isPending ? "Submitting…" : `📤 Submit "${first.title}"`}
          </button>
        ) : null;
      })()}
    </div>
  );
}

// ─── Announcements summary ────────────────────────────────────────────────────
function AnnouncementsSummary() {
  const q = useActiveAnnouncements();
  if (q.isLoading) return <p className="text-sm text-gray-400 animate-pulse">Loading...</p>;
  if (q.isError) return <ErrorState msg={(q.error as ApiError).message} />;
  if (!q.data || q.data.length === 0) return <EmptyState text="No active announcements." />;

  return (
    <ul className="space-y-2">
      {q.data.map((a) => (
        <li key={a.id} className="rounded-xl bg-gray-50 p-3">
          <p className="text-sm font-medium text-dark truncate">{a.title}</p>
          {a.content && (
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{a.content}</p>
          )}
        </li>
      ))}
    </ul>
  );
}

// ─── Finance summary ──────────────────────────────────────────────────────────
function FinanceSummary() {
  const payslips = useMyPayslips();
  const deductions = useMyDeductions();

  if (payslips.isLoading || deductions.isLoading)
    return <p className="text-sm text-gray-400 animate-pulse">Loading...</p>;

  const latestPayslip = payslips.data?.[0] as (Record<string, unknown> | undefined);
  const totalDeductions = (deductions.data ?? []).reduce(
    (sum, d) => sum + Number((d as Record<string, unknown>).amount ?? 0), 0
  );

  return (
    <div className="space-y-1">
      {latestPayslip ? (
        <>
          <StatRow
            label="Last payslip month"
            value={String((latestPayslip as Record<string, unknown>).month ?? (latestPayslip as Record<string, unknown>).pay_period ?? "—")}
          />
          <StatRow
            label="Net salary"
            value={`${Number((latestPayslip as Record<string, unknown>).net_salary ?? (latestPayslip as Record<string, unknown>).net ?? 0).toLocaleString()} SAR`}
            color="text-green-600"
          />
        </>
      ) : (
        <EmptyState text="No payslip data yet." />
      )}
      <StatRow
        label="Total deductions"
        value={`${totalDeductions.toLocaleString()} SAR`}
        color="text-red-500"
      />
    </div>
  );
}

// ─── Complaints summary ───────────────────────────────────────────────────────
function ComplaintsSummary() {
  const q = useMyComplaints();
  if (q.isLoading) return <p className="text-sm text-gray-400 animate-pulse">Loading...</p>;
  if (q.isError) return <ErrorState msg={(q.error as ApiError).message} />;
  if (!q.data || q.data.length === 0) return <EmptyState text="No complaints submitted yet." />;

  const complaints = q.data as unknown as Array<Record<string, unknown>>;
  const open = complaints.filter((c) =>
    ["open", "pending", "under_review"].includes(String(c.status ?? "").toLowerCase())
  ).length;
  const resolved = complaints.filter((c) =>
    ["resolved", "closed"].includes(String(c.status ?? "").toLowerCase())
  ).length;

  return (
    <div className="space-y-1">
      <StatRow label="Total complaints" value={complaints.length} />
      <StatRow label="Open / Under review" value={open} color="text-yellow-600" />
      <StatRow label="Resolved" value={resolved} color="text-green-600" />
      {complaints.slice(0, 2).map((c) => (
        <div key={String(c.id)} className="mt-2 rounded-xl bg-gray-50 p-3">
          <p className="text-xs font-medium text-dark truncate">{String(c.subject ?? c.title ?? "Complaint")}</p>
          <p className="text-xs text-gray-400 mt-0.5 capitalize">{String(c.status ?? "—")}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Leave summary ────────────────────────────────────────────────────────────
function LeaveSummary() {
  const q = useMyLeaveRequests();
  if (q.isLoading) return <p className="text-sm text-gray-400 animate-pulse">Loading...</p>;
  if (q.isError) return <ErrorState msg={(q.error as ApiError).message} />;

  const leaves = q.data ?? [];
  const pending = leaves.filter((l) => String(l.status).toLowerCase() === "pending").length;
  const approved = leaves.filter((l) => String(l.status).toLowerCase() === "approved").length;
  const rejected = leaves.filter((l) => String(l.status).toLowerCase() === "rejected").length;

  if (leaves.length === 0) return <EmptyState text="No leave requests yet." />;

  return (
    <div className="space-y-1">
      <StatRow label="Pending" value={pending} color="text-yellow-600" />
      <StatRow label="Approved" value={approved} color="text-green-600" />
      <StatRow label="Rejected" value={rejected} color="text-red-500" />
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function EmployeeDashboard() {
  const user = useAuthStore((s) => s.user);

  const greeting = user?.fullName
    ? `Welcome back, ${user.fullName.split(" ")[0]}`
    : "Welcome back";

  const date = new Date().toLocaleDateString(undefined, {
    weekday: "long", month: "long", day: "numeric",
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-dark">{greeting}</h1>
        <span className="text-sm text-gray-400 font-medium">{date}</span>
      </div>

      {/* Grid of summary cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

        {/* Attendance */}
        <SectionCard
          icon={<CalendarCheck size={18} />}
          title="Attendance - الحضور"
          to="/employee/attendance"
          color="#4A7C59"
        >
          <AttendanceSummary />
        </SectionCard>

        {/* Tasks */}
        <SectionCard
          icon={<ClipboardList size={18} />}
          title="Tasks - المهام"
          to="/employee/tasks"
          color="#6B6358"
        >
          <TasksSummary />
        </SectionCard>

        {/* Announcements */}
        <SectionCard
          icon={<Megaphone size={18} />}
          title="Announcements - التعميمات"
          color="#C4A66A"
        >
          <AnnouncementsSummary />
        </SectionCard>

        {/* Leave Requests */}
        <SectionCard
          icon={<FileText size={18} />}
          title="Leave Requests - طلبات الإجازة"
          to="/employee/attendance"
          color="#4A4E4A"
        >
          <LeaveSummary />
        </SectionCard>

        {/* Finance */}
        <SectionCard
          icon={<DollarSign size={18} />}
          title="Finance - المالية"
          to="/employee/finance"
          color="#4A7C59"
        >
          <FinanceSummary />
        </SectionCard>

        {/* Complaints */}
        <SectionCard
          icon={<MessageSquareWarning size={18} />}
          title="Complaints - الشكاوي"
          to="/employee/complaints"
          color="#6B6358"
        >
          <ComplaintsSummary />
        </SectionCard>

      </div>
    </div>
  );
}

