import type { BadgeProps, ProgressBarProps, StatCardProps, AlertBannerProps } from "../../types";

const BADGE_VARIANTS: Record<string, string> = {
  default: "bg-gray-100 text-gray-700",
  success: "bg-green-light text-green-dark",
  warning: "bg-beige text-brown",
  pending: "bg-beige text-brown",
  danger: "bg-red-50 text-red-600",
} as const;

const PROGRESS_COLORS: Record<string, string> = {
  green: "bg-green",
  brown: "bg-brown",
} as const;

export function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${BADGE_VARIANTS[variant]}`}
      aria-label={`Status: ${typeof children === "string" ? children : variant}`}
    >
      {children}
    </span>
  );
}

export function ProgressBar({ value, max = 100, color = "green" }: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const barColor = PROGRESS_COLORS[color] ?? PROGRESS_COLORS.green;

  return (
    <div
      className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={`${Math.round(percentage)}% completed`}
    >
      <div
        className={`h-full rounded-full transition-all duration-300 ${barColor}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export function StatCard({ icon: Icon, label, value, valueColor = "text-dark" }: StatCardProps) {
  return (
    <article className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-light flex items-center justify-center" aria-hidden="true">
          <Icon size={20} className="text-green" />
        </div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className={`text-lg font-bold ${valueColor}`}>{value}</p>
        </div>
      </div>
    </article>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export function AlertBanner({ message, onClose }: AlertBannerProps) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 bg-green-light rounded-xl text-green-dark text-sm"
      role="alert"
    >
      <div className="flex items-center gap-2">
        <CheckIcon className="w-4 h-4" />
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-green-dark/60 hover:text-green-dark transition-colors"
          aria-label="Dismiss alert"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

/**
 * Honest empty state for features the backend doesn't support yet (no
 * fabricated data — see CHANGELOG.md "Known gaps"). Used instead of mock
 * data wherever a page references a resource with no matching endpoint.
 */
export function UnavailableNotice({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-6 px-4 rounded-xl bg-gray-50 border border-dashed border-gray-200">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-xs text-gray-400 mt-1 max-w-xs">{message}</p>
    </div>
  );
}

export function QueryErrorNotice({ message }: { message: string }) {
  return (
    <div role="alert" className="px-4 py-3 bg-red-50 text-red-600 rounded-xl text-sm">
      {message}
    </div>
  );
}

export function LoadingSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="animate-pulse space-y-2" aria-label="Loading" role="status">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-3 bg-gray-100 rounded w-full" />
      ))}
    </div>
  );
}
