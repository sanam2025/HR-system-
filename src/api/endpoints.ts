/**
 * Single source of truth for every API path this frontend calls. Scope is
 * intentionally limited to the employee-role workflows (auth, own profile,
 * onboarding, own documents/contract, own attendance, own leave requests) —
 * see CHANGELOG.md for the manager/HR/admin endpoints that exist in the
 * Postman collection but are explicitly out of scope for this pass.
 *
 * Paths are transcribed directly from the Masar-HR Postman collection.
 * Centralizing them here means a backend rename only has to be fixed in one
 * place, and the inconsistencies the backend currently ships with (mixed
 * casing, mixed camelCase/kebab-case) are visible and commented right where
 * they're used instead of being silently "fixed" and forgotten.
 */
export const endpoints = {
  auth: {
    login: "login",
    logout: "logout",
    // NOTE: named "putPassword" in the collection but is a GET with no
    // password field — see CHANGELOG.md ("auth/putPassword does nothing").
    user: "user",
    changePassword: "change-password",
  },

  onboarding: {
    upload: "onboarding/upload",
    // CONFIRMED via scripts/probe_api.py against the live deployment: this
    // route exists (returns 401 Unauthenticated, not 404) despite the
    // Postman collection request for it ("onboarding status e") having no
    // URL at all. Response shape is still unknown — no valid test
    // credentials have gotten past login yet. See CHANGELOG.md.
    status: "onboarding/status",
  },

  documents: {
    myContract: "my/contract",
    // CONFIRMED via live backend testing: this route exists but currently
    // returns a real server error payload: {"success": false, "message": "Model Not Found"}.
    // That indicates a backend model/data relationship bug rather than a missing route.
    downloadMyContract: "my-contract/download",
    // CONFIRMED via scripts/probe_api.py: returns 404 Route Not Found on
    // the live deployment — this route genuinely does not exist. See
    // CHANGELOG.md.
    myDocuments: "my-documents",
    downloadDocument: (id: number | string) => `my-documents/${id}/download`,
  },

  profiles: {
    create: "profiles",
    show: (id: number | string) => `profiles/${id}`,
    update: (id: number | string) => `profiles/${id}`,
    mine: "profiles",
  },

  attendance: {
    checkIn: "check-in",
    checkOut: "check-out",
    // CONFIRMED via live backend testing: this route exists but currently
    // fails with a 500 error due to an invalid ORDER BY clause on `check_in`.
    myMonthly: "my-monthly-attendance",
    // Collection-only, newly wired up. The collection's saved example also
    // has `status` and `dep_id` query params (both disabled/commented out
    // there) — `dep_id` is a manager/HR department filter and out of scope
    // for the employee role, so only `from`/`to`/`status` are exposed here.
    // Unclear from the collection alone whether this is already scoped to
    // "my" attendance server-side or returns company-wide records for any
    // authenticated user — flag this if the real response turns out to
    // include other employees' rows.
    filtered: "attendance-filter",
    // Collection-only, newly wired up. Shape entirely unknown — no saved
    // example.
    percentage: "attendance-percentage",
  },

  leaveRequests: {
    // NOTE: camelCase (`leaveRequests`) while every sibling collection in
    // this API is kebab-case — see CHANGELOG.md ("Inconsistent route
    // casing").
    create: "leaveRequests",
    list: "leaveRequests",
    show: (id: number | string) => `leaveRequests/${id}`,
    update: (id: number | string) => `leaveRequests/${id}`,
    remove: (id: number | string) => `leaveRequests/${id}`,
    mine: "my-leave-request",
    // The CHANGELOG note this superseded ("No self-service leave balance
    // endpoint") is now stale — the collection added this route.
    myBalance: "my-leave-balance",
  },

  hourlyLeaveRequests: {
    // NOTE: capital "R" in "Requests" here...
    create: "hourly-leave-Requests",
    list: "hourly-leave-Requests",
    show: (id: number | string) => `hourly-leave-Requests/${id}`,
    update: (id: number | string) => `hourly-leave-Requests/${id}`,
    remove: (id: number | string) => `hourly-leave-Requests/${id}`,
    mine: "my-hourly-leave-request",
  },

  tasks: {
    list: "tasks",
    show: (id: number | string) => `tasks/${id}`,
    start: (id: number | string) => `tasks/${id}/start`,
    submit: (id: number | string) => `tasks/${id}/submit`,
  },

  // Collection-only, newly wired up. Not role-suffixed in the collection
  // (unlike most other folders, which tag requests "e"/"m"/"h"), but the
  // shape (list + mark-a-single-id-as-read) is a standard per-user
  // notification inbox, so treated as employee-accessible like every other
  // authenticated GET without an explicit manager/HR-only marker.
  notifications: {
    list: "notifications",
    markRead: (id: string) => `notifications/${id}/read`,
  },

  // ── Payroll & money (collection-only, newly wired up) ──────────────────
  baseSalaries: {
    // "My base salaries" (plural) — presumably a history of base-salary
    // changes over time rather than a single current figure, since a
    // dedicated `payroll/current` route exists separately below.
    mine: "my-base-salaries",
  },

  deductions: {
    mine: "my-deductions",
  },

  incentives: {
    mine: "my-incentives",
  },

  payroll: {
    current: "payroll/current",
  },

  payslips: {
    mine: "my-payslips",
    // NOTE: not "my-current-month-payslips" — no "my" prefix in the
    // collection at all for this one or "summary-payslips" below, unlike
    // every other self-service route in this API (which is consistently
    // "my-*"). Left in under Payroll & money on the assumption that an
    // authenticated non-privileged user's request is scoped server-side to
    // their own data by default (same assumption CHANGELOG.md already
    // documents for `attendance-filter`) — flag this if either route turns
    // out to return company-wide data instead.
    currentMonth: "current-month-payslips",
    summary: "summary-payslips",
    show: (id: number | string) => `payslips/${id}`,
    download: (id: number | string) => `payslips/${id}/download`,
    preview: (id: number | string) => `payslips/${id}/preview`,
  },

  // ── Performance (collection-only, newly wired up) ───────────────────────
  evaluations: {
    // Explicitly "e"-tagged in the collection, unlike the payroll routes
    // above.
    mine: "myevaluations",
  },

  // ── Overtime (collection-only, newly wired up; manager/HR approval and
  //    "store by manager" routes intentionally omitted — employee scope
  //    only) ────────────────────────────────────────────────────────────
  overtime: {
    mine: "my-overtimes",
    store: "store-overtime-byemployee",
    remove: (id: number | string) => `delete-overtime/${id}/request`,
  },

  // ── Termination requests (collection-only, newly wired up; approve/
  //    reject are manager/HR-only, omitted) ────────────────────────────
  termination: {
    store: "store-termination",
    mine: "my-termination-requests",
    remove: (id: number | string) => `termination-requests/${id}`,
  },

  // ── Complaints (collection-only, newly wired up; the admin-facing list/
  //    review/respond routes are omitted — employee scope only) ─────────
  complaints: {
    store: "complaints",
    mine: "my-complaints",
  },
} as const;
