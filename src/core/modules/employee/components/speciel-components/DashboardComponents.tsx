import { Clock, Calendar, CheckCircle, Circle } from "lucide-react";
import { ProgressBar, Badge } from "../commend-components";
import type { DailyAttendance, LeaveBalance, EmployeeTask, Announcement } from "../../types";

function LeaveProgressSection({
  label,
  daysLeft,
  total,
  color,
}: {
  label: string;
  daysLeft: number;
  total: number;
  color: "green" | "brown";
}) {
  const textColor = color === "brown" ? "text-brown" : "text-green";
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-dark font-medium">{label}</span>
        <span className={`font-semibold ${textColor}`}>{daysLeft} days left</span>
      </div>
      <ProgressBar value={daysLeft} max={total} color={color} />
    </div>
  );
}

export function DailyAttendanceCard({ data }: { data: DailyAttendance }) {
  return (
    <article className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md animate-scale-in">
      <header className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Clock size={16} aria-hidden="true" />
          <span>Daily Attendance</span>
        </div>
        <Badge variant="warning">{data.status}</Badge>
      </header>
      <p className="text-2xl sm:text-3xl font-bold text-dark mb-3 sm:mb-4" aria-live="polite">
        <time>{data.currentTime}</time>
      </p>
      <div className="flex gap-3 w-full">
        <button
          type="button"
          className="flex-1 py-2.5 px-3 bg-green text-white rounded-xl text-sm font-medium whitespace-nowrap hover:bg-green-dark transition-colors active:scale-[0.97] transition-transform duration-100"
          aria-label="Check in for today"
        >
          Check In
        </button>
        <button
          type="button"
          className="flex-1 py-2.5 px-3 bg-beige text-green border border-green rounded-xl text-sm font-medium whitespace-nowrap hover:bg-beige-dark transition-colors active:scale-[0.97] transition-transform duration-100"
          aria-label="Check out for today"
        >
          Check Out
        </button>
      </div>
    </article>
  );
}

export function LeaveBalanceCard({ data }: { data: LeaveBalance }) {
  return (
    <article className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md animate-scale-in">
      <header className="flex items-center gap-2 text-gray-500 text-sm mb-3 sm:mb-4">
        <Calendar size={16} aria-hidden="true" />
        <span>Leave Balance</span>
      </header>
      <div className="space-y-4">
        <LeaveProgressSection
          label="Annual Leave"
          daysLeft={data.annual.daysLeft}
          total={data.annual.total}
          color="green"
        />
        <LeaveProgressSection
          label="Sick Leave"
          daysLeft={data.sick.daysLeft}
          total={data.sick.total}
          color="brown"
        />
        <div className="flex justify-between text-sm pt-1 border-t border-gray-50">
          <span className="text-dark font-medium">Unpaid Leave</span>
          <span className="text-gray-500">{data.unpaid.used} used</span>
        </div>
      </div>
    </article>
  );
}

function TaskItem({ task, index }: { task: EmployeeTask; index: number }) {
  const isCompleted = task.completed;
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl w-full animate-slide-up-stagger ${isCompleted ? "bg-gray-50" : "bg-white"}`}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {isCompleted ? (
        <CheckCircle size={20} className="text-green min-w-5" aria-hidden="true" />
      ) : (
        <Circle size={20} className="text-gray-300 min-w-5" aria-hidden="true" />
      )}
      <div className="flex-1 min-w-0">
        <p className={`text-sm truncate ${isCompleted ? "text-gray-400 line-through" : "text-dark"}`}>
          {task.title}
        </p>
        <p className="text-xs text-gray-400">Due {task.dueDate}</p>
      </div>
      <Badge variant={isCompleted ? "success" : "warning"}>{task.status}</Badge>
    </div>
  );
}

export function RecentTasksCard({ tasks }: { tasks: EmployeeTask[] }) {
  return (
    <article className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-50 w-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <h3 className="text-sm font-semibold text-dark mb-3 sm:mb-4">Recent Tasks</h3>
      <div className="space-y-3">
        {tasks.map((task, i) => (
          <TaskItem key={task.id} task={task} index={i} />
        ))}
      </div>
      <a
        href="#"
        className="block text-center text-sm text-green font-medium mt-3 hover:underline focus:outline-none focus:ring-2 focus:ring-green/30 rounded"
        aria-label="View all tasks"
      >
        View All Tasks
      </a>
    </article>
  );
}

export function AnnouncementsCard({ announcements }: { announcements: Announcement[] }) {
  return (
    <article className="bg-green rounded-2xl p-4 sm:p-5 shadow-sm text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <h3 className="text-sm font-semibold mb-3 sm:mb-4 text-white/90">Announcements</h3>
      <div className="space-y-3">
        {announcements.map((ann) => (
          <div key={ann.id} className="border-b border-white/10 pb-2 last:border-0">
            <p className="text-sm font-medium">{ann.title}</p>
            <p className="text-xs text-white/60">{ann.date}</p>
          </div>
        ))}
      </div>
      <a
        href="#"
        className="block text-center text-sm text-white/80 font-medium mt-3 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30 rounded"
        aria-label="Read all announcements"
      >
        Read all &rarr;
      </a>
    </article>
  );
}
