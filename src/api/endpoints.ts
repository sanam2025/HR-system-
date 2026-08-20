/**
 * Single source of truth for every API path this frontend calls. Scope is
 * intentionally limited to the employee-role, self-service workflows (auth,
 * own profile, onboarding, own documents/contract, own attendance, own
 * leave/hourly-leave requests, own tasks, own payroll data, own complaints,
 * notifications, active announcements) — see CHANGELOG.md for the
 * manager/HR/admin-only endpoints that exist in the Postman collection but
 * are explicitly out of scope for this pass.
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
    downloadMyContract: "my/contract/download",
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
    // CONFIRMED via live backend testing (2026-08-18, employee-role
    // account): this route works and returns real records — the earlier
    // "500 due to invalid ORDER BY" note no longer reproduces.
    myMonthly: "my-monthly-attendance",
    // NOTE: `attendance-today-analysis` and `attendance-percentage` were
    // in this object in an earlier pass but CONFIRMED via live testing
    // (2026-08-18) to 403 "User does not have the right roles." for a real
    // employee account — they're manager/HR-only, not self-service, so
    // they were removed along with the frontend code that called them.
    // `attendance-today` (all-employees daily roster) and
    // `attendance-filter` (date-range query) were never wired to begin
    // with and are almost certainly the same manager/HR scope as those
    // two, going by the naming — left out for the same reason.
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
    // Added to the collection since the last pass — a genuine self-service
    // balance route now exists, closing the gap noted in CHANGELOG.md
    // ("No self-service leave balance endpoint").
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
    // CONFIRMED via live backend testing (2026-08-18, employee-role
    // account): 404 "Route Not Found" — genuinely doesn't exist despite
    // being in the collection. Not called anywhere; left out entirely
    // rather than wired to a route that can't work.
  },

  payroll: {
    myPayslips: "my-payslips",
    payslip: (id: number | string) => `payslips/${id}`,
    currentMonthPayslips: "current-month-payslips",
    payslipsSummary: "summary-payslips",
    payslipPreview: (id: number | string) => `payslips/${id}/preview`,
    payslipDownload: (id: number | string) => `payslips/${id}/download`,
    myBaseSalaries: "my-base-salaries",
    myDeductions: "my-deductions",
    myIncentives: "my-incentives",
  },

  overtime: {
    storeByEmployee: "store-overtime-byemployee",
    mine: "my-overtimes",
  },

  complaints: {
    create: "complaints",
    mine: "my-complaints",
  },

  notifications: {
    list: "notifications",
    markRead: (id: string) => `notifications/${id}/read`,
  },

  announcements: {
    active: "announcements/active",
  },

  people: {
    employees: "users/employees",
    managers: "users/managers",
    departmentMembers: "getMyDepartmentMembers",
  },

  resignations: {
    // CONFIRMED via live backend testing: `POST /resignations` passes role
    // checks for a real employee (a validation error on `type` came back,
    // not a 403) so this is genuinely self-service. `GET /resignations/mine`
    // 403s "User does not have the right roles." for the same account
    // though — likely a backend role-middleware bug (wrong guard on that
    // one route) rather than an intentional restriction, since submitting
    // one's own resignation but never being able to see it back makes no
    // product sense. Wired anyway with the "mine" call tolerating that
    // 403 gracefully. See CHANGELOG.md.
    create: "resignations",
    mine: "resignations/mine",
  },
} as const;
