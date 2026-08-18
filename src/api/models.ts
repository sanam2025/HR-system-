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

/**
 * CONFIRMED via live backend testing: the response also includes
 * `user_name`, `user_email`, `hiring_date`, `department`, and `manager`
 * (the manager's display name) — none of which were visible from the
 * request payloads alone. `picture` is the raw field name; `profiles.ts`
 * normalizes it onto `picture_url` for every response.
 */
export interface Profile {
  id: ID;
  user_id: ID;
  gender: Gender;
  birth_date: string;
  phone_number: string;
  address: string;
  picture_url: string | null;
  user_name?: string;
  user_email?: string;
  hiring_date?: string;
  department?: string;
  manager?: string | null;
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

/**
 * CONFIRMED via live backend testing: `date` is a full timestamp (see
 * `src/lib/date.ts` for why exact-string "is this today" comparisons don't
 * work), the id field is `user_id` not `employee_id`, and `check_in`/
 * `check_out` are entirely absent from the payload on an absent day rather
 * than present as `null` — treat both as optional.
 */
export interface AttendanceRecord {
  id: ID;
  user_id?: ID;
  employee_id?: ID;
  date: string;
  check_in?: string | null;
  check_out?: string | null;
  status: AttendanceStatus;
  worked_hours?: number | null;
  late_minutes?: number;
  early_leave_minutes?: number;
}

/** `PUT /check-in` and `/check-out` now take the employee's coordinates. */
export interface CheckInOutPayload {
  latitude: string;
  longitude: string;
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
  // Added to the collection's "Store Leave Request" form after the leave
  // request model above was first written — optional so existing callers
  // that don't pass it keep compiling.
  reason?: string;
}

export type UpdateLeaveRequestPayload = Partial<CreateLeaveRequestPayload>;

/**
 * CONFIRMED via live backend testing: `GET /my-leave-balance` returns
 * `{ user_id, user_name, leave_balances: [{ leave_type, total_days,
 * used_days, remaining_days }] }` — not the flat `{ annual, sick, unpaid }`
 * shape that would've been the naive guess from the field names alone.
 */
export interface LeaveBalanceEntry {
  leave_type: LeaveType | string;
  total_days: number | null;
  used_days: number;
  remaining_days: number | null;
}

export interface LeaveBalance {
  user_id: ID;
  user_name?: string;
  leave_balances: LeaveBalanceEntry[];
}

/**
 * CONFIRMED via live backend testing (`GET /tasks`): the real values are
 * lowercase/snake_case (`"pending"`, presumably `"in_progress"` once
 * started, `"submitted"` per the collection's status filter example) — not
 * the `"New"` / `"In Progress"` casing that would've been the naive guess.
 */
export type TaskStatus =
  | "pending"
  | "in_progress"
  | "submitted"
  | "completed"
  | "approved"
  | "rejected"
  | "cancelled"
  | string;

export type TaskPriority = "high" | "medium" | "low" | string;

export interface TaskPerson {
  id: ID;
  name: string;
}

export interface Task {
  id: ID;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  // CONFIRMED live: the response uses `due_date` (snake_case); `dueDate`
  // is kept only as a fallback for any older/camelCase source.
  dueDate?: string;
  due_date?: string;
  assigneeId?: ID;
  assigneeName?: string;
  assignee?: TaskPerson;
  creator?: TaskPerson;
  reviewer?: TaskPerson | null;
  rating?: number | null;
  score?: number | null;
  submitted_at?: string | null;
  reviewed_at?: string | null;
  is_overdue?: boolean;
  createdAt?: string;
  // The "post task m" request in the collection uses `assigned_to` on the
  // *create* payload; the read response uses a nested `assignee` object
  // instead (see above) — kept as an optional fallback.
  assigned_to?: ID;
}

export interface TaskFilterParams {
  status?: string;
  assigned_to?: number;
  user_id?: number;
  [key: string]: string | number | undefined;
}

export interface SubmitTaskPayload {
  notes: string;
  attachment?: File;
}

export const TaskSubmissionStatus = {
  Pending: "pending",
  Approved: "approved",
  Rejected: "rejected",
} as const;
export type TaskSubmissionStatus =
  (typeof TaskSubmissionStatus)[keyof typeof TaskSubmissionStatus];

export interface TaskSubmission {
  id: ID;
  task_id: ID;
  notes?: string;
  attachment_url?: string | null;
  status: TaskSubmissionStatus | string;
  score?: number | null;
  comment?: string | null;
  submitted_at?: string;
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

// ── Payroll: payslips, base salary, deductions, incentives ────────────────
//
// None of these folders have a single saved response example in the
// collection, so — same rationale as the file header — every type below
// pins down only the fields confirmed by a request payload or a path
// parameter and otherwise stays permissive via an index signature. Pages
// must render unknown fields defensively rather than assuming a shape.

export interface Payslip {
  id: ID;
  [key: string]: unknown;
}

export interface BaseSalary {
  id?: ID;
  hour_price?: number;
  [key: string]: unknown;
}

export interface Deduction {
  id: ID;
  user_id?: ID;
  date?: string;
  amount?: number;
  reason?: string;
  [key: string]: unknown;
}

export interface Incentive {
  id: ID;
  user_id?: ID;
  date?: string;
  amount?: number;
  reason?: string;
  [key: string]: unknown;
}

export interface PayslipsSummary {
  [key: string]: unknown;
}

// ── Overtime ────────────────────────────────────────────────────────────

export interface CreateOvertimePayload {
  date: string;
  start_time: string;
  end_time: string;
  notes?: string;
}

export interface Overtime {
  id: ID;
  user_id?: ID;
  date?: string;
  start_time?: string;
  end_time?: string;
  notes?: string;
  status?: string;
  [key: string]: unknown;
}

// ── Complaints ──────────────────────────────────────────────────────────

export interface CreateComplaintPayload {
  subject_id: number;
  title: string;
  description: string;
}

export interface Complaint {
  id: ID;
  subject_id?: ID;
  title: string;
  description: string;
  status?: string;
  created_at?: string;
  [key: string]: unknown;
}

// ── Notifications ───────────────────────────────────────────────────────

/**
 * CONFIRMED via live backend testing: this is Laravel's default database
 * notification shape — the human-readable text lives at `data.message`
 * (each notification type packs its own fields in there), not at a
 * top-level `title`/`message`.
 */
export interface AppNotification {
  id: string;
  type?: string;
  data?: { message?: string; [key: string]: unknown };
  read_at?: string | null;
  created_at?: string;
  [key: string]: unknown;
}

// ── Announcements ───────────────────────────────────────────────────────

export interface Announcement {
  id: ID;
  title: string;
  content: string;
  priority?: string;
  target_audience?: string;
  starts_at?: string;
  expires_at?: string;
  [key: string]: unknown;
}

// ── People directory (for picking a complaint subject, etc.) ─────────────

/**
 * CONFIRMED via live backend testing: `GET /users/employees` and
 * `GET /users/managers` both return this shape for a real employee
 * account. Names aren't unique in this dataset (multiple
 * "employeeMarketing" entries with different emails), so any UI built on
 * this must key/display by more than just `name`.
 */
export interface Colleague {
  id: ID;
  name: string;
  email: string;
  department?: string | null;
  job_title?: string | null;
  status?: string;
  profile_id?: ID | null;
  role: "employee" | "manager";
}

// ── Resignations ────────────────────────────────────────────────────────

/**
 * Only `"immediate"` is CONFIRMED valid (the collection's example payload,
 * verified live). A probe with `"notice"` got
 * `422 "The selected type is invalid."` — so that guess was wrong, and the
 * full valid enum isn't known. Typed as a plain string rather than a
 * fabricated enum so the UI doesn't offer options that don't exist.
 */
export type ResignationType = "immediate" | string;

export interface CreateResignationPayload {
  type: ResignationType;
  reason: string;
}

export interface Resignation {
  id: ID;
  type?: string;
  reason?: string;
  status?: string;
  hr_classification?: string | null;
  hr_classification_notes?: string | null;
  created_at?: string;
  [key: string]: unknown;
}
