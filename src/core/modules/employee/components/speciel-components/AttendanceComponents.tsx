import { AlertBanner, Badge } from "../commend-components";
import type { LeaveRequest, AttendanceLogEntry } from "../../types";

const LEAVE_TYPES = ["Annual Leave", "Sick Leave", "Unpaid Leave", "Emergency Leave"] as const;

export function AlertBannerCard({
  message,
  onClose,
}: {
  message: string;
  onClose?: () => void;
}) {
  return <div className="animate-slide-up"><AlertBanner message={message} onClose={onClose} /></div>;
}

export function RequestLeaveCard() {
  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <h3 className="text-sm font-semibold text-dark mb-4">Request Leave</h3>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="leave-type" className="block text-xs text-gray-500 mb-1">
            Leave Type
          </label>
          <select
            id="leave-type"
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-dark bg-white focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
          >
            {LEAVE_TYPES.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="min-w-0">
            <label htmlFor="start-date" className="block text-xs text-gray-500 mb-1">
              Start Date
            </label>
            <input
              id="start-date"
              type="date"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-dark bg-white focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
            />
          </div>
          <div className="min-w-0">
            <label htmlFor="end-date" className="block text-xs text-gray-500 mb-1">
              End Date
            </label>
            <input
              id="end-date"
              type="date"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-dark bg-white focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
            />
          </div>
        </div>
        <div>
          <label htmlFor="reason" className="block text-xs text-gray-500 mb-1">
            Reason (optional)
          </label>
          <textarea
            id="reason"
            rows={3}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-dark bg-white resize-none focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
            placeholder="Enter reason..."
          />
        </div>
        <button
          type="submit"
          className="w-full py-2.5 bg-green text-white rounded-xl text-sm font-medium hover:bg-green-dark transition-colors active:scale-[0.97] transition-transform duration-100"
        >
          Submit Request
        </button>
      </form>
    </section>
  );
}

function PendingRequestCard({ request, index }: { request: LeaveRequest; index: number }) {
  return (
    <div className="p-4 rounded-xl bg-beige animate-slide-up-stagger" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-sm font-medium text-dark truncate">{request.type}</span>
        <Badge variant="pending">Pending</Badge>
      </div>
      <p className="text-xs text-gray-400 mb-2 break-words">
        {request.from} &mdash; {request.to}
      </p>
      <button
        type="button"
        className="text-xs text-red-500 hover:text-red-600 font-medium focus:outline-none focus:ring-2 focus:ring-red-200 rounded"
        aria-label={`Cancel ${request.type} request`}
      >
        Cancel Request
      </button>
    </div>
  );
}

export function PendingRequestsCard({ requests }: { requests: LeaveRequest[] }) {
  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <h3 className="text-sm font-semibold text-dark mb-4">Pending Requests</h3>
      <div className="space-y-3">
        {requests.map((req, i) => (
          <PendingRequestCard key={req.id} request={req} index={i} />
        ))}
      </div>
    </section>
  );
}

export function RecentAttendanceLogCard({ log }: { log: AttendanceLogEntry[] }) {
  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <h3 className="text-sm font-semibold text-dark mb-4">Recent Attendance Log</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th scope="col" className="text-left py-2.5 text-xs text-gray-400 font-medium">Date</th>
              <th scope="col" className="text-left py-2.5 text-xs text-gray-400 font-medium">Check-in</th>
              <th scope="col" className="text-left py-2.5 text-xs text-gray-400 font-medium">Check-out</th>
              <th scope="col" className="text-right py-2.5 text-xs text-gray-400 font-medium">Total Hours</th>
            </tr>
          </thead>
          <tbody>
            {log.map((entry, i) => (
              <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors animate-slide-up-stagger" style={{ animationDelay: `${i * 0.05}s` }}>
                <td className="py-3 text-dark font-medium whitespace-nowrap">{entry.date}</td>
                <td className="py-3 text-gray-600 whitespace-nowrap">{entry.checkIn}</td>
                <td className="py-3 text-gray-600 whitespace-nowrap">{entry.checkOut}</td>
                <td className="py-3 text-green font-semibold text-right whitespace-nowrap">{entry.totalHours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
