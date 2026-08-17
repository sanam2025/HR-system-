/**
 * Domain types inferred from the request payloads, query strings, and path
 * conventions in the Masar-HR Postman collection, scoped to what the
 * employee role actually calls. The collection saves no response examples,
 * so response *shapes* below are the best-supported inference — adjust
 * field names here the moment real API responses are available; every
 * consumer (api modules, hooks, pages) reads through these types only.
 */

export type ID = number;

// ── Onboarding / documents / contracts ────────────────────────────────────

export interface OnboardingUploadPayload {
  id_card: File;
  photo: File;
  bank_info: File;
}

export const OnboardingStatus = {
  NotStarted: "not_started",
  Pending: "pending",
  Approved: "approved",
} as const;
export type OnboardingStatus = (typeof OnboardingStatus)[keyof typeof OnboardingStatus];

export interface OnboardingStatusResponse {
  completed: boolean;
  uploaded_documents: string[];
  missing_documents: string[];
}

export interface EmployeeDocument {
  id: ID;
  employee_id: ID;
  type: "id_card" | "photo" | "bank_info" | "contract" | "other";
  file_name: string;
  uploaded_at: string;
}

export const WeekendDay = {
  Sunday: "sunday",
  Monday: "monday",
  Tuesday: "tuesday",
  Wednesday: "wednesday",
  Thursday: "thursday",
  Friday: "friday",
  Saturday: "saturday",
} as const;
export type WeekendDay = (typeof WeekendDay)[keyof typeof WeekendDay];

export interface Contract {
  id: ID;
  employee_id: ID;
  start_date: string;
  end_date: string | null;
  hour_price: number;
  weekend_days: WeekendDay[];
  working_hour_per_day: number;
  renewable: boolean;
}

// ── Profile ─────────────────────────────────────────────────────────────

export const Gender = { Male: "male", Female: "female" } as const;
export type Gender = (typeof Gender)[keyof typeof Gender];

export interface Profile {
  id: ID;
  user_id: ID;
  gender: Gender;
  birth_date: string;
  phone_number: string;
  address: string;
  picture_url: string | null;
}

export interface CreateProfilePayload {
  gender: Gender;
  birth_date: string;
  phone_number: string;
  address: string;
  picture?: File;
}

export type UpdateProfilePayload = Partial<Omit<CreateProfilePayload, "picture">> & {
  picture?: File;
};

// ── Attendance ─────────────────────────────────────────────────────────────

export const AttendanceStatus = {
  Present: "present",
  Absent: "absent",
  Late: "late",
  OnLeave: "on_leave",
} as const;
export type AttendanceStatus = (typeof AttendanceStatus)[keyof typeof AttendanceStatus];

export interface AttendanceRecord {
  id: ID;
  employee_id: ID;
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: AttendanceStatus;
  worked_hours: number | null;
}

/** Query params for `GET /attendance-filter`, `dep_id` omitted — see endpoints.ts. */
export interface AttendanceFilterParams {
  from: string;
  to: string;
  status?: AttendanceStatus;
}

/** `GET /attendance-percentage` — shape is a guess, no saved example in the collection. */
export interface AttendancePercentage {
  percentage: number;
}

// ── Notifications ──────────────────────────────────────────────────────────

/**
 * The collection's one saved example ID
 * (`c38b971d-2824-4aa7-8055-4abaa87cfe98`) is a UUID, which matches Laravel's
 * default database-notifications table shape (`->notify()` /
 * `Illuminate\Notifications\DatabaseNotification`) rather than an
 * auto-incrementing id — modeled on that default shape since nothing else
 * in the collection documents it.
 */
export interface Notification {
  id: string;
  type: string;
  data: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
}

// ── Leave requests ─────────────────────────────────────────────────────────

export const LeaveType = {
  Annual: "annual",
  Sick: "sick",
  Unpaid: "unpaid",
} as const;
export type LeaveType = (typeof LeaveType)[keyof typeof LeaveType];

export const LeaveRequestStatus = {
  Pending: "pending",
  Approved: "approved",
  Rejected: "rejected",
} as const;
export type LeaveRequestStatus =
  (typeof LeaveRequestStatus)[keyof typeof LeaveRequestStatus];

export interface LeaveRequest {
  id: ID;
  employee_id: ID;
  start_date: string;
  type: LeaveType;
  days_count: number;
  status: LeaveRequestStatus;
  created_at: string;
}

export interface CreateLeaveRequestPayload {
  start_date: string;
  type: LeaveType;
  days_count: number;
}

export type UpdateLeaveRequestPayload = Partial<CreateLeaveRequestPayload>;

