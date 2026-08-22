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
    user: "user",
    changePassword: "change-password",
  },

  onboarding: {
    upload: "onboarding/upload",
    status: "onboarding/status",
  },

  documents: {
    myContract: "my/contract",
    downloadMyContract: "my/contract/download",
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
    myMonthly: "my-monthly-attendance",
  },

  leaveRequests: {
    create: "leaveRequests",
    list: "leaveRequests",
    show: (id: number | string) => `leaveRequests/${id}`,
    update: (id: number | string) => `leaveRequests/${id}`,
    remove: (id: number | string) => `leaveRequests/${id}`,
    mine: "my-leave-request",
    myBalance: "my-leave-balance",
  },

  hourlyLeaveRequests: {
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
    create: "resignations",
    mine: "resigna/mine",
  },
} as const;
