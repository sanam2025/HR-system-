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
import { useLanguage } from "../../../../i18n/translations/LanguageContext";
import { ApiError } from "../../../../lib/http/ApiError";
import { isSameCalendarDay } from "../../../../lib/date";
import type { AttendanceRecord } from "../../../../api/models";

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
  const { t, lang } = useLanguage();
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
          <span>{t.common?.viewAll || 'View all'}</span>
          <ChevronRight className="w-4 h-4 transition-transform rtl:-scale-x-100 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
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
function AttendanceSummary() {
  const { t, lang } = useLanguage();
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

  if (monthly.isLoading) return <p className="text-sm text-gray-400 animate-pulse">{t.common?.loading || (lang === 'ar' ? 'جاري التحميل...' : 'Loading...')}</p>;
  if (monthly.isError) return <ErrorState msg={(monthly.error as ApiError).message} />;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <StatusDot color={checkedOut ? "green" : checkedIn ? "yellow" : "gray"} />
        <span className="text-sm font-medium text-dark">
          {checkedOut ? t.common?.checkedOut || "Checked Out" : checkedIn ? t.common?.checkedIn || "Checked In" : t.common?.notCheckedIn || "Not Checked In Today"}
        </span>
      </div>
      <StatRow label={t.dashboard?.presentThisMonth || "Present this month"} value={presentDays} color="text-green-600" />
      <StatRow label={t.dashboard?.absentThisMonth || "Absent this month"} value={absentDays} color="text-red-500" />
    </div>
  );
}
function TasksSummary() {
  const { t, lang } = useLanguage();
  const userId = useAuthStore((s) => s.user?.id);
  const taskQuery = useTasks(userId ? { user_id: userId } : {}, { enabled: Boolean(userId) });
  const startTask = useStartTask();
  const submitTask = useSubmitTask();
  const tasks = taskQuery.data?.items ?? [];

  const pending = tasks.filter((t) => String(t.status).toLowerCase() === "pending").length;
  const inProgress = tasks.filter((t) => String(t.status).toLowerCase() === "in_progress").length;
  const submitted = tasks.filter((t) => String(t.status).toLowerCase() === "submitted").length;
  const completed = tasks.filter((t) => ["completed", "approved"].includes(String(t.status).toLowerCase())).length;

  if (taskQuery.isLoading) return <p className="text-sm text-gray-400 animate-pulse">{t.common?.loading || (lang === 'ar' ? 'جاري التحميل...' : 'Loading...')}</p>;
  if (taskQuery.isError) return <ErrorState msg={(taskQuery.error as ApiError).message} />;
  if (tasks.length === 0) return <EmptyState text={t.tasks?.noTasks || "No tasks assigned yet."} />;

  return (
    <div className="space-y-1">
      <StatRow label={t.tasks?.columns?.pending || "Pending"} value={pending} color="text-yellow-600" />
      <StatRow label={t.tasks?.columns?.inProgress || "In Progress"} value={inProgress} color="text-blue-600" />
      <StatRow label={t.tasks?.columns?.submitted || "Submitted"} value={submitted} color="text-purple-600" />
      <StatRow label={t.tasks?.columns?.completed || "Completed"} value={completed} color="text-green-600" />
    </div>
  );
}
function AnnouncementsSummary() {
  const { t, lang } = useLanguage();
  const q = useActiveAnnouncements();
  if (q.isLoading) return <p className="text-sm text-gray-400 animate-pulse">{t.common?.loading || (lang === 'ar' ? 'جاري التحميل...' : 'Loading...')}</p>;
  if (q.isError) return <ErrorState msg={(q.error as ApiError).message} />;
  if (!q.data || q.data.length === 0) return <EmptyState text={t.announcements?.list?.emptyMsg || "No active announcements."} />;

  return (
    <ul className="space-y-2">
      {q.data.map((a) => (
        <li key={a.id} className="rounded-xl bg-gray-50 p-3">
          <p className="text-sm font-medium text-dark break-words whitespace-normal">{a.title}</p>
          {a.content && (
            <p className="text-xs text-gray-500 mt-0.5 break-words whitespace-normal">{a.content}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
function FinanceSummary() {
  const { t, lang } = useLanguage();
  const payslips = useMyPayslips();
  const deductions = useMyDeductions();

  if (payslips.isLoading || deductions.isLoading)
    return <p className="text-sm text-gray-400 animate-pulse">{t.common?.loading || (lang === 'ar' ? 'جاري التحميل...' : 'Loading...')}</p>;

  const latestPayslip = payslips.data?.items?.[0] as (Record<string, unknown> | undefined);
  const totalDeductions = (deductions.data?.items ?? []).reduce(
    (sum, d) => sum + Number((d as Record<string, unknown>).amount ?? 0), 0
  );

  return (
    <div className="space-y-1">
      {latestPayslip ? (
        <>
          <StatRow
            label={t.finance?.lastPayslip || "Last payslip month"}
            value={String((latestPayslip as Record<string, unknown>).month ?? (latestPayslip as Record<string, unknown>).pay_period ?? "—")}
          />
          <StatRow
            label={t.finance?.netSalary || "Net salary"}
            value={`${Number((latestPayslip as Record<string, unknown>).net_salary ?? (latestPayslip as Record<string, unknown>).net ?? 0).toLocaleString()} SAR`}
            color="text-green-600"
          />
        </>
      ) : (
        <EmptyState text={t.finance?.noPayslips || "No payslip data yet."} />
      )}
      <StatRow
        label={t.finance?.totalDeductions || "Total deductions"}
        value={`${totalDeductions.toLocaleString()} SAR`}
        color="text-red-500"
      />
    </div>
  );
}
function ComplaintsSummary() {
  const { t, lang } = useLanguage();
  const q = useMyComplaints();
  if (q.isLoading) return <p className="text-sm text-gray-400 animate-pulse">{t.common?.loading || (lang === 'ar' ? 'جاري التحميل...' : 'Loading...')}</p>;
  if (q.isError) return <ErrorState msg={(q.error as ApiError).message} />;
  if (!q.data || q.data.length === 0) return <EmptyState text={t.complaints?.emptyMsg || "No complaints submitted yet."} />;

  const complaints = q.data as unknown as Array<Record<string, unknown>>;
  const open = complaints.filter((c) =>
    ["open", "pending", "under_review"].includes(String(c.status ?? "").toLowerCase())
  ).length;
  const resolved = complaints.filter((c) =>
    ["resolved", "closed"].includes(String(c.status ?? "").toLowerCase())
  ).length;

  return (
    <div className="space-y-1">
      <StatRow label={t.complaints?.total || "Total complaints"} value={complaints.length} />
      <StatRow label={t.complaints?.open || "Open / Under review"} value={open} color="text-yellow-600" />
      <StatRow label={t.complaints?.resolved || "Resolved"} value={resolved} color="text-green-600" />
      {complaints.slice(0, 2).map((c) => (
        <div key={String(c.id)} className="mt-2 rounded-xl bg-gray-50 p-3">
          <p className="text-xs font-medium text-dark truncate">{String(c.subject ?? c.title ?? "Complaint")}</p>
          <p className="text-xs text-gray-400 mt-0.5 capitalize">{String(c.status ?? "—")}</p>
        </div>
      ))}
    </div>
  );
}
function LeaveSummary() {
  const { t, lang } = useLanguage();
  const q = useMyLeaveRequests();
  if (q.isLoading) return <p className="text-sm text-gray-400 animate-pulse">{t.common?.loading || (lang === 'ar' ? 'جاري التحميل...' : 'Loading...')}</p>;
  if (q.isError) return <ErrorState msg={(q.error as ApiError).message} />;

  const leaves = q.data?.items ?? [];
  const pending = leaves.filter((l) => String(l.status).toLowerCase() === "pending").length;
  const approved = leaves.filter((l) => String(l.status).toLowerCase() === "approved").length;
  const rejected = leaves.filter((l) => String(l.status).toLowerCase() === "rejected").length;

  if (leaves.length === 0) return <EmptyState text={t.leaves?.noRequests || "No leave requests yet."} />;

  return (
    <div className="space-y-1">
      <StatRow label={t.leaves?.status?.pending || "Pending"} value={pending} color="text-yellow-600" />
      <StatRow label={t.leaves?.status?.approved || "Approved"} value={approved} color="text-green-600" />
      <StatRow label={t.leaves?.status?.rejected || "Rejected"} value={rejected} color="text-red-500" />
    </div>
  );
}
export default function EmployeeDashboard() {
  const { t, lang } = useLanguage();
  const user = useAuthStore((s) => s.user);

  const greeting = user?.fullName
    ? (t.dashboard?.welcomeBackName || `Welcome back, {{name}}`).replace('{{name}}', user.fullName.split(" ")[0])
    : (t.dashboard?.welcomeBack || `Welcome back`);

  const date = new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
    weekday: "long", month: "long", day: "numeric",
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-dark">{greeting}</h1>
        <span className="text-sm text-gray-400 font-medium">{date}</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <SectionCard
          icon={<CalendarCheck size={18} />}
          title={t.nav?.attendance || "Attendance"}
          to="/employee/attendance"
          color="#4A7C59"
        >
          <AttendanceSummary />
        </SectionCard>
        <SectionCard
          icon={<ClipboardList size={18} />}
          title={t.nav?.tasks || "Tasks"}
          to="/employee/tasks"
          color="#6B6358"
        >
          <TasksSummary />
        </SectionCard>
        <SectionCard
          icon={<Megaphone size={18} />}
          title={t.nav?.announcements || "Announcements"}
          color="#C4A66A"
        >
          <AnnouncementsSummary />
        </SectionCard>
        <SectionCard
          icon={<FileText size={18} />}
          title={t.nav?.leaves || "Leave Requests"}
          to="/employee/attendance"
          color="#4A4E4A"
        >
          <LeaveSummary />
        </SectionCard>
        <SectionCard
          icon={<DollarSign size={18} />}
          title={t.dashboard?.finance || "Finance"}
          to="/employee/finance"
          color="#4A7C59"
        >
          <FinanceSummary />
        </SectionCard>
        <SectionCard
          icon={<MessageSquareWarning size={18} />}
          title={t.dashboard?.complaints || "Complaints"}
          to="/employee/complaints"
          color="#6B6358"
        >
          <ComplaintsSummary />
        </SectionCard>

      </div>
    </div>
  );
}