/** `GET /my-leave-balance` — field names guessed from the existing `LeaveType` values, no saved example. */
export interface LeaveBalance {
  annual: number;
  sick: number;
  unpaid: number;
}

export type TaskStatus = "New" | "In Progress" | "Completed" | "Late" | string;

export type TaskPriority = "High" | "Medium" | "Low" | string;

export interface Task {
  id: ID;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  dueDate: string;
  assigneeId?: ID;
  assigneeName?: string;
  rating?: number | null;
  createdAt?: string;
}

export interface TaskFilterParams {
  status?: string;
  assigned_to?: number;
  user_id?: number;
  [key: string]: string | number | undefined;
}

/** Body for `POST /tasks/{id}/submit` — multipart, `attachment` optional per the collection's example. */
export interface SubmitTaskPayload {
  notes: string;
  attachment?: File;
}

// ── Hourly leave requests ─────────────────────────────────────────────────

export interface HourlyLeaveRequest {
  id: ID;
  employee_id: ID;
  date: string;
  start_time: string;
  end_time: string;
  reason: string;
  status: LeaveRequestStatus;
}

export interface CreateHourlyLeaveRequestPayload {
  date: string;
  start_time: string;
  end_time: string;
  reason: string;
}

export type UpdateHourlyLeaveRequestPayload = Partial<CreateHourlyLeaveRequestPayload>;

// ── Payroll & money ─────────────────────────────────────────────────────
//
// None of the routes below have a saved response example in the collection
// (same situation the module header describes) — every field is inferred
// from the route's own name and neighboring folders. Treat these as a
// starting sketch to correct against the first real response, not a
// contract.

export interface BaseSalary {
  id: ID;
  amount: number;
  effective_date: string;
}

export interface Deduction {
  id: ID;
  amount: number;
  reason: string;
  date: string;
}

export interface Incentive {
  id: ID;
  amount: number;
  reason: string;
  date: string;
}

/** `GET /payroll/current` — the in-progress or most recently generated payroll run covering this employee. */
export interface CurrentPayroll {
  id: ID;
  period_start: string;
  period_end: string;
  base_amount: number;
  deductions_total: number;
  incentives_total: number;
  net_amount: number;
  status: string;
}

export interface Payslip {
  id: ID;
  period_start: string;
  period_end: string;
  net_amount: number;
  issued_at: string;
}

/** `GET /summary-payslips` — shape is a total guess; nothing in the collection or neighboring routes suggests a structure. */
export interface PayslipsSummary {
  total_net: number;
  count: number;
}

// ── Performance ─────────────────────────────────────────────────────────

export interface Evaluation {
  id: ID;
  period_start: string;
  period_end: string;
  score: number | null;
  status: string;
  comments: string | null;
}

// ── Overtime ────────────────────────────────────────────────────────────
//
// The collection has no saved response example for any overtime route.
// `status` is modeled on `LeaveRequestStatus` (pending/approved/rejected)
// since "Approve"/"Reject" actions exist elsewhere in the collection for
// manager/HR, implying the same three-state workflow.

export interface OvertimeRequest {
  id: ID;
  date: string;
  start_time: string;
  end_time: string;
  notes: string;
  status: LeaveRequestStatus;
}

/** Body for `POST /store-overtime-byemployee` — multipart per the collection's example. */
export interface CreateOvertimePayload {
  date: string;
  start_time: string;
  end_time: string;
  notes?: string;
}

// ── Termination requests ───────────────────────────────────────────────
//
// `type`/`subtype` are free text in the collection's one example
// ("immediate" / "misconduct") with no enum documented anywhere, so both
// are typed as plain strings rather than a guessed-at closed set.

export interface TerminationRequest {
  id: ID;
  type: string;
  termination_date: string;
  subtype: string;
  legal_reason: string;
  status: string;
  created_at?: string;
}

/** Body for `POST /store-termination` — multipart per the collection's example. `user_id` is filled in from the signed-in user, not user-entered. */
export interface CreateTerminationPayload {
  user_id: number;
  type: string;
  termination_date: string;
  subtype: string;
  legal_reason: string;
}

// ── Complaints ──────────────────────────────────────────────────────────
//
// `status` is modeled on the admin-only "mark-under-review" action visible
// elsewhere in the collection, implying at least pending → under_review →
// some resolved state, but the resolved state's exact name is unconfirmed.

export interface Complaint {
  id: ID;
  subject_id: number;
  title: string;
  description: string;
  status: string;
  created_at?: string;
}

/** Body for `POST /complaints`. `subject_id` is the numeric ID of the person the complaint concerns — the collection gives no employee-facing lookup for this, so the form takes it as a raw ID. */
export interface CreateComplaintPayload {
  subject_id: number;
  title: string;
  description: string;
}
